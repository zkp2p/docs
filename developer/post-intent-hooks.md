---
title: Post‑Intent Hooks (V3)
slug: /developer/api/v3/post-intent-hooks
---

# Build a Post‑Intent Hook

This guide shows how to write, deploy, whitelist, and use a post‑intent hook with the V3 Orchestrator.

## What a hook does

After `fulfillIntent`, the Orchestrator approves your hook to pull the net token amount (`_amountNetFees`) and calls:

```
function execute(IOrchestrator.Intent memory _intent, uint256 _amountNetFees, bytes calldata _fulfillIntentData) external;
```

Your contract must `transferFrom(orchestrator, …)` exactly `_amountNetFees` and route funds. If it doesn’t pull the full amount, or if it pushes tokens into the Orchestrator, fulfillment reverts.

## Minimal template

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IPostIntentHook } from "zkp2p-v2-contracts/contracts/interfaces/IPostIntentHook.sol";
import { IOrchestrator } from "zkp2p-v2-contracts/contracts/interfaces/IOrchestrator.sol";

contract MyHook is IPostIntentHook {
  IERC20 public immutable token;     // deposit token; or fetch via IEscrow on each call
  address public immutable orchestrator;

  constructor(address _token, address _orchestrator) {
    token = IERC20(_token);
    orchestrator = _orchestrator;
  }

  function execute(IOrchestrator.Intent memory intent, uint256 amount, bytes calldata data) external override {
    require(msg.sender == orchestrator, "only orchestrator");
    // Example: forward everything to the `to` address
    token.transferFrom(msg.sender, intent.to, amount);
  }
}
```

Alternative: fetch the token dynamically

```
import { IEscrow } from "zkp2p-v2-contracts/contracts/interfaces/IEscrow.sol";
IERC20 token = IEscrow(intent.escrow).getDeposit(intent.depositId).token;
token.transferFrom(msg.sender, intent.to, amount);
```

## Encode inputs

- Static config at signal time → `SignalIntentParams.data`.
- Dynamic inputs at fulfill time → `FulfillIntentParams.postIntentHookData`.

Both fields are delivered to `execute` (`intent.data` and `data`).

## Whitelist your hook

Governance must add your hook to `PostIntentHookRegistry` before users can set it on intents.

- Base mainnet addresses are listed in Protocol → V3 → Deployments.

Example (pseudo‑script)

```
registry.addPostIntentHook(myHookAddress) // owner‑only
```

## Use the hook from a client

Signal an intent with a hook:

```
const params = {
  escrow,
  depositId,
  amount,
  to,
  paymentMethod,           // bytes32 keccak256("venmo") etc.
  fiatCurrency,            // bytes32 keccak256("USD") etc.
  conversionRate,          // 1e18 scale
  referrer: ethers.ZeroAddress,
  referrerFee: 0n,
  gatingServiceSignature,
  signatureExpiration,
  postIntentHook: myHookAddress,
  data: abi.encode(targetAddress)
};
await orchestrator.signalIntent(params);
```

Fulfill with optional hook data:

```
await orchestrator.fulfillIntent({
  paymentProof: encodedPaymentAttestation,
  intentHash,
  verificationData: "0x",
  postIntentHookData: abi.encode(/* dynamic flags, memo, etc. */)
});
```

## Example hooks

1) Forward to a target from `intent.data`

```
address target = abi.decode(intent.data, (address));
token.transferFrom(msg.sender, target, amount);
```

2) Split 95/5 between taker and builder

```
uint256 fee = amount * 5 / 100; uint256 toAmt = amount - fee;
token.transferFrom(msg.sender, intent.to, toAmt);
token.transferFrom(msg.sender, builder, fee);
```

3) Multi‑call pattern (pull to self, then act)

```
token.transferFrom(msg.sender, address(this), amount);
// approve router, stake, swap, etc., then forward remainder to intent.to
```

## What will fail

- Pulling less than `amount` → revert (must pull exactly the approved amount).
- Sending tokens into the Orchestrator during execution → revert.
- Unwhitelisted hook on `signalIntent` → revert.

## Tips

- Keep execution short and deterministic; reverts undo the whole `fulfillIntent`.
- Use `SafeERC20` for non‑standard tokens.
- Consider storing the Orchestrator immutable and checking `msg.sender` to restrict execution.

