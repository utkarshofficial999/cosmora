"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HomeHero } from "@/components/home/HomeHero";
import { RecommendationCarousel } from "@/components/home/RecommendationCarousel";
import { DailyChallengeCard } from "@/components/home/DailyChallengeCard";
import { BookOpen, Compass, Globe2, Sparkles, Flame } from "lucide-react";
import {
  MOCK_CONTINUE_LEARNING,
  MOCK_MARS_COLLECTION,
  MOCK_ISRO_COLLECTION,
  MOCK_BLACK_HOLE_COLLECTION,
} from "@/mocks/home";

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Netflix-style Cinematic Hero Recommendation */}
        <HomeHero />

        {/* Continue Learning Carousel */}
        <RecommendationCarousel
          title="Continue Learning & Reading"
          icon={BookOpen}
          items={MOCK_CONTINUE_LEARNING}
        />

        {/* Interactive Space Quiz Challenge */}
        <DailyChallengeCard />

        {/* Because You Like Mars Collection */}
        <RecommendationCarousel
          title="Because You Like Mars & Planetary Science"
          icon={Compass}
          items={MOCK_MARS_COLLECTION}
        />

        {/* ISRO Human Spaceflight Collection */}
        <RecommendationCarousel
          title="ISRO Space Program & Chandrayaan Missions"
          icon={Globe2}
          items={MOCK_ISRO_COLLECTION}
        />

        {/* Black Holes & Deep Space Cosmology */}
        <RecommendationCarousel
          title="Black Holes, Relativity & Deep Space Cosmology"
          icon={Sparkles}
          items={MOCK_BLACK_HOLE_COLLECTION}
        />
      </div>
    </DashboardLayout>
  );
}
