// import Image from "next/image";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="absolute top-6 right-6">
        <ConnectButton />
      </div>
      <h1 className="text-4xl font-bold">Staking dApp</h1>
    </main>
  );
}
