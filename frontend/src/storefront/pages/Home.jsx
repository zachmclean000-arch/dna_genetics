import React from "react";
import HeroSection from "../components/HeroSection";
import FlowerSection from "../components/FlowerSection";
import TrustedSection from "../components/TrustedSection";
import LatestSeedsSection from "../components/LatestSeedsSection";
import AwardsSection from "../components/AwardsSection";
import ClassicStrainsSection from "../components/ClassicStrainsSection";
import GuaranteeSection from "../components/GuaranteeSection";
import {
  BestSellersSection,
  SeedVaultSection,
  MediaPressSection,
} from "../components/LowerHomeSections";
import BrandStorySection from "../components/BrandStorySection";
import {
  CrowdSection,
  RecommendedSection,
  HomeFaqSection,
} from "../components/ReputationSections";
import {
  PromotionsSection,
  GuideGallerySection,
  DnaMediaSection,
  SkywalkerSection,
} from "../components/HomeMediaSections";
import {
  QualityCollectionSection,
  FeaturedChocolopeSection,
  WholesaleSection,
} from "../components/CollectionSections";
export default function Home() {
  return (
    <>
      <HeroSection />
      <FlowerSection />
      <TrustedSection />
      <LatestSeedsSection />
      <AwardsSection />
      <ClassicStrainsSection />
      <GuaranteeSection />
      <BrandStorySection />
      <QualityCollectionSection />
      <FeaturedChocolopeSection />
      <WholesaleSection />
      <PromotionsSection />
      <GuideGallerySection />
      <DnaMediaSection />
      <SkywalkerSection />
      <BestSellersSection />
      <SeedVaultSection />
      <MediaPressSection />
      <CrowdSection />
      <RecommendedSection />
      <HomeFaqSection />
    </>
  );
}
