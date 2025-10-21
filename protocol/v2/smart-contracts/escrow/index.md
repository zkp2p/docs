---
title: Escrow (V2)
---

## Overview

The Escrow contract allows users to lock ERC-20 tokens in order to receive off-chain payments. Users deposit tokens specifying:

- Which off-chain payment verifiers they accept.
- Conversion rates for various fiat currencies.
- A gating service (optional) that can sign a user's intent to claim funds.

When a taker signals an intent to pay off-chain, they specify how many tokens they want to claim and through which payment verifier. Upon proving the off-chain payment has occurred (by calling `fulfillIntent`), the escrow releases the on-chain tokens to the taker (minus applicable fees).

---

## Constants

- `uint256 internal constant PRECISE_UNIT = 1e18;`
- `uint256 constant CIRCOM_PRIME_FIELD = ...;`
- `uint256 constant MAX_SUSTAINABILITY_FEE = 5e16; // 5%`

---

## State Variables

- `uint256 public immutable chainId;`  
  The chain ID where this contract is deployed.

- `mapping(address => uint256[]) public accountDeposits;`  
  Which deposits belong to a given address.

- `mapping(address => bytes32) public accountIntent;`  
  Tracks a single active intent for each address.

- `mapping(uint256 => mapping(address => DepositVerifierData)) public depositVerifierData;`  
  Links a deposit ID + verifier to the relevant verification data (e.g., payee details).

- `mapping(uint256 => address[]) public depositVerifiers;`  
  Lists all verifiers associated with a deposit.

- `mapping(uint256 => mapping(address => mapping(bytes32 => uint256))) public depositCurrencyConversionRate;`  
  For a given deposit ID and verifier, maps fiat currency -> conversion rate.

- `mapping(uint256 => mapping(address => bytes32[])) public depositCurrencies;`  
  For a given deposit ID and verifier, stores an array of fiat currencies.

- `mapping(uint256 => Deposit) public deposits;`  
  The core deposit data.

- `mapping(bytes32 => Intent) public intents;`  
  All signaled intents (by their intent hash).

- Whitelist / Governance  
  - `bool public acceptAllPaymentVerifiers;`  
  - `mapping(address => bool) public whitelistedPaymentVerifiers;`  
  - `mapping(address => uint256) public paymentVerifierFeeShare;`

- `uint256 public intentExpirationPeriod;`  
  After which an intent is considered expired.

- `uint256 public sustainabilityFee;`  
  Fee (in `PRECISE_UNIT` terms) taken from each successful intent fulfillment.

- `address public sustainabilityFeeRecipient;`  
  Where the sustainability fee is sent.

- `uint256 public depositCounter;`  
  Incremented to create unique deposit IDs.

---

## Constructor

```
constructor(
    address _owner,
    uint256 _chainId,
    uint256 _intentExpirationPeriod,
    uint256 _sustainabilityFee,
    address _sustainabilityFeeRecipient
) Ownable() { ... }
```

Parameters:

- `_owner`: The address to set as the contract owner (can pause, unpause, and manage verifiers).
- `_chainId`: The chain ID for which this escrow is valid.
- `_intentExpirationPeriod`: Time (in seconds) after which an open intent can be pruned.
- `_sustainabilityFee`: Percentage (in 1e18 precision) charged upon successful intent fulfillment.
- `_sustainabilityFeeRecipient`: Address to receive the sustainability fees.

Transfers ownership to `_owner` and sets initial contract state.

---

## External Functions

### createDeposit

```
function createDeposit(
    IERC20 _token,
    uint256 _amount,
    Range calldata _intentAmountRange,
    address[] calldata _verifiers,
    DepositVerifierData[] calldata _verifierData,
    Currency[][] calldata _currencies
)
    external
    whenNotPaused
```

Description: Deposits `_amount` of `_token` into escrow. You specify:

- A range of intent sizes (`_intentAmountRange`).
- Which verifiers (`_verifiers`) the deposit will accept.
- Gating + payee details for each verifier (`_verifierData`).
- Which currencies (and rates) each verifier can handle (`_currencies`).

Requirements:

- User must have approved this contract to transfer `_amount` of `_token`.
- The deposit is unique (each call yields a new `depositId`).
- `_amount` must be >= `min` of `_intentAmountRange`.
- `_verifiers` length must match `_verifierData` and `_currencies` length.
- Each verifier must be whitelisted or `acceptAllPaymentVerifiers` must be `true`.
- Each currency's `conversionRate` must be > 0.

Effects:

- Increments `depositCounter`.
- Stores the deposit data.
- Locks the tokens in this contract.
- Emits `DepositReceived` and `DepositVerifierAdded` (and `DepositCurrencyAdded`) events.

---

### signalIntent

```
function signalIntent(
    uint256 _depositId,
    uint256 _amount,
    address _to,
    address _verifier,
    bytes32 _fiatCurrency,
    bytes calldata _gatingServiceSignature
)
    external
    whenNotPaused
```

Description: A taker declares an intent to pay the deposit's off-chain counterpart. This:

- Ensures the deposit is still `acceptingIntents`.
- Validates `_amount` against deposit's range.
- Optionally checks a gating service signature.
- Reserves `_amount` from the deposit's `remainingDeposits`.
- Records a new `Intent` in `intents`.

Requirements:

- Caller must not have another active `Intent` (`accountIntent[msg.sender] == 0`).
- `_amount` is within the deposit's `intentAmountRange`.
- `_fiatCurrency` is recognized in `depositCurrencyConversionRate[_depositId][_verifier]`.

Effects:

- May prune expired intents if liquidity is insufficient.
- Emits `IntentSignaled` upon success.

---

### cancelIntent

```
function cancelIntent(bytes32 _intentHash) external
```

Description: Allows the intent owner to cancel an intent. This frees up the escrowed amount. Reverts if `msg.sender` is not the intent owner.

---

### fulfillIntent

```
function fulfillIntent(bytes calldata _paymentProof, bytes32 _intentHash) external whenNotPaused
```

Description: Attempts to prove that the off-chain payment has been made according to the associated payment verifier. On success:

- The escrowed tokens are transferred to the specified `to` address.
- Fees are taken out for sustainability and optionally the payment verifier.

Parameters:

- `_paymentProof` -- The proof data for verifying off-chain payment (e.g., TLSNotary, ZK, etc.).
- `_intentHash` -- The ID of the signaled intent.

Reverts if:

- The verifier check fails.
- The `_intentHash` does not match the proof's extracted intent hash.

Emits:

- `IntentFulfilled` event.

---

### releaseFundsToPayer

```
function releaseFundsToPayer(bytes32 _intentHash) external
```

Description: Allows the deposit owner (not the intent owner) to push funds to the off-chain payer's `to` address, effectively acknowledging the payment or an alternative arrangement.

Effects:

- Removes the intent from state.
- Transfers tokens to the `intent.owner` or `intent.to`.
- Emits `IntentFulfilled` event with zero verifier address.

---

### updateDepositConversionRate

```
function updateDepositConversionRate(
    uint256 _depositId,
    address _verifier,
    bytes32 _fiatCurrency,
    uint256 _newConversionRate
)
    external
    whenNotPaused
```

Description: The depositor can adjust the deposit's conversion rate for a specific currency and verifier. Only future intents will be affected; existing ones store the old rate.

---

### withdrawDeposit

```
function withdrawDeposit(uint256 _depositId) external
```

Description: Withdraws any unencumbered tokens from the deposit. Prunes any expired intents (making more tokens claimable). If no tokens remain (and no open intents), the deposit is fully closed and removed.

---

## Governance Functions

### addWhitelistedPaymentVerifier

```
function addWhitelistedPaymentVerifier(address _verifier, uint256 _feeShare) external onlyOwner
```

Adds a payment verifier to the whitelist, with a certain `_feeShare`.

### removeWhitelistedPaymentVerifier

```
function removeWhitelistedPaymentVerifier(address _verifier) external onlyOwner
```

Removes a verifier from the whitelist.

### updatePaymentVerifierFeeShare

```
function updatePaymentVerifierFeeShare(address _verifier, uint256 _feeShare) external onlyOwner
```

Updates the fee share for a given whitelisted verifier.

### updateAcceptAllPaymentVerifiers

```
function updateAcceptAllPaymentVerifiers(bool _acceptAllPaymentVerifiers) external onlyOwner
```

Toggles whether any verifier address can be used (bypassing the whitelist).

### setSustainabilityFee

```
function setSustainabilityFee(uint256 _fee) external onlyOwner
```

Sets the global sustainability fee (max 5%). Fee is taken upon intent fulfillment.

### setSustainabilityFeeRecipient

```
function setSustainabilityFeeRecipient(address _feeRecipient) external onlyOwner
```

Sets the address receiving protocol fees.

### setIntentExpirationPeriod

```
function setIntentExpirationPeriod(uint256 _intentExpirationPeriod) external onlyOwner
```

Updates how long an intent remains valid before it can be pruned.

### pauseEscrow / unpauseEscrow

```
function pauseEscrow() external onlyOwner
function unpauseEscrow() external onlyOwner
```

Pauses or unpauses the contract's core functions:

- Paused: Creates deposit, updates conversion rate, signals/fulfills intent are disabled.
- Unpaused: Resumes all functionalities.

---

## External View Functions

### getPrunableIntents

```
function getPrunableIntents(uint256 _depositId)
    external
    view
    returns (bytes32[] memory prunableIntents, uint256 reclaimedAmount);
```

Returns a list of expired (prunable) intent hashes for a deposit and the total amount they occupy.

### getDeposit

```
function getDeposit(uint256 _depositId)
    public
    view
    returns (DepositView memory depositView);
```

Returns a DepositView, including:

- The deposit details.
- Available liquidity (accounting for expired intents).
- Associated verifiers/currency data.

### getAccountDeposits

```
function getAccountDeposits(address _account)
    external
    view
    returns (DepositView[] memory depositArray);
```

Returns the set of deposits belonging to `_account`.

### getDepositFromIds

```
function getDepositFromIds(uint256[] memory _depositIds)
    external
    view
    returns (DepositView[] memory depositArray);
```

Returns the `DepositView[]` for a given list of deposit IDs (part of IEscrow interface).

### getIntent

```
function getIntent(bytes32 _intentHash)
    public
    view
    returns (IntentView memory intentView);
```

Provides the IntentView, linking the intent to its deposit.

### getIntents

```
function getIntents(bytes32[] calldata _intentHashes)
    external
    view
    returns (IntentView[] memory intentArray);
```

Batch retrieval of multiple intents.

### getAccountIntent

```
function getAccountIntent(address _account)
    external
    view
    returns (IntentView memory intentView);
```

Returns the active intent (if any) for a given account.
