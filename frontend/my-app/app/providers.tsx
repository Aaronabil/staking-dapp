'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import {
    metaMaskWallet,
    walletConnectWallet,
    rabbyWallet,
    trustWallet,
    braveWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
    appName: 'My Staking dApp',
    projectId: '25114afadb465573a21832ab14bb32e8',
    chains: [sepolia],
    wallets: [
        {
            groupName: 'Recommended',
            wallets: [
                metaMaskWallet,
                walletConnectWallet,
                rabbyWallet,
                trustWallet,
                braveWallet,
            ],
        },
    ],
    transports: {
        [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    },
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider modalSize="compact" theme={darkTheme()}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}