---
id: offramp-integration
title: Offramp
---

# Offramp

## Getting Started

To get started integrating offramping, request an API key from the [ZKP2P team](mailto:team@zkp2p.xyz).

## Flow

1. User calls `api.zkp2p.xyz` to validate deposits details
2. Post deposit details to `api.zkp2p.xyz`
3. Approve USDC on the escrow contract
4. Call `createDeposit` on the escrow contract

## API

### Deposit data formatting

```javascript
const requestVenmo = {
    depositData: {
        "venmoUsername": "ethereum"
        "telegramUsername": "@example" // Optional
    },
    processorName: "venmo"
}

const requestCashapp = {
    depositData: {
        "cashtag": "ethereum"
        "telegramUsername": "@example" // Optional
    },
    processorName: "cashapp"
}

const requestZelle = {
    depositData: {
        "zelleEmail": "eth@ethereum.org"
        "telegramUsername": "@example" // Optional
    },
    processorName: "zelle"
}

const requestRevolut = {
    depositData: {
        "revolutUsername": "ethereum"
        "telegramUsername": "@example" // Optional
    },
    processorName: "revolut"
}
```

### Validate deposit details

Verify deposit details are formatted correctly before posting.

```typescript
interface DepositDetailsRequest {
  depositData: {
    [key: string]: string;
  };
  processorName: string;
}

interface ValidatePayeeDetailsResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

const requestVenmo = {
    depositData: {
        "venmoUsername": "ethereum"
        "telegramUsername": "@example" // Optional
    },
    processorName: "venmo"
}

const response = await fetch(`${API_URL}/v1/makers/validate`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": `${API_KEY}`
  },
  body: JSON.stringify(request),
});
```

### Post deposit details

Store raw usernames in ZKP2P. Hashed ID will be stored onchain to preserve privacy onchain.

```typescript
interface DepositDetailsRequest {
  depositData: {
    [key: string]: string;
  };
  processorName: string;
}

interface PostDepositDetailsResponse {
  success: boolean;
  message: string;
  responseObject: {
    id: number;
    processorName: string;
    depositData: {
      [key: string]: string;
    };
    hashedOnchainId: string;
    createdAt: string;
  };
  statusCode: number;
}

const request = {
    depositData: {
        "venmoUsername": "ethereum"
        "telegramUsername": "@example" // Optional
    },
    processorName: "venmo"
}

const response: PostDepositDetailsResponse = await fetch(`${API_URL}/v1/makers/create`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": `${API_KEY}`
  },
  body: JSON.stringify(request),
});
```

## Escrow Calldata

**Escrow address:** `0xCA38607D85E8F6294Dc10728669605E6664C2D70`

### Approve USDC

First, approve the escrow contract to spend your USDC.

### createDeposit

```solidity
struct Range {
    uint256 min;  // Minimum value
    uint256 max;  // Maximum value
}

struct DepositVerifierData {
    address intentGatingService; 
    string payeeDetails;         
    bytes data;                  
}

struct Currency {
    bytes32 code;                // keccak256 hash of the currency code
    uint256 conversionRate;      // Conversion rate of deposit token to fiat currency
}

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

#### Parameters:

- **`_token`**: USDC address: `0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`
- **`_amount`**: USDC amount (1e6)
- **`_intentAmountRange`**: Struct containing min and max USDC amount per order e.g. 100000 - 10000000 (0.1 USDC - 10 USDC)
- **`_verifiers`**: Just Mercado Pago: `0xf2AC5be14F32Cbe6A613CFF8931d95460D6c33A3`
- **`_verifierData`**:
  - `intentGatingService`: `0x396D31055Db28C0C6f36e8b36f18FE7227248a97`
  - `payeeDetails`: `hashedOnchainId` param returned from api.zkp2p.xyz above
  - `data`: Encode the witness address `0x0636c417755E3ae25C6c166D181c0607F4C572A3`

```javascript
const depositData = ethers.utils.defaultAbiCoder.encode(
    ['address[]'],
    [['0x0636c417755E3ae25C6c166D181c0607F4C572A3']]
);
```

- **Currency**:
  - Code: `keccak("ARS")`
  - Conversion rate: the ARSUSDC rate to set scaled by 10e18. E.g. `1245000000000000000000`

## Help?

For any issues or support, reach out to [ZKP2P Team](mailto:team@zkp2p.xyz).
