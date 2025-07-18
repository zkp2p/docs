---
id: build-new-provider
title: Build a New Provider
---

## Overview

ZKP2P is an open and permissionless protocol. We've now made it very easy for any developer around the world to get started building a new payment integration on ZKP2P. This guide explains how to create provider templates for the ZKP2P PeerAuth extension and integrate new payment platforms.

To build a new integration for your local payment platform, you will need to implement:

1. A zkTLS provider template to generate a proof of payment
2. A verifier contract in Solidity

If you have any questions please do not hesitate to contact us on [Telegram](https://t.me/zk_p2p/4710)

## Developer Quickstart

To get started building a new provider:

1. Clone the [providers repo](https://github.com/zkp2p/providers)
2. Run `yarn install` and `yarn start`. App is hosted on [http://localhost:8080](http://localhost:8080)
3. Install the [PeerAuth extension](https://chromewebstore.google.com/detail/peerauth-authenticate-and/ijpgccednehjpeclfcllnjjcmiohdjih) in your browser
4. Create a new directory and JSON file and add the necessary provider data for your integration
5. Test your integration by going to [developer.zkp2p.xyz](https://developer.zkp2p.xyz/)
6. Click on Open Settings on the page and set Base URL to `http://localhost:8080/`. Any changes to your JSON will now be reflected in the extension and developer app
7. Update `actionType` and `platform` with the right values. The path to your provider is `localhost:8080/{platform_name}/{provider_name}.json`
8. Click Authenticate to extract metadata
9. If successful, proceed to Prove a specific transaction

## 1. Build a zkTLS Provider Template

### Getting Started
1. Inspect network tab in Dev Tools after logging into your payment website. Or turn on Intercepted Requests in ZKP2P sidebar
2. Find a request that contains amount, timestamp/date, recipient ID at a minimum. Look for additional params such as status (to see if payment finalized), currency (if platform supports more than 1 currency)
3. A tip is to look for where the transactions page is. Sometimes the transactions are expandable so you can log those too
4. Based on the request, populate the template

### Configuration Structure

```json
{
  "actionType": "transfer_venmo",
  "authLink": "https://account.venmo.com/?feed=mine",
  "url": "https://account.venmo.com/api/stories?feedType=me&externalId={{SENDER_ID}}",
  "method": "GET",
  "skipRequestHeaders": [],
  "body": "",
  "metadata": {
    "platform": "venmo",
    "urlRegex": "https://account.venmo.com/api/stories\\?feedType=me&externalId=\\S+",
    "method": "GET",
    "shouldSkipCloseTab": false,
    "transactionsExtraction": {
      "transactionJsonPathListSelector": "$.stories"
    }
  },
  "paramNames": ["SENDER_ID"],
  "paramSelectors": [{
    "type": "jsonPath",
    "value": "$.stories[{{INDEX}}].title.sender.id",
    "source": "responseBody"
  }],
  "secretHeaders": ["Cookie"],
  "responseMatches": [{
    "type": "regex",
    "value": "\"amount\":\"-\\$(?<amount>[^\"]+)\""
  }],
  "responseRedactions": [{
    "jsonPath": "$.stories[{{INDEX}}].amount",
    "xPath": ""
  }],
  "mobile": {
    "actionLink": "venmo://paycharge?txn=pay&recipients={{RECEIVER_ID}}&note=cash&amount={{AMOUNT}}"
  }
}
```

### Field Descriptions

#### Basic Configuration

##### `actionType` (required)
- **Type**: `string`
- **Description**: Identifier for the action type (e.g., "transfer_venmo", "receive_payment")
- **Example**: `"transfer_venmo"`

##### `authLink` (required)
- **Type**: `string`
- **Description**: URL for user authentication/login page
- **Example**: `"https://venmo.com/login"`

##### `url` (required)
- **Type**: `string`
- **Description**: API endpoint URL for the main request
- **Example**: `"https://api.venmo.com/v1/payments"`

##### `method` (required)
- **Type**: `string`
- **Description**: HTTP method for the request
- **Values**: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`
- **Example**: `"POST"`

##### `skipRequestHeaders` (optional)
- **Type**: `string[]`
- **Description**: Headers to exclude from the notarized request
- **Example**: `["User-Agent", "Accept-Language"]`

##### `body` (optional)
- **Type**: `string`
- **Description**: Request body template (for POST/PUT requests)
- **Example**: `"{\"amount\": \"{{AMOUNT}}\", \"recipient\": \"{{RECIPIENT}}\"}"`

#### Metadata Configuration

##### `metadata` (required)
- **Type**: `object`
- **Description**: Configuration for request matching and transaction extraction

```json
"metadata": {
  "shouldReplayRequestInPage": false,
  "shouldSkipCloseTab": false,
  "platform": "venmo",
  "urlRegex": "https://api\\.venmo\\.com/v1/payments/\\d+",
  "method": "GET",
  "fallbackUrlRegex": "https://api\\.venmo\\.com/v1/transactions",
  "fallbackMethod": "GET",
  "preprocessRegex": "window\\.__data\\s*=\\s*({.*?});",
  "transactionsExtraction": {
    "transactionJsonPathListSelector": "$.data.transactions",
    "transactionRegexSelectors": {
      "paymentId": "js_transactionItem-([A-Z0-9]+)"
    },
    "transactionJsonPathSelectors": {
      "recipient": "$.target.username",
      "amount": "$.amount",
      "date": "$.created_time",
      "paymentId": "$.id",
      "currency": "$.currency"
    }
  },
  "proofMetadataSelectors": [
    {
      "type": "jsonPath",
      "value": "$.data.user.id"
    }
  ]
}
```

###### Metadata Fields

- **`shouldSkipCloseTab`** (optional): When set to `true`, prevents the extension from automatically closing the authentication tab after successful authentication
- **`shouldReplayRequestInPage`** (optional): When set to `true`, replays the request in the page context instead of making it from the extension

#### Parameter Extraction

##### `paramNames` (required)
- **Type**: `string[]`
- **Description**: Names of parameters to extract
- **Example**: `["transactionId", "amount", "recipient"]`

##### `paramSelectors` (required)
- **Type**: `ParamSelector[]`
- **Description**: Selectors for extracting parameter values

```typescript
interface ParamSelector {
  type: 'jsonPath' | 'regex';
  value: string;
  source?: 'url' | 'responseBody' | 'responseHeaders' | 'requestHeaders' | 'requestBody';
}
```

##### Parameter Source Options

The `source` field in `paramSelectors` specifies where to extract the parameter from:

- **`responseBody`** (default): Extract from the response body
- **`url`**: Extract from the request URL
- **`responseHeaders`**: Extract from response headers
- **`requestHeaders`**: Extract from request headers
- **`requestBody`**: Extract from the request body (for POST/PUT requests)

Example:
```json
{
  "paramNames": ["userId", "transactionId", "amount"],
  "paramSelectors": [
    {
      "type": "regex",
      "value": "userId=([^&]+)",
      "source": "url"
    },
    {
      "type": "jsonPath",
      "value": "$.data.transactions[{{INDEX}}].id",
      "source": "responseBody"
    },
    {
      "type": "regex",
      "value": "X-Transaction-Amount: ([0-9.]+)",
      "source": "responseHeaders"
    }
  ]
}
```

#### Security Configuration

##### `secretHeaders` (optional)
- **Type**: `string[]`
- **Description**: Headers containing sensitive data (e.g., auth tokens)
- **Example**: `["Authorization", "Cookie"]`

#### Response Verification

##### `responseMatches` (required)
- **Type**: `ResponseMatch[]`
- **Description**: Patterns to verify in the response

```json
"responseMatches": [
  {
    "type": "jsonPath",
    "value": "$.data.transactions[{{INDEX}}].id",
    "hash": false
  },
  {
    "type": "regex",
    "value": "\"status\":\\s*\"completed\"",
    "hash": true
  }
]
```

##### `responseRedactions` (optional)
- **Type**: `ResponseRedaction[]`
- **Description**: Data to redact from the response for privacy

```json
"responseRedactions": [
  {
    "jsonPath": "$.data.user.email",
    "xPath": ""
  },
  {
    "jsonPath": "$.data.ssn",
    "xPath": ""
  }
]
```

#### Mobile SDK Configuration

##### `mobile` (optional)
- **Type**: `object`
- **Description**: Special configurations for the ZKP2P mobile SDK

```json
"mobile": {
  "includeAdditionalCookieDomains": [],
  "actionLink": "venmo://paycharge?txn=pay&recipients={{RECEIVER_ID}}&note=cash&amount={{AMOUNT}}",
  "isExternalLink": true,
  "appStoreLink": "https://apps.apple.com/us/app/venmo/id351727428",
  "playStoreLink": "https://play.google.com/store/apps/details?id=com.venmo"
}
```

**Fields:**
- `includeAdditionalCookieDomains`: Array of additional cookie domains to include
- `actionLink`: Deep link URL for the mobile app with placeholders for dynamic values
- `isExternalLink`: Boolean indicating if the action link is external
- `appStoreLink`: iOS App Store URL for the app
- `playStoreLink`: Google Play Store URL for the app

### Transaction Extraction

#### Using JSONPath (for JSON responses)
```json
{
  "transactionsExtraction": {
    "transactionJsonPathListSelector": "$.data.transactions",
    "transactionJsonPathSelectors": {
      "recipient": "$.target.username",
      "amount": "$.amount",
      "date": "$.created_time",
      "paymentId": "$.id",
      "currency": "$.currency"
    }
  }
}
```

#### Using Regex (for HTML/text responses)
```json
{
  "transactionsExtraction": {
    "transactionRegexSelectors": {
      "amount": "<td class=\"amount\">\\$([\\d,\\.]+)</td>",
      "recipient": "<td class=\"recipient\">([^<]+)</td>",
      "date": "<td class=\"date\">(\\d{2}/\\d{2}/\\d{4})</td>",
      "paymentId": "data-payment-id=\"(\\d+)\""
    }
  }
}
```

### Best Practices

1. **URL Regex Patterns**
   - Escape special characters: `\\.` for dots
   - Use specific patterns to avoid false matches
   - Test regex patterns thoroughly

2. **Parameter Extraction**
   - Use JSONPath for structured JSON data
   - Use regex for HTML, text responses, or complex patterns
   - Always specify capture groups `()` for regex extraction
   - Specify `source` when extracting from non-default locations

3. **Security**
   - List all sensitive headers in `secretHeaders`
   - Use `responseRedactions` to remove PII
   - Never expose authentication tokens in `responseMatches`

4. **Error Handling**
   - Provide fallback URLs when primary endpoints might fail
   - Use preprocessing regex for embedded JSON data
   - Test extraction selectors with various response formats

5. **Performance**
   - Minimize the number of `responseMatches` for faster verification
   - Use specific JSONPath expressions instead of wildcards
   - Consider response size when designing redactions

### Common Issues

- **Authenticate does not open desired auth link**: Check the Base URL you have set in the extension. Ensure you are running the server which is hosted in port 8080
- **Authenticated into your payment platform but not redirected back to developer.zkp2p.xyz**: There is an issue with the urlRegex for metadata extraction. Double check your regex is correct
- **Metadata returned to app, but Prove fails**: There is an issue with the response redactions or headers for the server call. Check your response redactions parameters and server headers
- **Parameters not extracted correctly**: Check the `source` field in your `paramSelectors`. By default, parameters are extracted from responseBody

## 2. Create a Verifier Contract

The verifier contract extracts and validates the payment proof data. Every verifier must implement the `IPaymentVerifier` interface and extend appropriate base contracts for common functionality.

### IPaymentVerifier Interface

All payment verifiers must implement this interface:

```solidity
interface IPaymentVerifier {
    struct VerifyPaymentData {
        bytes paymentProof;         // Payment proof from zkTLS
        address depositToken;       // Token locked in escrow
        uint256 intentAmount;       // Amount of tokens the payer wants
        uint256 intentTimestamp;    // When the intent was created
        string payeeDetails;        // Payee ID (raw or hashed)
        bytes32 fiatCurrency;       // Fiat currency code (e.g., "USD")
        uint256 conversionRate;     // Token to fiat conversion rate
        bytes data;                 // Additional verification data
    }

    function verifyPayment(
        VerifyPaymentData calldata _verifyPaymentData
    ) external returns(bool success, bytes32 intentHash);
}
```

### Extending BasePaymentVerifier

Most verifiers should extend `BasePaymentVerifier` which provides:

#### Core Functionality
- **Access Control**: Only the escrow contract can call `verifyPayment`
- **Currency Management**: Add/remove supported fiat currencies
- **Nullifier Protection**: Prevents double-spending of payment proofs
- **Timestamp Buffer**: Handles L2 timestamp variations

#### Key Methods to Use

```solidity
// In your constructor
constructor(address _escrow, address _nullifierRegistry) {
    escrow = _escrow;
    nullifierRegistry = INullifierRegistry(_nullifierRegistry);
    _addCurrency("USD"); // Add supported currencies
}

// In your verifyPayment implementation
function verifyPayment(VerifyPaymentData calldata data) 
    external 
    onlyEscrow 
    returns(bool, bytes32) 
{
    // 1. Decode and verify the proof
    // 2. Extract payment details
    // 3. Validate payment meets requirements
    // 4. Add nullifier to prevent reuse
    _validateAndAddNullifier(nullifier);
    // 5. Return success and intent hash
}
```

### Implementation Guide

#### Step 1: Set Up Your Contract

```solidity
pragma solidity ^0.8.0;

import "./interfaces/IPaymentVerifier.sol";
import "./BasePaymentVerifier.sol";

contract YourPlatformVerifier is BasePaymentVerifier {
    constructor(
        address _escrow,
        address _nullifierRegistry
    ) BasePaymentVerifier(_escrow, _nullifierRegistry) {
        // Add supported currencies
        _addCurrency("USD");
        _addCurrency("EUR");
    }
}
```

#### Step 2: Implement Proof Verification

For Reclaim-based proofs (most common):

```solidity
function verifyPayment(VerifyPaymentData calldata data) 
    external 
    onlyEscrow 
    returns(bool success, bytes32 intentHash) 
{
    // Decode the proof
    ReclaimProof memory proof = abi.decode(data.paymentProof, (ReclaimProof));
    
    // Extract witness addresses from additional data
    address[] memory witnesses = abi.decode(data.data, (address[]));
    
    // Verify witness signatures
    bool isValidProof = verifyReclaimProof(proof, witnesses);
    require(isValidProof, "Invalid proof");
    
    // Extract and validate payment details
    PaymentDetails memory details = extractPaymentDetails(proof.claimInfo.context);
    
    // Validate payment meets requirements
    validatePaymentDetails(details, data);
    
    // Add nullifier
    bytes32 nullifier = keccak256(proof.identifier);
    _validateAndAddNullifier(nullifier);
    
    // Calculate and return intent hash
    intentHash = calculateIntentHash(data, details);
    
    return (true, intentHash);
}
```

#### Step 3: Extract Payment Details

```solidity
struct PaymentDetails {
    uint256 amount;
    string recipientId;
    string paymentId;
    uint256 timestamp;
    string status;
}

function extractPaymentDetails(string memory context) 
    internal 
    pure 
    returns (PaymentDetails memory) 
{
    // Use your provider template's extraction logic
    // This matches the paramSelectors from your JSON template
    
    // Example for JSON extraction
    uint256 amount = extractAmount(context);
    string memory recipientId = extractRecipientId(context);
    // ... extract other fields
    
    return PaymentDetails({
        amount: amount,
        recipientId: recipientId,
        paymentId: paymentId,
        timestamp: timestamp,
        status: status
    });
}
```

#### Step 4: Validate Payment Requirements

```solidity
function validatePaymentDetails(
    PaymentDetails memory details,
    VerifyPaymentData calldata data
) internal view {
    // 1. Validate amount
    uint256 expectedAmount = (data.intentAmount * data.conversionRate) / PRECISE_UNIT;
    require(details.amount >= expectedAmount, "Insufficient payment amount");
    
    // 2. Validate recipient
    bool isValidRecipient = validateRecipient(details.recipientId, data.payeeDetails);
    require(isValidRecipient, "Invalid recipient");
    
    // 3. Validate timestamp (with buffer for L2s)
    require(
        details.timestamp >= data.intentTimestamp - timestampBuffer,
        "Payment too old"
    );
    
    // 4. Validate currency
    require(isCurrency[data.fiatCurrency], "Unsupported currency");
    
    // 5. Validate payment status (if applicable)
    require(
        keccak256(bytes(details.status)) == keccak256(bytes("COMPLETE")),
        "Payment not complete"
    );
}
```

### Example Implementations

1. **[VenmoReclaimVerifier](https://github.com/zkp2p/zkp2p-v2-contracts/blob/main/contracts/verifiers/VenmoReclaimVerifier.sol)**
   - USD only
   - Extracts: amount, date, paymentId, recipientId
   - Validates payment completeness

2. **[CashappReclaimVerifier](https://github.com/zkp2p/zkp2p-v2-contracts/blob/main/contracts/verifiers/CashappReclaimVerifier.sol)**
   - Multi-currency support
   - Status validation ("COMPLETE")
   - Different amount scaling (cents vs dollars)

3. **[ZelleBaseVerifier](https://github.com/zkp2p/zkp2p-v2-contracts/blob/main/contracts/verifiers/ZelleBaseVerifier.sol)**
   - Router pattern for multiple sub-verifiers
   - Delegates to specific implementations based on payment method

Get started in the [ZKP2P V2 contracts](https://github.com/zkp2p/zkp2p-v2-contracts) repo. Look at the example verifiers for detailed implementation patterns.

## Contributing

We want to make this the largest open source repository of provider templates for global payment platforms. Please open a PR in the [providers repository](https://github.com/zkp2p/providers) when you have created and tested your template!