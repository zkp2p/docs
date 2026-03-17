---
title: Post-Intent Hooks
---

## Overview

Post-intent hooks let integrators run custom logic immediately after an intent is fulfilled, before funds are delivered to the end recipient. Typical uses include split payouts, on-chain actions (stake, swap), builder/affiliate fees, cross-chain bridging, or protocol-specific settlement flows.

Hooks are optional. If a hook is set on an intent, the Orchestrator will approve the hook to pull the executable amount (after protocol/manager/referral fees) and then call the hook. The hook must pull exactly that amount from the Orchestrator and route it as desired. If no hook is set, funds are sent directly to `intent.to`.

---

## Interface (V2)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IPostIntentHookV2 {
    struct HookIntentContext {
        address owner;
        address to;
        address escrow;
        uint256 depositId;
        uint256 amount;
        uint256 timestamp;
        bytes32 paymentMethod;
        bytes32 fiatCurrency;
        uint256 conversionRate;
        bytes32 payeeId;
        bytes signalHookData;   // data from SignalIntentParams.data
    }

    struct HookExecutionContext {
        bytes32 intentHash;
        address token;              // deposit token address
        uint256 executableAmount;   // amount available after all fees
        HookIntentContext intent;
    }

    function execute(
        HookExecutionContext calldata _ctx,
        bytes calldata _fulfillHookData
    ) external;
}
```

Source: `zkp2p-v2-contracts/contracts/interfaces/IPostIntentHookV2.sol`

:::note
The V1 `IPostIntentHook` interface (which took `Intent memory`, `uint256 _amountNetFees`, `bytes calldata`) is used only by the legacy Orchestrator. V3 uses `IPostIntentHookV2` exclusively. The `PostIntentHookRegistry` is also legacy-only; V3 hooks are set per-intent at signal time.
:::

---

## Execution Model

On successful `fulfillIntent`, the OrchestratorV2:
1. Calculates and distributes protocol, manager, and referral fees from `releaseAmount` to get `executableAmount`.
2. Sets allowance for the hook to pull exactly `executableAmount` of the deposit token.
3. Calls `hook.execute(HookExecutionContext, fulfillHookData)`.
4. After execution, checks that the hook pulled exactly `executableAmount` and that the Orchestrator's token balance did not increase; then resets allowance to 0.

If any check fails or the hook reverts, the entire fulfillment reverts and no state changes persist.

Invariants enforced by Orchestrator:
- Hook must pull exactly `executableAmount` via `transferFrom(orchestrator, …)`.
- Hook must not push tokens back to the Orchestrator.
- Allowance is zeroed after execution.

---

## Reading Context

`HookExecutionContext` provides everything hooks typically need:
- `intentHash` — The unique intent identifier.
- `token` — The deposit token address (no need to query Escrow).
- `executableAmount` — Exact amount the hook must pull.
- `intent` — Full intent context including `signalHookData` (set at signal time via `SignalIntentParams.data`).

---

## Supplying Hook Data

- `SignalIntentParams.data` → Persisted in the intent as `intent.data`, forwarded as `HookIntentContext.signalHookData`. Use for static configuration (e.g., split recipients, target address, bridge destination chain).
- `FulfillIntentParams.postIntentHookData` → Passed as `_fulfillHookData` at fulfillment time. Use for dynamic inputs (e.g., memo, execution flags, bridge quote).

Both are forwarded to the hook; use either or both depending on your design.

---

## Built-in Hooks

### AcrossBridgeHookV2

Bridges released funds to another chain via the Across protocol. The hook pulls funds from the Orchestrator and deposits them into the Across SpokePool.

Address: `0xCcC9163451DE31a625D48e417e0fD1a329c7f7cf` (Base mainnet)

---

## Examples

1) Forward payout to a target

```solidity
contract ForwardHookV2 is IPostIntentHookV2 {
  address public immutable orchestrator;
  constructor(address _orchestrator) { orchestrator = _orchestrator; }

  function execute(HookExecutionContext calldata ctx, bytes calldata) external override {
    require(msg.sender == orchestrator, "only orchestrator");
    address target = abi.decode(ctx.intent.signalHookData, (address));
    require(target != address(0), "target=0");
    IERC20(ctx.token).transferFrom(msg.sender, target, ctx.executableAmount);
  }
}
```

2) Split payout (e.g., 95% to `intent.to`, 5% to builder)

```solidity
contract SplitHookV2 is IPostIntentHookV2 {
  address public immutable orchestrator;
  address public immutable builder;
  constructor(address _orchestrator, address _builder) { orchestrator = _orchestrator; builder = _builder; }

  function execute(HookExecutionContext calldata ctx, bytes calldata) external override {
    require(msg.sender == orchestrator, "only orchestrator");
    uint256 fee = ctx.executableAmount * 5 / 100;
    uint256 toAmt = ctx.executableAmount - fee;
    IERC20(ctx.token).transferFrom(msg.sender, ctx.intent.to, toAmt);
    IERC20(ctx.token).transferFrom(msg.sender, builder, fee);
  }
}
```

3) What will revert
- Pulling only part of `executableAmount` → Orchestrator checks and reverts.
- Sending any tokens to the Orchestrator during execution → balance-increase check reverts.

---

## Integration Steps

1. Implement `IPostIntentHookV2` with the structured `HookExecutionContext`.
2. Deploy your hook. Note the Orchestrator address for access control.
3. When signaling an intent, set `postIntentHook` to your hook address and encode any static inputs in `data`.
4. When fulfilling, pass any dynamic `postIntentHookData` as needed.

Security tips
- Keep execution deterministic and short; long external calls may waste gas or revert fulfillments.
- Do not rely on reentrancy into Orchestrator; it uses `ReentrancyGuard` in `fulfillIntent`.
- Always pull exactly the approved `executableAmount` from the Orchestrator and handle tokens that may return `false` — use OpenZeppelin `SafeERC20` if needed.
- The hook receives the token address in `ctx.token`, so it does not need to query the Escrow.
