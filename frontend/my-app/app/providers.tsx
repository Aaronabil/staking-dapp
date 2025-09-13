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
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
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

const myTheme = darkTheme({
    accentColor: '#fafafa',
    accentColorForeground: 'black',
    borderRadius: 'medium',
    fontStack: 'system',
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider modalSize="compact" theme={myTheme}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}