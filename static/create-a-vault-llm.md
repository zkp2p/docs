# Build a Vault on Peer

You are helping someone create and run a vault on Peer (peer.xyz), a permissionless fiat-to-crypto bulletin board on Base. A vault is a rate management layer: depositors delegate USDC to you, you set conversion rates across currencies and payment methods, and you earn a fee on every fill.

Funds are non-custodial. Depositor USDC stays in the ZKP2P escrow contract at all times. You can only set rates. You cannot move, withdraw, or access depositor funds.

## How a vault works

1. You call `createRateManager()` on the RateManagerV1 contract with your config
2. You set rates for currency/payment method pairs using `setRate()` or `setRateBatch()`
3. Depositors delegate their USDC deposits to your vault
4. When a buyer fills an order, you earn your fee
5. Your rate engine runs continuously, adjusting rates based on market data

### Rate resolution

The protocol enforces depositor protection with two nested maximums:

```
escrowFloor   = max(fixedFloor, oracleSpreadRate)
effectiveRate = max(managerRate, escrowFloor)
```

If your rate is higher than the depositor's floor, yours applies. If yours is lower, the floor kicks in. If your contract reverts or goes offline, the escrow defaults to the depositor's floor. Depositors are always protected.

### Fee structure

- Fee is deducted from USDC released to the buyer on each fill
- Most vaults charge 0.10%
- `maxFee` is set at vault creation and is **permanent** (can never be increased)
- You can lower your fee anytime but never exceed your maxFee
- Global protocol cap: 5%

## Contract reference

**Chain:** Base (8453)
**RateManagerV1:** `0xeEd7Db23e724aC4590D6dB6F78fDa6DB203535F3`
**Escrow (EscrowV3):** `0x777777779d229cdF3110e9de47943791c26300Ef`
**USDC (Base):** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### createRateManager(config)

```typescript
interface RateManagerConfig {
  manager: Address;       // Controls rate setting and fee changes
  feeRecipient: Address;  // Where fees go
  maxFee: bigint;         // Hard cap, IMMUTABLE after creation
  fee: bigint;            // Fee per fill (1e18 precision; 1e16 = 1%, 1e15 = 0.1%)
  minLiquidity: bigint;   // Minimum deposit size (0 = no minimum)
  name: string;           // Display name
  uri: string;            // Metadata URI
}
```

### setRate / setRateBatch

```typescript
// Single pair (contract method)
setRate(rateManagerId, paymentMethodHash, currencyCodeHash, rate)

// Bulk (contract method): nested arrays. Each payment method maps to its own currency/rate arrays
setRateBatch(rateManagerId, paymentMethodHashes[], currencyCodeHashes[][], rates[][])

// SDK equivalent (recommended):
await client.setVaultMinRatesBatch({ rateManagerId, paymentMethods, currencyCodes, rates })
```

Rates are denominated as **fiat per USDC**. A GBP rate of `0.7505` means a buyer pays £0.7505 per USDC. Rates use 18-decimal precision onchain (0.7505 = `750500000000000000`).

Setting a rate to 0 deactivates the pair (unless a depositor floor exists, in which case the floor applies).

### Delegation (depositor side)

```typescript
// Depositor delegates to your vault
setRateManager(depositId, rateManagerAddress, rateManagerId)

// Example: delegate to the Delegate by USDCtoFiat vault
setRateManager(
  depositId,
  '0xeEd7Db23e724aC4590D6dB6F78fDa6DB203535F3',  // RateManagerV1 registry
  '0x8666d6fb0f6797c56e95339fd7ca82fdd348b9db200e10a4c4aa0a0b879fc41c'  // Delegate vault ID
)

// Depositor exits
clearRateManager(depositId)

// Depositor sets floor rate
setCurrencyMinRate(depositId, paymentMethodHash, currencyCodeHash, rate)
```

## SDK: @zkp2p/sdk

```bash
npm install @zkp2p/sdk
```

```typescript
import { Zkp2pClient } from '@zkp2p/sdk';
import { createWalletClient, http } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const client = new Zkp2pClient({
  walletClient: createWalletClient({
    account: privateKeyToAccount(PRIVATE_KEY),
    chain: base,
    transport: http(RPC_URL),
  }),
  chainId: 8453,
  runtimeEnv: 'production',
});
```

### Key SDK methods

```typescript
// Query deposits
const deposits = await client.getDeposits();
const deposit = await client.getDeposit(depositId);

// Manage deposits
await client.createDeposit(params);
await client.addFunds({ depositId, amount });
await client.setCurrencyMinRate({ depositId, paymentMethod, fiatCurrency, minConversionRate });

// Delegation (depositor delegates to your vault)
await client.setRateManager({ depositId, rateManagerAddress, rateManagerId });
await client.clearRateManager({ depositId });
```

### Currency and payment method resolution

```typescript
import {
  currencyInfo,
  getPaymentMethodsCatalog,
} from '@zkp2p/sdk';

// Get currency code hashes from the currencyInfo map
const eurHash = (currencyInfo as Record<string, { currencyCodeHash: string }>)['EUR'].currencyCodeHash;
const usdHash = (currencyInfo as Record<string, { currencyCodeHash: string }>)['USD'].currencyCodeHash;

// Get payment method hashes from the catalog
const catalog = getPaymentMethodsCatalog(8453, 'production');
const revolutHash = catalog.revolut.paymentMethodHash;
const wiseHash = catalog.wise.paymentMethodHash;
```

### Conversion rate format

Rates use 18-decimal precision:

```typescript
// 1.02 USD per USDC
const rate = BigInt('1020000000000000000'); // 1.02 * 1e18

// 0.85 EUR per USDC
const rate = BigInt('850000000000000000');  // 0.85 * 1e18

// 0.76 GBP per USDC
const rate = BigInt('760000000000000000');  // 0.76 * 1e18
```

## Market data: Peerlytics API

```bash
npm install @peerlytics/sdk
```

```typescript
import { Peerlytics } from '@peerlytics/sdk';

const peerlytics = new Peerlytics(); // defaults to https://peerlytics.xyz
```

### Endpoints you need for a vault

```typescript
// What rates are clearing right now
const orderbook = await peerlytics.getOrderbook();

// Volume, liquidity, spreads by currency
const summary = await peerlytics.getSummary();

// What the competition looks like
const leaderboard = await peerlytics.getLeaderboard();

// Vault performance data
const vaults = await peerlytics.getVaultsOverview();
const vault = await peerlytics.getVault(rateManagerId);

// Live fill feed
const activity = await peerlytics.getActivity({ type: 'fulfill' });

// Detailed analytics by time period
const period = await peerlytics.getPeriod('mtd'); // 'mtd', '3mtd', 'ytd', 'all'

// Specific deposit or intent data
const deposits = await peerlytics.getDeposits({ platform: ['revolut'], currency: ['EUR'] });
const intents = await peerlytics.getIntents({ status: 'FULFILLED' });
```

API docs: https://peerlytics.xyz/developers
Full LLM reference: https://peerlytics.xyz/llms-full.txt

## Supported payment methods and currencies

**Payment methods (14):**
Revolut, Wise, PayPal, Venmo, Cash App, Zelle (Chase, BofA, Citi), Mercado Pago, Monzo, N26, Chime, Luxon, Alipay

**Currencies (34):**
AED, ARS, AUD, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HKD, HUF, IDR, ILS, INR, JPY, KES, MXN, MYR, NOK, NZD, PHP, PLN, RON, SAR, SEK, SGD, THB, TRY, UGX, USD, VND, ZAR

**Volume distribution (from 25,119 orders):**
- By currency: USD 66%, EUR 13%, GBP 5%, then AUD, ARS, CAD, CHF and long tail
- By payment method: Revolut 42%, Venmo 20%, Wise 15%, CashApp 12%, PayPal 5%, Zelle 3%

## Strategies

Use Peerlytics data to pick a strategy that fits your risk profile and capital.

### Strategy 1: The Speedrunner
Tight spreads (0.5-1%), high fill frequency. Compete on price. Best for high-capital vaults that can sustain volume.

- Target: 0.5-1% above market rate
- Pull live FX from Chainlink/Pyth oracles
- Update rates every 30-60 seconds
- Works best on high-volume corridors (USD/Venmo, EUR/Revolut, GBP/Revolut)
- Risk: sub-0.5% spreads lose money after gas and protocol fees

### Strategy 2: The Sommelier
Wide spreads (2-4%), fewer fills, higher yield per fill. 4.5x more yield per dollar than Speedrunner.

- Target: 2-4% above market rate
- Update rates less frequently (every 5-15 minutes)
- Works on any corridor, especially where competition is thin
- Risk: fewer fills, longer wait times

### Strategy 3: The Atlas
Maximum coverage. Price as many currency/payment method pairs as possible. Win on breadth.

- Cover 10+ currencies across multiple payment methods
- Use oracle feeds for all non-USD pairs to track FX automatically
- Long-tail currencies (MYR, JPY, THB, ILS) have real demand but almost no supply
- Risk: more pairs to monitor, wider surface area for mispricing

### Strategy 4: The Regular
One corridor, deep expertise. Venmo/USD only, or Revolut/EUR only.

- Pick a single payment method and currency
- Learn the fill patterns: when demand peaks, when it drops
- Price based on time-of-day and day-of-week patterns
- Risk: no diversification, corridor-dependent

### Anti-pattern: sub-0.5% spreads
263 of 1,107 depositors have negative yield. 127 of them run average spreads below 0.5%. Gas and protocol fees eat the margin. Minimum viable spread is ~0.5%.

## Example: basic rate engine

A minimal vault rate engine that pulls market data and sets rates:

```typescript
import { Peerlytics } from '@peerlytics/sdk';
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const RATE_MANAGER_V1 = '0xeEd7Db23e724aC4590D6dB6F78fDa6DB203535F3';
const RATE_MANAGER_ID = 'YOUR_RATE_MANAGER_ID'; // bytes32 from createRateManager
const SPREAD_BPS = 50; // 0.5% spread above market

const peerlytics = new Peerlytics();

const walletClient = createWalletClient({
  account: privateKeyToAccount(process.env.PRIVATE_KEY),
  chain: base,
  transport: http(process.env.RPC_URL),
});

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.RPC_URL),
});

async function updateRates() {
  // 1. Get current market data
  const orderbook = await peerlytics.getOrderbook();
  const summary = await peerlytics.getSummary();

  // 2. Calculate your rates based on market data
  // Example: price 0.5% above the current best fill rate
  const rates = calculateRates(orderbook, SPREAD_BPS);

  // 3. Push rates onchain
  const abi = parseAbi([
    'function setRateBatch(bytes32 rateManagerId, bytes32[] paymentMethods, bytes32[][] currencyCodes, uint256[][] rates)',
  ]);

  await walletClient.writeContract({
    address: RATE_MANAGER_V1,
    abi,
    functionName: 'setRateBatch',
    args: [RATE_MANAGER_ID, rates.paymentMethods, rates.currencyCodes, rates.values],
  });

  console.log(`Updated ${rates.paymentMethods.length} payment methods`);
}

function calculateRates(orderbook, spreadBps) {
  // Your pricing logic here
  // Pull FX rates from oracles or orderbook data
  // Apply your spread
  // Return formatted arrays for setRateBatch
}

// Run every 60 seconds
setInterval(updateRates, 60_000);
updateRates();
```

## Running your vault

Your vault is a Node.js script that runs continuously. Options:

- **VPS**: DigitalOcean, Hetzner, or any $5/month server. Run with pm2 or systemd.
- **Cloud function**: AWS Lambda, Google Cloud Functions, Cloudflare Workers with a cron trigger.
- **Home server**: Raspberry Pi, NUC, any always-on machine.
- **Container**: Docker on any cloud provider.

A $5/month server against 0.10% on every fill. The top vault did $35K volume in its first week.

### Deployment example (pm2)

```bash
npm install -g pm2
pm2 start rate-engine.js --name vault
pm2 save
pm2 startup  # auto-restart on reboot
```

### Monitoring

Use Peerlytics to monitor your vault performance:

```typescript
const vault = await peerlytics.getVault(RATE_MANAGER_ID);
// AUM, fees earned, delegation count, daily snapshots
```

Set up alerts for:
- Rate engine downtime (if your rate goes stale, depositor floors take over)
- Unusual spread drift
- New competitor vaults pricing the same corridors

## Getting listed

Once your vault is running, register it for visibility on peer.xyz/vaults:

1. Fork `github.com/zkp2p/vault-list`
2. Add your vault to `vault-list.json`:

```json
{
  "rateManagerId": "0x...",
  "chainId": 8453,
  "rateManagerAddress": "0xeEd7Db23e724aC4590D6dB6F78fDa6DB203535F3",
  "name": "Your Vault Name",
  "slug": "your-vault-name",
  "description": "What your vault does",
  "strategyShort": "One-line strategy description",
  "manager": {
    "address": "0x...",
    "name": "Your Name"
  },
  "fee": "0.10%",
  "maxFee": "2.0%",
  "paymentMethods": ["revolut", "wise", "venmo"],
  "currencies": ["USD", "EUR", "GBP"]
}
```

3. Run `npm install && npm run validate`
4. Open a PR

## Reference links

- Vault docs: https://docs.peer.xyz/guides/for-vault-managers/run-a-vault
- Peerlytics dashboard: https://peerlytics.xyz
- Peerlytics API docs: https://peerlytics.xyz/developers
- Peerlytics SDK: https://www.npmjs.com/package/@peerlytics/sdk
- ZKP2P SDK: https://www.npmjs.com/package/@zkp2p/sdk
- Vault registry: https://github.com/zkp2p/vault-list
- Live vaults: https://peer.xyz/vaults
- Orderbook: https://network.peerlytics.xyz
