---
id: run-a-vault
title: Run a Vault
---

# Run a Vault

This guide covers everything you need to create and operate a vault on Peer. A vault lets you manage conversion rates on behalf of depositors (liquidity providers) and earn a fee on every fulfilled order.

Vaults use the `RateManagerV1` contract. All rate floor enforcement happens on `EscrowV2`.

---

## What is a vault?

A vault is a rate management layer. Depositors delegate their deposits to your vault, and you set the conversion rates for their payment method and currency pairs.

You can optionally charge a fee on every intent fulfilled through deposits delegated to your vault. The vault is non-custodial. Depositor USDC stays in escrow at all times.

**Contracts involved:**
- `RateManagerV1` (`0xeEd7Db23e724aC4590D6dB6F78fDa6DB203535F3`) for vault creation and rate setting
- `EscrowV2` for delegation, floor enforcement, and rate resolution

---

## 1. Create your vault

Vault creation is done directly on the `RateManagerV1` contract. The [@zkp2p/sdk](https://www.npmjs.com/package/@zkp2p/sdk) has full support for all vault operations if you prefer to integrate programmatically.

Call `createRateManager()` on `RateManagerV1` with a `RateManagerConfig` struct:

| Parameter | What it does | Can you change it later? |
|---|---|---|
| `manager` | Address that controls this vault (rate setting, fee changes) | Yes |
| `name` | Display name for your vault | Yes |
| `uri` | Metadata URI for your vault | Yes |
| `fee` | Fee charged on each fill (1e18 precision, e.g. 2e16 = 2%) | Yes (up to maxFee) |
| `feeRecipient` | Address that receives your fees | Yes |
| `maxFee` | Hard cap on your fee, ever (1e18 precision) | **No. Immutable.** |
| `minLiquidity` | Minimum deposit size to delegate to your vault (0 = no minimum) | Yes |

:::warning
`maxFee` is permanent. If you set it to 2%, you can never charge more than 2% on this vault, even if you lower your fee and want to raise it later. The global protocol cap is 5%.
:::

Your vault gets a `rateManagerId` on creation. You'll use this for all rate operations.

---

## 2. Set rates

You set rates per (paymentMethod, currencyCode) pair.

**Single pair:**
```solidity
setRate(rateManagerId, paymentMethod, currencyCode, rate)
```

**Multiple pairs at once:**
```solidity
setRateBatch(rateManagerId, paymentMethods[], currencyCodes[][], rates[][])
```

Currency codes and rates are nested arrays grouped by payment method index — each payment method maps to its own array of currencies and rates.

The `paymentMethod` and `currencyCode` values are bytes32 identifiers. You can find the full list of supported payment methods and currency codes in the [V3 deployments reference](/protocol/v3/v3-deployments).

### How rates are denominated

Rates are **fiat per USDC**. A rate of `0.7505` on GBP means 1 USDC costs 0.7505 GBP. Higher rate = more fiat per USDC = better for the depositor.

### Setting rate to 0

Setting your rate to `0` means you are not actively pricing that pair. The protocol computes `effectiveRate = max(managerRate, escrowFloor)`, so if the depositor has a non-zero floor, the floor still applies and the pair remains tradable. To fully disable a pair, the depositor must also have no floor set.

### Example

You manage a vault with Revolut/GBP and Revolut/EUR.

| Pair | Your rate | Depositor's floor | Effective rate |
|---|---|---|---|
| Revolut/GBP | 0.7505 | 0.7400 | 0.7505 (your rate wins) |
| Revolut/EUR | 0.8300 | 0.8450 | 0.8450 (floor wins) |
| Revolut/USD | 0 | 0 | 0 (pair inactive — no rate or floor) |
| Revolut/JPY | 0 | 152.00 | 152.00 (floor still applies) |

The protocol always takes `max(yourRate, depositorFloor)`. You can't undercut a depositor's floor. If your rate is higher, yours is used. If theirs is higher, theirs is used.

---

## 3. Rate resolution

For every intent, `EscrowV2.getEffectiveRate()` runs:

```
escrowFloor   = max(fixedFloor, oracleSpreadRate)
effectiveRate = max(managerRate, escrowFloor)
```

**What this means for you as a manager:**

| Scenario | What happens |
|---|---|
| Your rate > escrow floor | Your rate is used. You're actively pricing the pair. |
| Your rate < escrow floor | Escrow floor is used. Depositor is protected. |
| Your rate = 0, floor > 0 | Escrow floor is used. Pair remains tradable at the depositor's floor. |
| Your rate = 0, floor = 0 | Pair is inactive. No new intents. |
| Your contract reverts | Escrow falls back to the depositor's floor. |
| Oracle configured but stale | Oracle rate treated as 0. Fixed floor still applies (`escrowFloor = max(fixedFloor, 0) = fixedFloor`). Pair only halts if the fixed floor is also 0. |

:::info
If a depositor configured an oracle adapter and that oracle goes stale, the oracle rate is treated as 0. The fixed rate floor (if set) still applies. The pair only halts entirely if both the oracle rate and fixed floor are 0.
:::

---

## 4. Fees

Your fee is deducted from the USDC released when an intent is fulfilled. It goes to your `feeRecipient` address.

### How the fee affects the taker

The taker's all-in cost is:

```
takerRate = grossRate * 1e18 / (1e18 - managerFee)
```

**Example:** Gross rate is 1.00 USD/USDC, your fee is 2%.
- Taker sends 1.00 USD
- 0.98 USDC is released to the taker (2% fee deducted)
- 0.02 USDC goes to your fee recipient
- Taker's effective cost: ~1.0204 USD per USDC

### Fee timing

The fee is **snapshotted at intent signal time**. If you change your fee between when the intent is signaled and when it's fulfilled, the original fee applies to that intent.

### Fee caps

- Global protocol cap: **5%**
- Your vault's cap: whatever `maxFee` you set at creation (immutable)
- Current fee: whatever you've set, up to your `maxFee`

---

## 5. Strategies

How you approach rate management depends on what you and your depositors want.

### Conservative: fixed floor only, no oracle

Depositors set a fixed floor. You set rates above it. No oracle dependency, no halt risk. Simple and always-on. Good for USD stablecoin pairs where FX volatility isn't a concern.

### Market-tracking: oracle floor + your rate

Depositors configure an oracle adapter with a spread. The floor tracks the market automatically. You set rates on top. If the oracle goes stale, the oracle component drops to 0 but the fixed floor (if set) still applies. This is the right setup for non-USD currency pairs where FX moves matter.

### Recommended: fixed floor + oracle + your rate

Depositors set both a fixed floor and an oracle config. The escrow floor is `max(fixedFloor, oracleSpreadRate)`, and the effective rate is `max(yourRate, escrowFloor)`. Three layers of protection. If the oracle goes stale, the fixed floor ensures the pair remains tradable at a minimum rate.

### Full trust: no depositor floor

Depositors don't set any floor or oracle. Your rate is the only thing driving the pair. Setting it to 0 disables it. Only appropriate when you and the depositor have a high-trust relationship and you're actively managing rates 24/7.

---

## 6. Monitoring your vault

Once your vault is live, you can monitor it on the [Vaults page](https://peer.xyz/vaults) on Peer. Your vault page shows:

- **APR (30D)**, **Balance**, **Volume**, and **PNL** at a glance
- **Vault info** including your manager address, fee, fee recipient, and rate model
- **Charts** for volume, TVL, fees, and PNL over 7D / 30D / All time
- **Rates tab** showing your vault rate vs market rate and spread for every payment method and currency pair, with active/inactive status
- **Floor rates tab** showing depositor-configured floors
- **Delegations tab** showing which deposits are delegated to you
- **Order history** and **Rate history** tabs for full audit trail

You can filter rates by platform or currency to quickly check specific pairs.

---

## 7. Register your vault

Once your vault is deployed and running, add it to the [vault-list registry](https://github.com/zkp2p/vault-list) so it appears on peer.xyz/vaults and is visible to depositors.

### Steps

1. Fork [zkp2p/vault-list](https://github.com/zkp2p/vault-list)
2. Add your vault entry to the `vaults` array in `vault-list.json`
3. (Optional) Add a 256x256 PNG logo to `logos/<rateManagerId>/vault.png`
4. Run validation: `npm install && npm run validate`
5. Open a PR

### Required fields

| Field | Description |
|---|---|
| `rateManagerId` | bytes32 ID from the RateManagerV1 contract |
| `chainId` | `8453` (Base) |
| `rateManagerAddress` | RateManagerV1 contract address |
| `name` | Display name for your vault |
| `slug` | URL-safe identifier (lowercase, hyphens) |
| `description` | Short description, max 500 characters |
| `strategyShort` | One-line strategy summary |
| `manager.address` | Your manager wallet address |
| `manager.name` | Your display name |
| `paymentMethods` | Array of supported payment method identifiers |
| `currencies` | Array of supported fiat currencies (ISO 4217) |

### Optional fields

| Field | Description |
|---|---|
| `strategyLong` | Detailed strategy description (markdown supported) |
| `manager.twitter` | Your Twitter/X handle |
| `fee` | Current fee (e.g. `"0.10%"`) |
| `maxFee` | Maximum fee (e.g. `"2.0%"`) |
| `riskLevel` | `low`, `medium`, or `high` |
| `tags` | Filterable tags, max 10 (e.g. `["automated", "ai-managed"]`) |
| `links` | Object with `website`, `docs`, `twitter`, `discord`, `telegram` URLs |
| `logoURI` | URL to a 256x256 vault logo |

### Example entry

```json
{
  "rateManagerId": "0x...",
  "chainId": 8453,
  "rateManagerAddress": "0xeEd7Db23e724aC4590D6dB6F78fDa6DB203535F3",
  "name": "My Vault",
  "slug": "my-vault",
  "description": "USDC liquidity vault for European payment rails.",
  "strategyShort": "Automated rate management for EUR and GBP",
  "manager": {
    "address": "0x...",
    "name": "Your Name",
    "twitter": "yourhandle"
  },
  "fee": "0.50%",
  "maxFee": "2.0%",
  "paymentMethods": ["revolut", "wise"],
  "currencies": ["EUR", "GBP"],
  "riskLevel": "low",
  "tags": ["automated", "european"],
  "links": {
    "website": "https://yourvault.xyz",
    "twitter": "https://x.com/yourhandle"
  }
}
```

:::info
Dynamic data like TVL, volume, fill rate, and APY is not stored in the vault-list. This data is fetched at runtime from on-chain or the [ZKP2P indexer](https://indexer.zkp2p.xyz).
:::

Full schema and validation details: [github.com/zkp2p/vault-list](https://github.com/zkp2p/vault-list)

---

## 8. Reference vaults

Two live vaults on prod you can use as reference:

**Delegate by USDCtoFiat**
- ID: `0x8666d6...fc41c` on RateManagerV1
- Fee: 0.10% (max 2%)
- 14 payment methods, 34 currencies
- Strategy: AI-powered rate engine, fully automated
- UI: [delegate.usdctofiat.xyz](https://delegate.usdctofiat.xyz/)
- Twitter: [@usdctofiat](https://x.com/usdctofiat)

**J.A.R.V.I.S Fund**
- ID: `0x65b105...fc6e` on RateManagerV1
- Fee: 0.10% (max 2%)
- 14 payment methods, 33 currencies
- Strategy: Autonomous multi-strategy management with competitive analysis and fill-rate feedback loops
- Twitter: [@paboracle](https://x.com/paboracle)

---

## Quick reference

| Action | Contract | Function |
|---|---|---|
| Create vault | RateManagerV1 | `createRateManager(config)` where config is a `RateManagerConfig` struct |
| Set rate (single) | RateManagerV1 | `setRate(rateManagerId, paymentMethod, currencyCode, rate)` |
| Set rates (batch) | RateManagerV1 | `setRateBatch(rateManagerId, paymentMethods[], currencyCodes[][], rates[][])` |
| Change fee | RateManagerV1 | `setFee(rateManagerId, newFee)` |
| Change fee recipient | RateManagerV1 | `setFeeRecipient(rateManagerId, newRecipient)` |
| Depositor delegates | EscrowV2 | `setRateManager(depositId, rateManager, rateManagerId)` |
| Depositor exits | EscrowV2 | `clearRateManager(depositId)` |
| Depositor sets floor | EscrowV2 | `setCurrencyMinRate(depositId, paymentMethod, currencyCode, rate)` |
| Depositor sets oracle | EscrowV2 | `setOracleRateConfig(depositId, paymentMethod, currencyCode, config)` |

---

## Safety guarantees

- **Depositor funds never leave escrow.** Delegation only controls rate management.
- **Depositor floor is always enforced.** `max(managerRate, escrowFloor)` is computed by Escrow, not by your contract.
- **Oracle stale = fixed floor fallback.** If a depositor configured an oracle and it goes stale, the oracle rate is treated as 0. The fixed floor still applies. The pair only halts if the fixed floor is also 0.
- **Manager revert = fallback.** If your contract reverts, Escrow uses the depositor's floor. No downtime.
- **Settlement is independent.** The attestation service determines actual amounts based on real payment. Rate management only controls whether intents can be signaled, not how much is released.
- **Depositors can exit anytime.** No lock-up, no delay, no approval needed from you.

If you have questions, reach out in the Peer Liquidity Providers Telegram group.
