import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '7dbbaae48a395200228fd830f562f3af '; // please dont tag or create and issue report, this is meant to be public!

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const mainnet = defineChain({
  id: 210,
  name: 'Bitnet',
  nativeCurrency: { name: 'Bitnet', symbol: 'BTN', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.btnscan.com/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Btnscan',
      url: 'https://btnscan.com/',
    },
  },
});

const chains = [mainnet];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
