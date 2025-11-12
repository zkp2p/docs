---
title: Examples
---

### Proof‑Only app shell
```tsx
import { Zkp2pProvider, useZkp2p } from '@zkp2p/zkp2p-react-native-sdk';

export default function App() {
  return (
    <Zkp2pProvider chainId={8453} prover="reclaim_gnark">
      <Flow />
    </Zkp2pProvider>
  );
}

function Flow() {
  const { initiate, authenticate, generateProof, provider, interceptedPayload } = useZkp2p();

  const run = async () => {
    await initiate!('venmo', 'transfer_venmo');
    // Or await authenticate!('venmo','transfer_venmo');
    const proof = await generateProof!(provider!, interceptedPayload!, '0xINTENT', 0);
    console.log('zkTLS proof JSON string:', proof);
  };

  return <Button title="Run" onPress={run} />;
}
```

### Check session at startup
```ts
const { isSessionActive, authenticate } = useZkp2p();
const ok = await isSessionActive!('venmo', 'transfer_venmo');
if (!ok) await authenticate!('venmo', 'transfer_venmo');
```

### Headless proof UI
```tsx
<Zkp2pProvider hideDefaultProofUI>
  <App />
</Zkp2pProvider>
```

### Full Mode: quote → intent → proof → fulfill
```ts
const { zkp2pClient, initiate, generateProof, provider, interceptedPayload } = useZkp2p();

// 1) Get quote (API)
const quote = await zkp2pClient!.getQuote({
  paymentPlatforms: ['venmo'],
  fiatCurrency: 'USD',
  user: walletAddress,
  recipient: walletAddress,
  destinationChainId: 8453,
  destinationToken: zkp2pClient!.getUsdcAddress(),
  amount: '1000000', // 1.00 USD in cents
});

// 2) Signal intent (contracts + API)
const res = await zkp2pClient!.signalIntent({
  processorName: 'venmo',
  depositId: '123',
  amount: '1000000',
  payeeDetails: '0x…',
  toAddress: walletAddress as any,
  currencyHash: quote.responseObject?.fiat?.currencyCodeHash as any,
  conversionRate: quote.responseObject?.quotes?.[0]?.conversionRate || '1000000000000000000',
});

// 3) Authenticate + proof
await initiate!('venmo', 'transfer_venmo');
const zkTlsProof = await generateProof!(provider!, interceptedPayload!, res.responseObject.intentData.gatingServiceSignature, 0);

// 4) Fulfill intent (attestation + contracts)
await zkp2pClient!.fulfillIntent({
  platform: 'venmo',
  actionType: 'transfer_venmo',
  intentHash: res.responseObject.intentData.gatingServiceSignature as any, // example only
  zkTlsProof,
  amount: '1000000',
  timestampMs: String(Date.now()),
  fiatCurrency: quote.responseObject!.fiat.currencyCodeHash as any,
  conversionRate: '1000000000000000000',
  payeeDetails: '0x…' as any,
  timestampBufferMs: '10000000',
});
```

### Reset and clean between runs
```ts
const { resetState, clearSession } = useZkp2p();
await resetState();
await clearSession({ iosAlsoClearWebKitStore: true });
```
