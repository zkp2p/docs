---
title: Offramp (V3)
slug: /developer/api/v3/offramp
---

# Offramp (V3)

This guide covers creating a deposit in V3. The major change vs V2 is that deposits declare supported payment methods by bytes32 identifiers (e.g., keccak256("venmo")) rather than per-platform verifier addresses, and you pass hashed payee details on-chain.

## Getting Started

- Request an API key from the [ZKP2P team](mailto:team@zkp2p.xyz).
- Use the Maker endpoints to validate and store seller metadata (raw usernames), which returns a hashed identifier for on-chain use.

## Flow

1) Validate deposit details
```ts
// POST /v1/makers/validate
// Body shape (example: Venmo)
{
  depositData: { venmoUsername: "ethereum", telegramUsername: "@example" },
  processorName: "venmo"
}
```

2) Create deposit details
```ts
// POST /v1/makers/create
// Returns: { id, processorName, depositData, hashedOnchainId, createdAt }
```

3) Approve USDC for Escrow
```solidity
IERC20(USDC).approve(ESCROW, amount);
```

4) Create deposit on Escrow (V3)

CreateDepositParams (IEscrow)
```solidity
struct Range { uint256 min; uint256 max; }
struct Currency { bytes32 code; uint256 minConversionRate; }
struct DepositPaymentMethodData {
  address intentGatingService; // signer used by Curator/Gating
  bytes32 payeeDetails;        // bytes32 hash (from /v1/makers/create → hashedOnchainId)
  bytes data;                  // optional verifier data (e.g., witness addresses)
}

struct CreateDepositParams {
  IERC20 token;
  uint256 amount;
  Range intentAmountRange;
  bytes32[] paymentMethods;                    // e.g., [keccak256("venmo"), keccak256("revolut")]
  DepositPaymentMethodData[] paymentMethodData; // one per payment method
  Currency[][] currencies;                      // one array per payment method
  address delegate;                             // optional manager
  address intentGuardian;                       // optional expiry extender
  bool retainOnEmpty;                           // keep config when empty
}
```

Example (ethers.js)
```ts
import { ethers } from "ethers";

const keccak = (s: string) => ethers.keccak256(ethers.toUtf8Bytes(s));

// 1) Hash payment methods and currencies
const METHOD_VENMO = keccak("venmo");
const METHOD_REVOLUT = keccak("revolut");
const USD = keccak("USD");
const EUR = keccak("EUR");

// 2) From /v1/makers/create response
const hashedOnchainId = "0x..."; // responseObject.hashedOnchainId

// 3) Optional verifier data (e.g., witness set)
const verifierData = ethers.AbiCoder.defaultAbiCoder().encode([
  "address[]"
], [["0x0636c417755E3ae25C6c166D181c0607F4C572A3"]]);

// 4) Build params
const params = {
  token: USDC_ADDRESS,
  amount: ethers.parseUnits("1000", 6),
  intentAmountRange: { min: ethers.parseUnits("10", 6), max: ethers.parseUnits("500", 6) },
  paymentMethods: [METHOD_VENMO, METHOD_REVOLUT],
  paymentMethodData: [
    { intentGatingService: GATING_SERVICE, payeeDetails: hashedOnchainId, data: verifierData },
    { intentGatingService: GATING_SERVICE, payeeDetails: hashedOnchainId, data: "0x" }
  ],
  currencies: [
    [ { code: USD, minConversionRate: ethers.parseUnits("1.00", 18) } ],            // Venmo supports USD
    [ { code: USD, minConversionRate: ethers.parseUnits("1.02", 18) },               // Revolut supports USD & EUR
      { code: EUR, minConversionRate: ethers.parseUnits("1.10", 18) } ]
  ],
  delegate: ethers.ZeroAddress,
  intentGuardian: ethers.ZeroAddress,
  retainOnEmpty: true
};

// 5) Call Escrow.createDeposit
await escrow.createDeposit(params);
```

Notes
- `paymentMethods` and `currencies` must be whitelisted by the on-chain `PaymentVerifierRegistry`.
- `minConversionRate` is a 1e18‑scaled fixed-point rate (same precision used across V3).
- `payeeDetails` is a bytes32 hash (do not put raw identifiers on-chain).
- Keep each payment method’s `currencies` list reasonably small to avoid heavy gas on withdrawal path (recommended \< 50 per method).

Managing deposits
- Add funds: `escrow.addFunds(depositId, amount)`
- Toggle accepting intents: `escrow.setAcceptingIntents(depositId, true/false)`
- Add payment methods or currencies later using the provided functions; see the Protocol V3 “Smart Contracts” page for details.

Help?
- For any issues or support, reach out to [ZKP2P Team](mailto:team@zkp2p.xyz).
