"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { LiveSpaceWidgets } from "@/components/widgets/LiveSpaceWidgets";
import { MiniSolarSystem } from "@/components/3d/MiniSolarSystem";
import { AnalyticsSection } from "@/components/widgets/AnalyticsSection";
import { MyJourneySection } from "@/components/widgets/MyJourneySection";
import { ActivityTimeline } from "@/components/widgets/ActivityTimeline";
import { RightSidebarWidgets } from "@/components/widgets/RightSidebarWidgets";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Mission Control Hero */}
        <DashboardHero />

        {/* Live Space Telemetry Widgets */}
        <LiveSpaceWidgets />

        {/* Main Grid: Left Main Telemetry vs Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Interactive 3D Miniature Solar System */}
            <MiniSolarSystem />

            {/* Iron Man HUD Telemetry & Analytics */}
            <AnalyticsSection />

            {/* My Journey & Continue Reading */}
            <MyJourneySection />

            {/* Chronological Activity Timeline */}
            <ActivityTimeline />
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4">
            <RightSidebarWidgets />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
