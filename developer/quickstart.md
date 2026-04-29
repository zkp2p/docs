---
id: quickstart
title: Quickstart
slug: /quickstart
---

# Quickstart

## What this does

This guide gets you from a blank TypeScript project to a working ZKP2P taker flow with `@zkp2p/sdk` `0.3.2+`. You will initialize a `Zkp2pClient`, inspect live liquidity, fetch a quote, and signal your first intent.

## Who is this for?

Use this if you want the fastest path from "I want to build on Peer" to "I have real code talking to the protocol."

## What you will build

- A Node.js script that connects to Base, reads deposits, fetches a quote, and signals an intent
- A minimal React component that does the same thing with `useSignalIntent()`
- A list of the next docs to read once the first transaction works

## Prerequisites

- Node.js `20+` or Bun
- A Base RPC URL
- A wallet with ETH for gas on Base
- For the Node example: a private key for that wallet

:::info Base USDC
All examples below use Base USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`.
:::

## 1. Create a project

Start with Bun:

```bash
mkdir peer-quickstart
cd peer-quickstart
bun init -y
bun add @zkp2p/sdk viem
```

If you also want the React example in the same session:

```bash
bun create vite peer-react-quickstart --template react-ts
cd peer-react-quickstart
bun add @zkp2p/sdk viem
```

## 2. Initialize `Zkp2pClient`

Create `scripts/quickstart.ts`:

```ts
import { Zkp2pClient, setLogLevel } from '@zkp2p/sdk';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { base } from 'viem/chains';

const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

const privateKey = process.env.PRIVATE_KEY as `0x${string}` | undefined;
const rpcUrl = process.env.RPC_URL;

if (!privateKey || !rpcUrl) {
  throw new Error('Set PRIVATE_KEY and RPC_URL first.');
}

setLogLevel('info');

const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(rpcUrl),
});

const client = new Zkp2pClient({
  walletClient,
  chainId: base.id,
  runtimeEnv: 'production',
});
```

## 3. Read deposits and fetch a quote

`client.getDeposits()` reads deposits owned by the connected wallet. `client.indexer.getDeposits()` is the faster way to inspect public liquidity when you are building a taker flow.

```ts
const myDeposits = await client.getDeposits();
console.log('connected wallet deposits:', myDeposits.length);

const publicDeposits = await client.indexer.getDeposits(
  { status: 'ACTIVE', acceptingIntents: true },
  { limit: 3, orderBy: 'remainingDeposits', orderDirection: 'desc' },
);

console.log(
  'top deposits:',
  publicDeposits.map((deposit) => ({
    id: deposit.id,
    remaining: deposit.remainingDeposits,
    depositor: deposit.depositor,
  })),
);

const quoteResponse = await client.getQuote({
  paymentPlatforms: ['wise'],
  fiatCurrency: 'USD',
  user: account.address,
  recipient: account.address,
  destinationChainId: base.id,
  destinationToken: USDC,
  amount: '25',
  isExactFiat: true,
});

const quote = quoteResponse.responseObject?.quotes?.[0];
if (!quote) {
  throw new Error('No quote found for the requested pair.');
}

console.log({
  paymentMethod: quote.paymentMethod,
  fiatAmount: quote.fiatAmountFormatted,
  tokenAmount: quote.tokenAmountFormatted,
  depositId: quote.intent.depositId,
});
```

## 4. Signal your first intent

Once you have a quote, pass its intent fields directly into `signalIntent()`.

```ts
const txHash = await client.signalIntent({
  depositId: BigInt(quote.intent.depositId),
  amount: BigInt(quote.signalIntentAmount ?? quote.intent.amount),
  toAddress: account.address,
  processorName: quote.intent.processorName,
  payeeDetails: quote.intent.payeeDetails,
  fiatCurrencyCode: quote.intent.fiatCurrencyCode,
  conversionRate: BigInt(quote.conversionRate),
  escrowAddress: quote.intent.escrowAddress as `0x${string}` | undefined,
  orchestratorAddress: quote.intent.orchestratorAddress as `0x${string}` | undefined,
});

console.log('signalIntent tx hash:', txHash);
```

Run it:

```bash
PRIVATE_KEY=0x... \
RPC_URL=https://base-mainnet.g.alchemy.com/v2/your-key \
bun run scripts/quickstart.ts
```

## 5. React version

For a React app, keep the quote lookup on the core client and use `useSignalIntent()` for transaction state.

```tsx
import {
  Zkp2pClient,
  type GetQuoteSingleResponse,
} from '@zkp2p/sdk';
import { useSignalIntent } from '@zkp2p/sdk/react';
import type { Address } from 'viem';
import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';
import { useEffect, useState } from 'react';

const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export default function App() {
  const [client, setClient] = useState<Zkp2pClient | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [quote, setQuote] = useState<GetQuoteSingleResponse | null>(null);

  const { signalIntent, isLoading, error, txHash } = useSignalIntent({ client });

  useEffect(() => {
    async function init() {
      if (!window.ethereum) return;

      const transport = custom(window.ethereum as any);
      const bootstrap = createWalletClient({ chain: base, transport });
      const [connectedAddress] = await bootstrap.requestAddresses();

      const walletClient = createWalletClient({
        account: connectedAddress,
        chain: base,
        transport,
      });

      setAddress(connectedAddress);
      setClient(
        new Zkp2pClient({
          walletClient,
          chainId: base.id,
        }),
      );
    }

    void init();
  }, []);

  async function loadQuote() {
    if (!client || !address) return;

    const response = await client.getQuote({
      paymentPlatforms: ['wise'],
      fiatCurrency: 'USD',
      user: address,
      recipient: address,
      destinationChainId: base.id,
      destinationToken: USDC,
      amount: '25',
      isExactFiat: true,
    });

    setQuote(response.responseObject?.quotes?.[0] ?? null);
  }

  async function reserveQuote() {
    if (!quote || !address) return;

    await signalIntent({
      depositId: BigInt(quote.intent.depositId),
      amount: BigInt(quote.signalIntentAmount ?? quote.intent.amount),
      toAddress: address,
      processorName: quote.intent.processorName,
      payeeDetails: quote.intent.payeeDetails,
      fiatCurrencyCode: quote.intent.fiatCurrencyCode,
      conversionRate: BigInt(quote.conversionRate),
      escrowAddress: quote.intent.escrowAddress as `0x${string}` | undefined,
      orchestratorAddress: quote.intent.orchestratorAddress as `0x${string}` | undefined,
    });
  }

  return (
    <main>
      <button onClick={loadQuote} disabled={!client || !address}>
        Load quote
      </button>

      {quote ? (
        <button onClick={reserveQuote} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Signal intent'}
        </button>
      ) : null}

      {quote ? (
        <pre>
          {JSON.stringify(
            {
              paymentMethod: quote.paymentMethod,
              fiatAmount: quote.fiatAmountFormatted,
              tokenAmount: quote.tokenAmountFormatted,
            },
            null,
            2,
          )}
        </pre>
      ) : null}

      {txHash ? <p>tx hash: {txHash}</p> : null}
      {error ? <p>error: {String(error)}</p> : null}
    </main>
  );
}
```

## Next steps

- Read [Architecture Overview](/developer/architecture) before you build anything stateful
- Use [Build an Onramp Widget](/developer/tutorials/onramp-widget) for the fastest embedded UX
- Use [Build a Maker Bot](/developer/tutorials/maker-bot) if you are supplying liquidity
- Keep [Client Reference](/developer/sdk/client-reference) open once you move past the first happy path

## Troubleshooting

- No quotes returned: widen `paymentPlatforms`, lower the amount, or confirm you are targeting the right `destinationToken`
- `Wallet client is missing account`: make sure your browser wallet client was created with an attached `account`, or use `privateKeyToAccount()` in Node
- Missing gating signature: some deposits require authenticated gating. Provide `apiKey` or `authorizationToken` so the SDK can auto-fetch it, or pass `gatingServiceSignature` and `signatureExpiration` yourself
- Transaction reverts on submit: check Base gas, the selected quote's lifetime, and whether your wallet is still on chain `8453`
