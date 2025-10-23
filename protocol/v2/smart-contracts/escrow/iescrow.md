---
id: v2-iescrow
title: IEscrow
---

The IEscrow interface defines the data structures and function signatures used by the Escrow contract. It helps external contracts and interfaces interact with the escrow in a standardized manner.

``` 
interface IEscrow {
    
    /* ============ Structs ============ */

    struct Range {
        uint256 min;  // Minimum value
        uint256 max;  // Maximum value
    }

    struct Deposit {
        address depositor;                          
        IERC20 token;                               
        uint256 amount;                             
        Range intentAmountRange;                    
        bool acceptingIntents;                      
        uint256 remainingDeposits;                  
        uint256 outstandingIntentAmount;            
        bytes32[] intentHashes;                     
    }

    struct Currency {
        bytes32 code;                // keccak256 hash of the currency code
        uint256 conversionRate;      // Conversion rate of deposit token to fiat currency
    }

    struct DepositVerifierData {
        address intentGatingService; // Optional gating service for verifying off-chain eligibility
        string payeeDetails;         // Payee details (hash or raw) that the verifier can parse
        bytes data;                  // Additional data needed for payment verification
    }

    struct Intent {
        address owner;               
        address to;                  
        uint256 depositId;           
        uint256 amount;             
        uint256 timestamp;           
        address paymentVerifier;     
        bytes32 fiatCurrency;        
        uint256 conversionRate;      
    }

    struct VerifierDataView {
        address verifier;
        DepositVerifierData verificationData;
        Currency[] currencies;
    }

    struct DepositView {
        uint256 depositId;
        Deposit deposit;
        uint256 availableLiquidity;  
        VerifierDataView[] verifiers;
    }

    struct IntentView {
        bytes32 intentHash;
        Intent intent;
        DepositView deposit;
    }

    function getDepositFromIds(uint256[] memory _depositIds) external view returns (DepositView[] memory depositArray);
} 
```

### Structs

-   Range Defines a minimum and maximum value. Used for `intentAmountRange`.

-   Deposit Describes all state and configuration data for a given deposit:

    -   `address depositor` -- Who created the deposit.

    -   `IERC20 token` -- Which token (ERC-20) is deposited.

    -   `uint256 amount` -- How many tokens are locked in escrow.

    -   `Range intentAmountRange` -- The minimum and maximum each intent can claim.

    -   `bool acceptingIntents` -- Whether new intents can be created for this deposit.

    -   `uint256 remainingDeposits` -- The current unclaimed amount.

    -   `uint256 outstandingIntentAmount` -- Total amount locked by open/active intents.

    -   `bytes32[] intentHashes` -- An array of active intent identifiers.

-   Currency

    -   `bytes32 code` -- The currency code hashed via keccak256 (e.g. `"USD" -> keccak256("USD")`).

    -   `uint256 conversionRate` -- Conversion between deposit token and this currency.

-   DepositVerifierData

    -   `address intentGatingService` -- Optional gating service that signs off on user eligibility for an intent.

    -   `string payeeDetails` -- The string that identifies the payee or payee details.

    -   `bytes data` -- Additional proof or attestation data required for the payment verifier.

-   Intent

    -   `address owner` -- The address that initiated the intent (the potential off-chain payer).

    -   `address to` -- Address that will receive on-chain funds if the intent is fulfilled.

    -   `uint256 depositId` -- Reference to which deposit this intent targets.

    -   `uint256 amount` -- Amount of the deposit's token to be claimed.

    -   `uint256 timestamp` -- Block timestamp when the intent was created.

    -   `address paymentVerifier` -- Which verifier is used to check off-chain payment.

    -   `bytes32 fiatCurrency` -- The keccak256 hash of the off-chain currency code (e.g., `USD`).

    -   `uint256 conversionRate` -- The rate used for off-chain-to-on-chain value conversion.

-   VerifierDataView

    -   Binds a verifier address to its DepositVerifierData and an array of Currency structures.

-   DepositView

    -   `uint256 depositId`

    -   `Deposit deposit` -- The core deposit data.

    -   `uint256 availableLiquidity` -- The effective unclaimed deposit (accounting for prunable/expired intents).

    -   `VerifierDataView[] verifiers` -- An array of verifiers and their supported currencies.

-   IntentView

    -   `bytes32 intentHash` -- Unique identifier for the intent.

    -   `Intent intent` -- The Intent struct.

    -   `DepositView deposit` -- Information about the deposit that the intent is targeting.
