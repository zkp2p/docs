---
title: Escrow
---

## Overview

The Escrow contract (EscrowV2) in V3 focuses on deposits and token custody. It lets sellers configure supported payment methods (bytes32), currencies and minimum conversion rates, and manages locking/unlocking when intents are signaled/fulfilled via authorized Orchestrators.

Compared to older versions, Escrow no longer verifies payments directly or manages the full intent lifecycle — that responsibility moved to the Orchestrator. EscrowV2 also introduces oracle-driven rate floors, delegated rate management, dust sweeping, and multi-orchestrator support via OrchestratorRegistry.

---

## Constants

- `uint256 internal constant PRECISE_UNIT = 1e18;`
- `uint256 internal constant BPS = 10_000;`
- `int256 internal constant SIGNED_BPS = 10_000;`
- `uint256 internal constant MAX_DUST_THRESHOLD = 1e6; // 1 USDC`
- `uint256 internal constant MAX_TOTAL_INTENT_EXPIRATION_PERIOD = 5 days;`
- `uint256 internal constant MAX_ADAPTER_CONFIG_BYTES = 256;`

---

## Key State

- `IOrchestratorRegistry public orchestratorRegistry` — Registry of authorized orchestrator contracts that can lock/unlock funds.
- `IPaymentVerifierRegistry public paymentVerifierRegistry` — Registry providing allowed payment methods/currencies.
- `uint256 public immutable chainId` — Deployment chain id.
- `address public dustRecipient` — Address that receives dust swept from auto-closed deposits.
- `uint256 public dustThreshold` — Remaining deposit amount below which dust sweep triggers (max 1 USDC).
- `uint256 public maxIntentsPerDeposit` — Maximum concurrent intents per deposit.
- `uint256 public intentExpirationPeriod` — Default intent expiration duration.
- `mapping(address => uint256[]) accountDeposits` — Deposit ids per account.
- `mapping(uint256 => Deposit) deposits` — Core deposit data:
  - `depositor`, `delegate`, `token`, `intentAmountRange (min,max)`, `acceptingIntents`, `remainingDeposits`, `outstandingIntentAmount`, `intentGuardian`, `retainOnEmpty`.
- Per-deposit payment configuration:
  - `depositPaymentMethodData[depositId][paymentMethod]` → `{ intentGatingService, payeeDetails (bytes32), data (bytes) }`
  - `depositPaymentMethods[depositId]` — list of methods; `depositPaymentMethodActive` — active flag; `depositPaymentMethodListed` — ever-listed flag.
  - `depositCurrencies[depositId][paymentMethod]` — list of currency codes (bytes32)
  - `depositCurrencyMinRate[depositId][paymentMethod][currency]` — min conversion rate (1e18)
- Per-deposit oracle and rate manager configuration:
  - `depositOracleRateConfig[depositId][paymentMethod][currency]` → `OracleRateConfig`
  - `depositRateManagerConfig[depositId]` → `RateManagerConfig`

---

## Create Deposit

`function createDeposit(CreateDepositParams calldata _params)`

`function depositTo(address _depositor, CreateDepositParams calldata _params)` — Third-party funded deposits. Allows anyone to create a deposit on behalf of `_depositor`.

CreateDepositParams
```
struct Range { uint256 min; uint256 max; }

struct OracleRateConfig {
  address adapter;        // IOracleAdapter address (address(0) = disabled)
  bytes adapterConfig;    // Adapter-specific config (max 256 bytes)
  int16 spreadBps;        // Signed spread applied to oracle market rate
  uint32 maxStaleness;    // Max age of oracle data in seconds
}

struct Currency {
  bytes32 code;                   // keccak256(utf8(currencyCode))
  uint256 minConversionRate;      // Fixed rate floor (1e18 precision)
  OracleRateConfig oracleRateConfig; // Optional oracle rate config (adapter == address(0) means disabled)
}

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
  Currency[][] currencies;                     // per method (includes optional oracle config)
  address delegate;                            // optional
  address intentGuardian;                      // optional
  bool retainOnEmpty;                          // keep config when empty
}
```

Notes
- `paymentMethods` and `currencies` must be whitelisted in `PaymentVerifierRegistry`.
- `payeeDetails` is bytes32 (do not store raw handles on-chain).
- All min rates use 1e18 precision.
- `OracleRateConfig` can be set inline at creation or later via `setOracleRateConfig`.

---

## Managing Deposits

- `addFunds(depositId, amount)` — Add liquidity (ERC20 must be approved). Callable by anyone.
- `removeFunds(depositId, amount)` — May prune expired intents to reclaim liquidity.
- `withdrawDeposit(depositId)` — Returns remaining funds (+expired intent funds), and closes when no outstanding intents.
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

### Oracle Rate Configuration

Depositors can configure oracle-driven rate floors for any currency on their deposit. When configured, the effective rate for a currency is `max(fixedRate, oracleSpreadRate)` — the oracle can only raise the floor, never lower it below the fixed rate.

```
struct OracleRateConfig {
  address adapter;        // IOracleAdapter implementation (e.g., ChainlinkOracleAdapter)
  bytes adapterConfig;    // Feed-specific config (max 256 bytes)
  int16 spreadBps;        // Signed spread in basis points applied to oracle market rate
  uint32 maxStaleness;    // Max staleness in seconds
}
```

The oracle spread rate is computed as: `oracleRate = marketRate * (10_000 + spreadBps) / 10_000`. Negative spreads are allowed (discount below market). The constraint `(10_000 + spreadBps) > 0` is enforced.

If the oracle returns invalid data or the price is staler than `maxStaleness`, the oracle rate is treated as 0, which means only the fixed rate floor applies. If the fixed rate is also 0, the currency pair is effectively halted.

Management functions:
- `setOracleRateConfig(depositId, paymentMethod, currencyCode, config)` — Set oracle config for a single currency.
- `setOracleRateConfigBatch(depositId, paymentMethods[], currencyCodes[][], configs[][])` — Batch set.
- `removeOracleRateConfig(depositId, paymentMethod, currencyCode)` — Remove oracle config (reverts to fixed rate only).
- `updateCurrencyConfigBatch(depositId, paymentMethods[], CurrencyRateUpdate[][])` — Batch update fixed rates and/or oracle configs in a single call.
- `deactivateCurrenciesBatch(depositId, paymentMethods[], currencyCodes[][])` — Batch deactivate currencies.

### Delegated Rate Management

Depositors can delegate rate management to an external `IRateManager` contract (e.g., RateManagerV1). The delegated rate manager can set rates on behalf of the depositor without requiring deposit ownership.

```
struct RateManagerConfig {
  address rateManager;    // IRateManager contract address
  bytes32 rateManagerId;  // Identifier within the rate manager contract
}
```

When a rate manager is set, the effective rate becomes: `max(escrowFloor, delegatedRate)` where `escrowFloor = max(fixedRate, oracleSpreadRate)`. The delegated rate can only raise the effective rate above the escrow floor, never lower it. If the rate manager reverts, the escrow floor is used as fallback.

Management functions:
- `setRateManager(depositId, rateManager, rateManagerId)` — Opt into delegated rate management.
- `clearRateManager(depositId)` — Remove delegated rate manager.

View functions:
- `getEffectiveRate(depositId, paymentMethod, currencyCode)` — Returns `max(fixedRate, oracleRate, delegatedRate)`.
- `getManagerFee(depositId)` — Returns the fee recipient and fee amount from the rate manager. The manager fee is snapshotted at intent signal time and distributed at fulfillment.

### Dust Sweep & Auto-Close

When a deposit's `remainingDeposits` drops to or below `dustThreshold` and there are no outstanding intents:
- If `retainOnEmpty = false`: the deposit is auto-closed and any remaining dust is swept to `dustRecipient`.
- If `retainOnEmpty = true`: the deposit config is kept for reuse (e.g., the depositor can add more funds later without reconfiguring payment methods).

---

## Orchestrator Integration

EscrowV2 uses `OrchestratorRegistry` to authorize callers. Any orchestrator registered in the registry can call these functions:

- `lockFunds(depositId, intentHash, amount)` — Called by Orchestrator on signal.
- `unlockFunds(depositId, intentHash)` — Called on cancel/expire.
- `unlockAndTransferFunds(depositId, intentHash, transferAmount, to)` — Called on fulfillment; returns net amount (after fees) to Orchestrator for onward distribution.

Reference: `zkp2p-v2-contracts/contracts/EscrowV2.sol`
