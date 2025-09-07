// import Image from "next/image";
import { StakingUI } from '../components/StakingUI';
// import { HeroHeader } from '@/components/header';
import HeroSection from '@/components/hero-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <StakingUI />
    </>
  );
}
