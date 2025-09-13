import { StakingUI } from '../components/StakingUI';
import HeroSection from '@/components/hero-section';
import Features from '@/components/features-1';
import IntegrationsSection from '@/components/integrations-5';
import FAQsThree from '@/components/faqs-3';
import FooterSection from '@/components/footer';

export default function Home() {
  return (
    <>
      <HeroSection />
      <section id="features">
        <Features />
      </section>
      <section id="integrations">
        <IntegrationsSection />
      </section>
      <section id="staking" className="flex w-full flex-col items-center justify-center py-12 md:py-32 px-6">
        <StakingUI />
      </section>
      <section id="faq">
        <FAQsThree />
      </section>
      <FooterSection />
    </>
  );
}
