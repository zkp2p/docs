---
title: Post‑Intent Hooks
---

## Overview

Post‑intent hooks let integrators run custom logic immediately after an intent is fulfilled, before funds are delivered to the end recipient. Typical uses include split payouts, on‑chain actions (stake, swap), builder/affiliate fees, or protocol‑specific settlement flows.

Hooks are optional. If a hook is set on an intent, the Orchestrator will approve the hook to pull the entire net amount (after protocol/referrer fees) and then call the hook. The hook must pull exactly that amount from the Orchestrator and route it as desired. If no hook is set, funds are sent directly to `intent.to`.

---

## Interface

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { IOrchestrator } from "./IOrchestrator.sol";

/**
 * @title IPostIntentHook
 * @notice Interface for post-intent hooks
 */
interface IPostIntentHook {
    /**
     * @notice Post-intent hook
     * @param _intent The intent data structure containing all intent information
     * @param _fulfillIntentData The data passed to fulfillIntent
     */
    function execute(
        IOrchestrator.Intent memory _intent,
        uint256 _amountNetFees,
        bytes calldata _fulfillIntentData
    ) external;
}
```

Source: `zkp2p-v2-contracts/contracts/interfaces/IPostIntentHook.sol`.

---

## Execution Model

- On successful `fulfillIntent`, the Orchestrator:
  - Calculates protocol and referrer fees, subtracts them from `releaseAmount` to get `_amountNetFees`.
  - Approves the hook for exactly `_amountNetFees` of the deposit token.
  - Calls `hook.execute(intent, _amountNetFees, postIntentHookData)`.
  - After execution, checks that the hook pulled exactly `_amountNetFees` and that the Orchestrator’s token balance did not increase; then it resets allowance to 0.
- If any check fails or the hook reverts, the entire fulfillment reverts and no state changes persist.

Invariants enforced by Orchestrator:
- Hook must pull exactly `_amountNetFees` via `transferFrom(orchestrator, …)`.
- Hook must not push tokens back to the Orchestrator.
- Allowance is zeroed after execution.

---

## Supplying Hook Data

- `intent.data` (bytes): set at `signalIntent` for static configuration (e.g., split recipients, target address).
- `postIntentHookData` (bytes): supplied at `fulfillIntent` for dynamic inputs (e.g., memo, execution flags).

Both are forwarded to the hook; use either or both depending on your design.

---

## Access Control and Whitelisting

- Hooks must be whitelisted in `PostIntentHookRegistry`; otherwise `signalIntent` reverts with `PostIntentHookNotWhitelisted`.
- Recommended pattern in hooks: `require(msg.sender == expectedOrchestrator)` to ensure only the Orchestrator can trigger execution.

Relevant addresses (Base mainnet): see Protocol V3 → Deployments for `PostIntentHookRegistry` and `Orchestrator` addresses.

---

## Reading Context

`IOrchestrator.Intent` includes:
- `owner`, `to`, `escrow`, `depositId`, `amount`, `timestamp`
- `paymentMethod`, `fiatCurrency`, `conversionRate`, `payeeId`
- `referrer`, `referrerFee`, `postIntentHook`, `data`

To discover the token:

```
import { IEscrow } from "zkp2p-v2-contracts/contracts/interfaces/IEscrow.sol";
IEscrow.Deposit memory dep = IEscrow(_intent.escrow).getDeposit(_intent.depositId);
IERC20 token = dep.token;
```

---

## Examples

1) Forward payout to a target

```
contract ForwardHook is IPostIntentHook {
  IERC20 public immutable token;
  address public immutable orchestrator;
  constructor(address _token, address _orchestrator){ token = IERC20(_token); orchestrator = _orchestrator; }

  function execute(IOrchestrator.Intent memory intent, uint256 amount, bytes calldata) external override {
    require(msg.sender == orchestrator, "only orchestrator");
    address target = abi.decode(intent.data, (address));
    require(target != address(0), "target=0");
    token.transferFrom(msg.sender, target, amount);
  }
}
```

2) Split payout (e.g., 95% to `intent.to`, 5% to builder)

```
contract SplitHook is IPostIntentHook {
  IERC20 public immutable token; address public immutable orchestrator; address public immutable builder;
  constructor(address _token, address _orchestrator, address _builder){ token = IERC20(_token); orchestrator=_orchestrator; builder=_builder; }
  function execute(IOrchestrator.Intent memory intent, uint256 amount, bytes calldata) external override {
    require(msg.sender == orchestrator, "only orchestrator");
    uint256 fee = amount * 5 / 100; uint256 toAmt = amount - fee;
    token.transferFrom(msg.sender, intent.to, toAmt);
    token.transferFrom(msg.sender, builder, fee);
  }
}
```

3) What will revert
- Pulling only part of `amount` (e.g., half) → Orchestrator checks and reverts.
- Sending any tokens to the Orchestrator during execution → balance‑increase check reverts.
- Unwhitelisted hook → cannot be set on intent.

See `zkp2p-v2-contracts/contracts/mocks/*PostIntentHook*.sol` for more patterns (partial pull, push, reentrancy tests).

---

## Integration Steps

- Deploy your hook with the expected Orchestrator (and token if using a fixed token pattern).
- Ask governance to whitelist it in `PostIntentHookRegistry`.
- When signaling an intent, set `postIntentHook` and encode any static inputs in `data`.
- When fulfilling, pass any dynamic `postIntentHookData` as needed.

Security tips
- Keep execution deterministic and short; long external calls may waste gas or revert fulfillments.
- Do not rely on reentrancy into Orchestrator; it uses `ReentrancyGuard` in `fulfillIntent`.
- Always pull exactly the approved `amount` from the Orchestrator and handle tokens that may return `false`—use OpenZeppelin `SafeERC20` if needed.

