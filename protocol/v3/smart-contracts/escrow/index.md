---
title: Escrow
---

## Overview

The Escrow contract in V3 focuses on deposits and token custody. It lets sellers configure supported payment methods (bytes32), currencies and minimum conversion rates, and manages locking/unlocking when intents are signaled/fulfilled via the Orchestrator.

Compared to older versions, Escrow no longer verifies payments directly or manages the full intent lifecycle — that responsibility moved to the Orchestrator.

---

## Constants

- `uint256 internal constant PRECISE_UNIT = 1e18;`
- `uint256 internal constant MAX_DUST_THRESHOLD = 1e6; // 1 USDC`
- `uint256 internal constant MAX_TOTAL_INTENT_EXPIRATION_PERIOD = 5 days;`

---

## Key State

- `IOrchestrator public orchestrator` — Orchestrator contract authorized to lock/unlock.
- `IPaymentVerifierRegistry public paymentVerifierRegistry` — registry providing allowed payment methods/currencies.
- `uint256 public immutable chainId` — deployment chain id.
- `mapping(address => uint256[]) accountDeposits` — deposit ids per account.
- `mapping(uint256 => Deposit) deposits` — core deposit data:
  - `depositor`, `delegate`, `token`, `intentAmountRange (min,max)`, `acceptingIntents`, `remainingDeposits`, `outstandingIntentAmount`, `intentGuardian`, `retainOnEmpty`.
- Per‑deposit payment configuration:
  - `depositPaymentMethodData[depositId][paymentMethod]` → `{ intentGatingService, payeeDetails (bytes32), data (bytes) }`
  - `depositPaymentMethods[depositId]` — list of methods; `depositPaymentMethodActive` — active flag; `depositPaymentMethodListed` — ever-listed flag.
  - `depositCurrencies[depositId][paymentMethod]` — list of currency codes (bytes32)
  - `depositCurrencyMinRate[depositId][paymentMethod][currency]` — min conversion rate (1e18)

---

## Create Deposit

`function createDeposit(CreateDepositParams calldata _params)`

CreateDepositParams
```
struct Range { uint256 min; uint256 max; }
struct Currency { bytes32 code; uint256 minConversionRate; }
struct DepositPaymentMethodData {
  address intentGatingService;
  bytes32 payeeDetails;   // hashed off-chain identifier
  bytes data;             // optional verifier data (e.g., witness set)
}
struct CreateDepositParams {
  IERC20 token;
  uint256 amount;
  Range intentAmountRange;
  bytes32[] paymentMethods;                    // e.g., keccak256("venmo")
  DepositPaymentMethodData[] paymentMethodData;// 1:1 with paymentMethods
  Currency[][] currencies;                     // per method
  address delegate;                            // optional
  address intentGuardian;                      // optional
  bool retainOnEmpty;                          // keep config when empty
}
```

Notes
- `paymentMethods` and `currencies` must be whitelisted in `PaymentVerifierRegistry`.
- `payeeDetails` is bytes32 (do not store raw handles on-chain).
- All min rates use 1e18 precision.

---

## Managing Deposits

- `addFunds(depositId, amount)` — add liquidity (ERC20 must be approved).
- `removeFunds(depositId, amount)` — may prune expired intents to reclaim liquidity.
- `withdrawDeposit(depositId)` — returns remaining funds (+expired intent funds), and closes when no outstanding intents.
- Payment method management:
  - `addPaymentMethods(depositId, methods, methodData, currencies)`
  - `setPaymentMethodActive(depositId, method, active)`
  - `addCurrencies(depositId, method, currencies[])`
  - `deactivateCurrency(depositId, method, currency)`
  - `setCurrencyMinRate(depositId, method, currency, newMinRate)`
- Other controls:
  - `setAcceptingIntents(depositId, bool)`
  - `setIntentRange(depositId, Range)`
  - `setDelegate(depositId, address)` / `removeDelegate(depositId)`
  - `extendIntentExpiry(depositId, intentHash, newExpiry)` (only `intentGuardian`)

---

## Orchestrator Integration

- `lockFunds(depositId, intentHash, amount)` — called by Orchestrator on signal.
- `unlockFunds(depositId, intentHash)` — called on cancel/expire.
- `unlockAndTransferFunds(depositId, intentHash, transferAmount, to)` — called on fulfillment; returns net amount (after fees) to Orchestrator for onward distribution.
