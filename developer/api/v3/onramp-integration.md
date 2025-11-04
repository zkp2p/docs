---
title: Onramp (V3)
slug: /developer/api/v3/onramp
---

# Onramp

:::info
This page contains documentation and APIs for a headless integration with the ZKP2P protocol. For a faster redirect flow integration, see [Redirect Integration](../../integrate-zkp2p/integrate-redirect-onramp.md).
:::

## Getting Started

To get started integrating onramping, request an API key from the [ZKP2P team](mailto:team@zkp2p.xyz).

If you are looking to interact only with the PeerAuth Extension to generate zkTLS proofs and not with the ZKP2P smart contract protocol, skip to the [section below](onramp-integration.md#extension-api). Additionally, we do have a React SDK for interacting with PeerAuth maintained by our commmunity: [React PeerAuth SDK](https://www.npmjs.com/package/@vitals/extension-react)

## Flow

1. Fetch quote from `/quote/exact-fiat` or `/quote/exact-token` (supports optional filters; see below)
2. Get signed intent from `/v2/verify/intent` (expanded request schema)
3. Signal intent on-chain (V3: `Orchestrator.signalIntent`; V2: `Escrow.signalIntent`)
4. User makes the off‑chain payment to the recipient (payee) identifier
5. Authenticate with the PeerAuth extension
6. Generate a provider proof
7. Get an attestation from the Attestation Service and call on-chain fulfill

## API

### Quote for exact fiat amount

```javascript
const request = {
  paymentPlatforms: ["venmo", "cashapp"],
  fiatCurrency: "USD",
  user: "0xUserAddress",
  recipient: "0xRecipientAddress",
  destinationChainId: 8453,
  destinationToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
  exactFiatAmount: "100000000", // 100 USD (6 decimals)
  referrer: "YourApp", // Optional
  useMultihop: false,   // Optional
  escrowAddresses: ["0xEscrowV2"], // Optional: restrict to these escrows
  minDepositSuccessRateBps: 0       // Optional: filter deposits by success rate (0–10000)
};

// Optional: return top N quotes in a single request
const response = await fetch('https://api.zkp2p.xyz/v1/quote/exact-fiat?quotesToReturn=3', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
});
```

Response:
```javascript
{
  message: "string",
  success: true,
  responseObject: {
    fiat: {
      currencyCode: "USD",
      currencyName: "United States Dollar",
      currencySymbol: "$",
      countryCode: "us"
    },
    token: {
      token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
      name: "USD Coin",
      symbol: "USDC",
      chainId: 8453
    },
    quotes: [{
      fiatAmount: "100000000",
      fiatAmountFormatted: "$100.00",
      tokenAmount: "98000000",
      tokenAmountFormatted: "98.00",
      paymentMethod: "venmo",
      payeeAddress: "0xSellerAddress", // seller's on-chain address
      conversionRate: "1020000000000000000",
      depositSuccessRateBps: 9900,
      depositIntentStats: {
        totalIntents: 123,
        signaledIntents: 120,
        fulfilledIntents: 118,
        prunedIntents: 2
      },
      intent: {
        depositId: 123,
        processorName: "venmo",
        amount: "98000000",
        toAddress: "0xRecipientAddress",
        payeeDetails: "0xHashedPayeeDetails",
        fiatCurrencyCode: "0xc4ae21aa...",
        chainId: "8453",
        escrowAddress: "0xEscrowV2"
      }
    }],
    fees: {
      zkp2pFee: "2000000", // 2 USDC
      zkp2pFeeFormatted: "2.00",
      swapFee: "0",
      swapFeeFormatted: "0.00"
    }
  },
  statusCode: 200
}
```

### Quote for exact token amount

```javascript
const request = {
  paymentPlatforms: ["venmo"],
  fiatCurrency: "USD",
  user: "0xUserAddress",
  recipient: "0xRecipientAddress",
  destinationChainId: 8453,
  destinationToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  exactTokenAmount: "100000000",
  escrowAddresses: ["0xEscrowV2"],        // Optional
  minDepositSuccessRateBps: 9500            // Optional
};

const response = await fetch('https://api.zkp2p.xyz/v1/quote/exact-token?quotesToReturn=2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
});
```

### Verify intent (V3)

```javascript
const selectedQuote = quoteResponse.responseObject.quotes[0];
const intent = selectedQuote.intent;

// Hash the payment method string to bytes32
import { utils as ethersUtils } from 'ethers';
const paymentMethodHash = ethersUtils.keccak256(ethersUtils.toUtf8Bytes(selectedQuote.paymentMethod));

const request = {
  processorName: intent.processorName,
  depositId: String(intent.depositId),
  amount: intent.amount,
  toAddress: intent.toAddress,
  payeeDetails: intent.payeeDetails,
  paymentMethod: paymentMethodHash,          // bytes32
  fiatCurrency: intent.fiatCurrencyCode,     // bytes32
  conversionRate: selectedQuote.conversionRate,
  chainId: intent.chainId,
  orchestratorAddress: "0xOrchestrator",     // see deployments for your chain
  escrowAddress: intent.escrowAddress
};

const response = await fetch('https://api.zkp2p.xyz/v2/verify/intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  },
  body: JSON.stringify(request)
});
```

Response:
```javascript
{
  success: true,
  message: "Intent verified",
  responseObject: {
    signedIntent: "0x...",
    intentData: {
      orchestratorAddress: "0xOrchestrator",
      escrowAddress: "0xEscrowV2",
      depositId: "123",
      amount: "98000000",
      recipientAddress: "0xRecipientAddress",
      paymentMethod: "0x...",            // bytes32
      fiatCurrency: "0x...",             // bytes32
      conversionRate: "1000000000000000000",
      signatureExpiration: "1700000005000",
      chainId: "8453",
      gatingServiceSignature: "0x..."
    },
    depositData: { /* optional provider metadata */ }
  },
  statusCode: 200
}
```

## On-chain Calls

For V3, interact with the Orchestrator contract.

### Orchestrator.signalIntent
```solidity
function signalIntent(IOrchestrator.SignalIntentParams calldata params) external;
```
Use fields from `intentData` returned by the gating API (`/v2/verify/intent`).

### Orchestrator.fulfillIntent
```solidity
function fulfillIntent(IOrchestrator.FulfillIntentParams calldata params) external;
```
`params.paymentProof` is the ABI-encoded `PaymentAttestation` from the Attestation Service. See Protocol V3 → Attestation Service for a full example.

### Deployments

See the Protocol docs for contract addresses on your target network (Escrow, Orchestrator, UnifiedPaymentVerifier, AttestationVerifier).

### Supported Currencies

Currency codes are hashed using keccak256 for use in smart contracts:

```javascript
const ethers = require('ethers');

function hashCurrency(currencyCode) {
  const bytes = ethers.utils.toUtf8Bytes(currencyCode);
  return ethers.utils.keccak256(bytes);
}
```

We support the following currencies:

| Currency | Code | Keccak256 Hash | Supported By |
|----------|------|----------------|--------------|
| US Dollar | `USD` | `hashCurrency("USD")` | Venmo, CashApp, Zelle, Revolut, Wise |
| Euro | `EUR` | `hashCurrency("EUR")` | Revolut, Wise |
| British Pound | `GBP` | `hashCurrency("GBP")` | Revolut, Wise |
| Canadian Dollar | `CAD` | `hashCurrency("CAD")` | Revolut, Wise |
| Australian Dollar | `AUD` | `hashCurrency("AUD")` | Revolut, Wise |
| Singapore Dollar | `SGD` | `hashCurrency("SGD")` | Revolut, Wise |
| Hong Kong Dollar | `HKD` | `hashCurrency("HKD")` | Revolut, Wise |
| Japanese Yen | `JPY` | `hashCurrency("JPY")` | Wise |
| Chinese Yuan | `CNY` | `hashCurrency("CNY")` | Wise |
| Mexican Peso | `MXN` | `hashCurrency("MXN")` | Revolut, Wise |
| Argentine Peso | `ARS` | `hashCurrency("ARS")` | MercadoPago |
| Swiss Franc | `CHF` | `hashCurrency("CHF")` | Revolut, Wise |
| New Zealand Dollar | `NZD` | `hashCurrency("NZD")` | Revolut, Wise |
| Thai Baht | `THB` | `hashCurrency("THB")` | Revolut, Wise |
| Polish Zloty | `PLN` | `hashCurrency("PLN")` | Revolut, Wise |
| South African Rand | `ZAR` | `hashCurrency("ZAR")` | Revolut, Wise |
| Malaysian Ringgit | `MYR` | `hashCurrency("MYR")` | Wise |
| Indonesian Rupiah | `IDR` | `hashCurrency("IDR")` | Wise |
| Turkish Lira | `TRY` | `hashCurrency("TRY")` | Revolut, Wise |
| Vietnamese Dong | `VND` | `hashCurrency("VND")` | Wise |
| Israeli Shekel | `ILS` | `hashCurrency("ILS")` | Wise |
| Saudi Riyal | `SAR` | `hashCurrency("SAR")` | Revolut |
| UAE Dirham | `AED` | `hashCurrency("AED")` | Revolut, Wise |
| Kenyan Shilling | `KES` | `hashCurrency("KES")` | Wise |
| Ugandan Shilling | `UGX` | `hashCurrency("UGX")` | Wise |

## Extension API

The PeerAuth extension provides a global `window.zktls` API for interacting with the extension from web pages. This API is used to authenticate payments after the user has made a payment to the recipient ID.

### API Availability

The API is automatically injected into all web pages where the extension has permissions. To check if the API is available:

```jsx
if (typeof window.zktls !== 'undefined') {
  // API is available
}

// Or wait for the initialization event
window.addEventListener('zktls#initialized', () => {
  console.log('window.zktls is ready');
});
```

### TypeScript Types

If you're using TypeScript, here are the type definitions for the window.zktls API:

```typescript
interface IProofResponse {
  proofId: string;
  platform: string;
}

interface IRequestHistoryItem {
  notaryRequest: any;
}

interface IProofParams {
  intentHash: string;
  originalIndex: number;
  platform: string;
  proofIndex?: number;
}

interface INewTabParams {
  actionType: string;
  platform: string;
  // Optional engine override from the client
  proofEngine?: 'legacy' | 'reclaim';
}

interface IMetadataMessage {
  requestId: string;
  metadata: any[];
  platform: string;
  expiresAt: number;
}

interface IZkTls {
  // Connection methods
  requestConnection(): Promise<boolean>;
  checkConnectionStatus(): Promise<'connected' | 'disconnected' | 'pending'>;
  
  // Extension info methods
  getVersion(): Promise<string>;
  
  // Proof methods
  generateProof(params: IProofParams): Promise<IProofResponse>;
  fetchProofById(proofId: string): Promise<{ notaryRequest: IRequestHistoryItem }>;
  fetchProofs(): Promise<{ notaryRequests: IRequestHistoryItem[] }>;
  
  // UI methods
  openSidebar(route: string): void;
  authenticate(params: INewTabParams): void;
  
  // Event listeners
  onMetadataMessage(callback: (data: IMetadataMessage) => void): () => void;
  
  // Logger
  logger: {
    enabled: boolean;
    enable(): void;
    disable(): void;
    debug(message: string, data?: any): void;
    error(message: string, error?: any): void;
  };
}

declare global {
  interface Window {
    zktls: IZkTls;
  }
}
```

### Debugging

#### Enable/Disable Logging

```javascript
// Enable logging
window.zktls.logger.enable()

// Disable logging  
window.zktls.logger.disable()

// Log additional debug messages you specify (only shown when logging is enabled)
window.zktls.logger.debug('Processing payment', { amount: 100 })

// Log additional errors (only shown when logging is enabled)
window.zktls.logger.error('Failed to generate proof', error)
```

The logger provides two levels of logging:
- `debug`: For general debugging information
- `error`: For error messages and exceptions

All log messages are prefixed with `[zktls:debug]` or `[zktls:error]` for easy filtering.

### Event Listeners

#### onMetadataMessage(callback)

Subscribe to metadata messages from the extension. These messages are received after authenticating with a payment platform and contain platform-specific session information.

```jsx
// First, authenticate with a platform
window.zktls.authenticate({
  actionType: 'transfer_venmo',
  platform: 'venmo'
});

// Subscribe to receive metadata after authentication
const unsubscribe = window.zktls.onMetadataMessage((data) => {
  console.log('Received platform metadata:', {
    requestId: data.requestId,
    platform: data.platform,
    metadata: data.metadata,
    expiresAt: data.expiresAt
  });
  
  // Store or use the metadata for subsequent proof generation
  // The metadata expires at the given timestamp
});

// Later, unsubscribe when done
unsubscribe();
```

**Metadata Message Structure:**
- `requestId`: The ID of the authentication request
- `platform`: The payment platform that was authenticated (e.g., 'venmo', 'cashapp')
- `metadata`: Array of platform-specific metadata objects needed for proof generation
- `expiresAt`: Unix timestamp when the authentication session expires

### Connection Management

#### requestConnection()

Request permission to connect to the extension. This is required before using most other API methods (except for auto-approved domains).

```jsx
const isConnected = await window.zktls.requestConnection();
if (isConnected) {
  console.log('Connected to PeerAuth extension');
}
```

#### checkConnectionStatus()

Check the current connection status.

```jsx
const status = await window.zktls.checkConnectionStatus();
// Returns: 'connected' | 'disconnected' | 'pending'
```

### Extension Information

#### getVersion()

Get the current extension version.

```jsx
const version = await window.zktls.getVersion();
console.log(`PeerAuth version: ${version}`);
```

### Proof Generation and Management

#### authenticate(params)

Authenticate into a provider by opening a new tab with specific parameters. After successful authentication, metadata will be sent via the `onMetadataMessage` listener.

```jsx
// Set up metadata listener before authenticating
const unsubscribe = window.zktls.onMetadataMessage((data) => {
  if (data.platform === 'venmo') {
    console.log('Venmo authentication successful');
    // Use the metadata for proof generation
  }
});

// Trigger authentication
window.zktls.authenticate({
  actionType: 'transfer_venmo',
  platform: 'venmo'
});
```

##### Available Providers

| Platform | Action Type | Description |
|----------|------------|-------------|
| `venmo` | `transfer_venmo` | Venmo transfers |
| `revolut` | `transfer_revolut` | Revolut transfers |
| `cashapp` | `transfer_cashapp` | Cash App transfers |
| `wise` | `transfer_wise` | Wise transfers |
| `paypal` | `transfer_paypal` | PayPal transfers |
| `chase` | `transfer_zelle` | Chase Zelle transfers |
| `bankofamerica` | `transfer_zelle` | Bank of America Zelle transfers |
| `citi` | `transfer_zelle` | Citi Zelle transfers |
| `royalbankcanada` | `transfer_interac` | Royal Bank of Canada Interac transfers |
| `mercadopago` | `transfer_mercado_pago` | Mercado Pago transfers |
| `idfc` | `transfer_idfc` | IDFC transfers |

#### generateProof(params)

Generate a new proof.

```jsx
const proof = await window.zktls.generateProof({
  intentHash: '1234...', // NOTE: Intent hash is the decimal value of the hex intent hash
  originalIndex: 0,
  platform: 'venmo'
});

console.log('Proof ID:', proof.proofId);
console.log('Platform:', proof.platform);
```

#### fetchProofById(proofId)

Fetch a specific proof by its ID.

```jsx
const proofData = await window.zktls.fetchProofById('proof-id-123');
console.log('Notary Request:', proofData.notaryRequest);
```

#### fetchProofs()

Fetch all proofs.

```jsx
const allProofs = await window.zktls.fetchProofs();
console.log('All notary requests:', allProofs.notaryRequests);
```

#### openSidebar(route)

Open the extension sidebar with a specific route.

```jsx
window.zktls.openSidebar('/settings');
```

### Auto-Approved Domains

The following domains are automatically approved and don't require calling `requestConnection()`:

- zkp2p.xyz
- www.zkp2p.xyz
- developer.zkp2p.xyz
- http://localhost:3000

### Error Handling

All async methods can throw errors. Common errors include:

- Timeout errors (default 30 seconds)
- User rejection of connection request
- Invalid parameters
- Extension not responding

Always wrap API calls in try-catch blocks for proper error handling.

### Example Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>window.zktls Example Usage</title>
</head>
<body>
  <h1>window.zktls API Example</h1>
  
  <script>
    // Check if extension is installed
    if (typeof window.zktls === 'undefined') {
      console.error('PeerAuth extension not installed');
    } else {
      // Wait for API to be ready (optional)
      window.addEventListener('zktls#initialized', async () => {
        console.log('window.zktls is ready!');
        
        try {
          // Request connection to extension
          const isConnected = await window.zktls.requestConnection();
          if (!isConnected) {
            console.log('User denied connection');
            return;
          }
          
          // Get extension version
          const version = await window.zktls.getVersion();
          console.log(`Connected to PeerAuth v${version}`);
          
          // Authenticate into a provider opening a new tab with specific parameters.
          window.zktls.authenticate({
            actionType: 'transfer_venmo',
            platform: 'venmo'
          });
          
          // After authentication, you'll receive metadata via onMetadataMessage
          const unsubscribe = window.zktls.onMetadataMessage((data) => {
            console.log('Received platform metadata:', data);
            // Store platform-specific metadata for use in proof generation
          });
          
          // Clean up listener when done
          unsubscribe();

          // Generate a proof (after authentication is complete)
          const proof = await window.zktls.generateProof({
            intentHash: '1234...', // NOTE: Intent hash is the decimal value of the hex intent hash
            originalIndex: 0, // This is selected by user from looking at the metadata list
            platform: 'venmo'
          });
          console.log('Proof generated:', proof.proofId);
          
          // Fetch proof details
          const proofDetails = await window.zktls.fetchProofById(proof.proofId);
          console.log('Proof details:', proofDetails);
          
        } catch (error) {
          console.error('Error:', error);
        }
      });
    }
  </script>
</body>
</html>
```

Once `fetchProofById` returns a `proof` with `status` of `"success"`, the proof is valid and can be used to call `fulfillIntent` on the Orchestrator. See [On-chain Calls](#on-chain-calls) for details.

## Help?

For any issues or support, reach out to [ZKP2P Team](mailto:team@zkp2p.xyz).
