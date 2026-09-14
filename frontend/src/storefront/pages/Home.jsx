import React from "react";
import HeroSection from "../components/HeroSection";
import TrustedSection from "../components/TrustedSection";
import LatestSeedsSection from "../components/LatestSeedsSection";
import AwardsSection from "../components/AwardsSection";
import ClassicStrainsSection from "../components/ClassicStrainsSection";
import GuaranteeSection from "../components/GuaranteeSection";
import {
  BestSellersSection,
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
} from "../components/CollectionSections";
export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustedSection />
      <LatestSeedsSection />
      <AwardsSection />
      <ClassicStrainsSection />
      <GuaranteeSection />
      <BrandStorySection />
      <QualityCollectionSection />
      <FeaturedChocolopeSection />
      <PromotionsSection />
      <GuideGallerySection />
      <DnaMediaSection />
      <SkywalkerSection />
      <BestSellersSection />
      <MediaPressSection />
      <CrowdSection />
      <RecommendedSection />
      <HomeFaqSection />
    </>
  );
}
