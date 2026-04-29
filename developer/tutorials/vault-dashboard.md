---
id: vault-dashboard
title: Build a Vault Dashboard
---

# Build a Vault Dashboard

## What this does

This tutorial builds a React dashboard for vault operators and depositors. It loads vault lists, vault detail, delegated deposits, daily snapshots, profit history, and manual or oracle-driven rate updates.

## Who is this for?

Use this if you operate a vault, compare vaults, or want a custom analytics surface instead of relying on the default Peer UI.

## Prerequisites

- React 18+
- `@zkp2p/sdk`, `viem`
- A Base wallet for browser access

## 1. Install dependencies

```bash
bun add @zkp2p/sdk viem
```

## 2. Create a browser client

Create `src/lib/client.ts`:

```ts
import { Zkp2pClient } from '@zkp2p/sdk';
import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export async function createDashboardClient() {
  if (!window.ethereum) return null;

  const transport = custom(window.ethereum as any);
  const bootstrap = createWalletClient({ chain: base, transport });
  const [address] = await bootstrap.requestAddresses();

  return new Zkp2pClient({
    walletClient: createWalletClient({
      account: address,
      chain: base,
      transport,
    }),
    chainId: base.id,
  });
}
```

## 3. Load vault list and detail

Create `src/App.tsx`:

```tsx
import {
  classifyDelegationState,
  type IndexerManagerDailySnapshot,
  type IndexerManualRateUpdate,
  type IndexerOracleConfigUpdate,
  type IndexerRateManagerDelegation,
  type IndexerRateManagerDetail,
  type IndexerRateManagerListItem,
  type Zkp2pClient,
} from '@zkp2p/sdk';
import { useEffect, useMemo, useState } from 'react';
import { createDashboardClient } from './lib/client';

type VaultBundle = {
  detail: IndexerRateManagerDetail | null;
  delegations: IndexerRateManagerDelegation[];
  dailySnapshots: IndexerManagerDailySnapshot[];
  profitSnapshots: Array<Record<string, unknown>>;
  manualRateUpdates: IndexerManualRateUpdate[];
  oracleConfigUpdates: IndexerOracleConfigUpdate[];
};

export default function App() {
  const [client, setClient] = useState<Zkp2pClient | null>(null);
  const [vaults, setVaults] = useState<IndexerRateManagerListItem[]>([]);
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);
  const [selectedVaultAddress, setSelectedVaultAddress] = useState<string | null>(null);
  const [bundle, setBundle] = useState<VaultBundle | null>(null);

  useEffect(() => {
    async function init() {
      const client = await createDashboardClient();
      if (!client) return;

      setClient(client);

      const vaults = await client.indexer.getRateManagers(
        { limit: 25, orderBy: 'currentDelegatedBalance', orderDirection: 'desc' },
        {},
      );

      setVaults(vaults);

      const first = vaults[0]?.manager;
      if (first) {
        setSelectedVaultId(first.rateManagerId);
        setSelectedVaultAddress(first.rateManagerAddress ?? null);
      }
    }

    void init();
  }, []);

  useEffect(() => {
    async function loadVaultBundle() {
      if (!client || !selectedVaultId) return;

      const detail = await client.indexer.getRateManagerDetail(selectedVaultId, {
        rateManagerAddress: selectedVaultAddress,
        statsLimit: 30,
      });

      const delegations = await client.indexer.getRateManagerDelegations(selectedVaultId, {
        limit: 100,
        orderBy: 'delegatedAt',
        orderDirection: 'desc',
        rateManagerAddress: selectedVaultAddress ?? undefined,
      });

      const dailySnapshots = await client.indexer.getManagerDailySnapshots(selectedVaultId, {
        limit: 30,
        rateManagerAddress: selectedVaultAddress,
      });

      const profitSnapshots = await client.indexer.getProfitSnapshotsByDeposits(
        delegations.map((item) => item.depositId),
      );

      const manualRateUpdates = await client.indexer.getManualRateUpdates(selectedVaultId, {
        limit: 50,
        rateManagerAddress: selectedVaultAddress,
      });

      const oracleConfigUpdates = await client.indexer.getOracleConfigUpdates(selectedVaultId, {
        limit: 50,
        rateManagerAddress: selectedVaultAddress,
      });

      setBundle({
        detail,
        delegations,
        dailySnapshots,
        profitSnapshots,
        manualRateUpdates,
        oracleConfigUpdates,
      });
    }

    void loadVaultBundle();
  }, [client, selectedVaultId, selectedVaultAddress]);

  const delegationRows = useMemo(() => {
    if (!bundle?.detail) return [];

    return bundle.delegations.map((delegation) => ({
      ...delegation,
      state: classifyDelegationState(
        delegation.rateManagerId,
        delegation.rateManagerAddress,
        bundle.detail?.manager.rateManagerId,
        bundle.detail?.manager.rateManagerAddress,
      ),
    }));
  }, [bundle]);

  return (
    <main>
      <h1>Vault Dashboard</h1>

      <section>
        <h2>Vaults</h2>
        {vaults.map((item) => (
          <button
            key={`${item.manager.rateManagerAddress}:${item.manager.rateManagerId}`}
            onClick={() => {
              setSelectedVaultId(item.manager.rateManagerId);
              setSelectedVaultAddress(item.manager.rateManagerAddress ?? null);
            }}
          >
            {item.manager.name} | delegated {item.aggregate?.currentDelegatedBalance ?? '0'}
          </button>
        ))}
      </section>

      {bundle?.detail ? (
        <section>
          <h2>{bundle.detail.manager.name}</h2>
          <p>fee: {bundle.detail.manager.fee}</p>
          <p>max fee: {bundle.detail.manager.maxFee}</p>
          <p>delegated deposits: {bundle.delegations.length}</p>
          <p>manual rate updates: {bundle.manualRateUpdates.length}</p>
          <p>oracle config updates: {bundle.oracleConfigUpdates.length}</p>
        </section>
      ) : null}

      <section>
        <h2>Delegations</h2>
        {delegationRows.map((item) => (
          <div key={item.id}>
            <strong>{item.depositId}</strong> | {item.state}
          </div>
        ))}
      </section>

      <section>
        <h2>Daily snapshots</h2>
        {bundle?.dailySnapshots.map((snapshot) => (
          <div key={snapshot.id}>
            {snapshot.dayTimestamp}: volume {snapshot.totalFilledVolume}
          </div>
        ))}
      </section>
    </main>
  );
}
```

## 4. What the dashboard is querying

- `getRateManagers()` gives you the top-level vault list
- `getRateManagerDetail()` gives you the selected vault's metadata, rates, aggregate stats, and recent stats
- `getRateManagerDelegations()` gives you the deposit list currently delegated to that vault
- `getManagerDailySnapshots()` gives you time-series rollups
- `getProfitSnapshotsByDeposits()` lets you project PnL across the delegated deposit set
- `getManualRateUpdates()` and `getOracleConfigUpdates()` fill the change-log panels

## 5. Add richer panels

Once the base screen is working, the next useful panels are:

- A rate table built from `bundle.detail.rates`
- A PnL chart built from `bundle.profitSnapshots`
- A spread-history table that merges `manualRateUpdates` and `oracleConfigUpdates`
- A drill-down drawer powered by `client.indexer.getDelegationForDeposit(depositId)`

## 6. Render delegation state clearly

`classifyDelegationState()` is the simplest way to tag a row without duplicating vault-logic in your UI:

```ts
const state = classifyDelegationState(
  delegation.rateManagerId,
  delegation.rateManagerAddress,
  selectedVault.manager.rateManagerId,
  selectedVault.manager.rateManagerAddress,
);

// 'delegated_here' | 'delegated_elsewhere' | 'not_delegated'
```

This is useful when a depositor can compare several vaults side by side.

## Troubleshooting

- Vault list is empty: make sure you are querying the right `runtimeEnv` and that your indexer endpoint is reachable
- Delegation state looks wrong: compare both `rateManagerId` and `rateManagerAddress`; the helper expects both when available
- Metrics lag behind live fills: the indexer is eventually consistent. Use RPC-first reads for immediate pre-transaction checks and indexer queries for reporting
- You need a read-only dashboard: the SDK still expects a `walletClient`, so the simplest browser path is to use a connected wallet for reads

## Next steps

- Read [Delegation State Machine](/developer/cookbook/delegation) for vault-routing edge cases
- Read [Oracle Rate Configuration](/developer/cookbook/oracle-rates) if you want to surface floor or spread data in the UI
- Keep [Client Reference](/developer/sdk/client-reference) open for the exact indexer method list
