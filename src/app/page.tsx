import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeatureGrid />
    </div>
  );
}
