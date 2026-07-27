"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchStoryById, StoryDetail } from "@/services/storyService";
import { StoryBackground } from "@/components/stories/StoryBackground";
import { StoryHero } from "@/components/stories/StoryHero";
import { StoryReader } from "@/components/stories/StoryReader";
import { ReadingProgress } from "@/components/stories/ReadingProgress";
import { AudioPlayer } from "@/components/stories/AudioPlayer";
import { ReadingSettings } from "@/components/stories/ReadingSettings";
import { ChapterNavigation } from "@/components/stories/ChapterNavigation";
import { StoryActions } from "@/components/stories/StoryActions";
import { StoryRecommendations } from "@/components/stories/StoryRecommendations";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default function StoryReaderPage({ params }: StoryPageProps) {
  const resolvedParams = use(params);
  const storyId = resolvedParams.id;

  const [story, setStory] = useState<StoryDetail | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // Typography Settings
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState<"sans" | "serif" | "mono">("sans");
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    fetchStoryById(storyId).then((data) => {
      setStory(data);
    });
  }, [storyId]);

  if (!story) {
    return (
      <div className="min-h-screen pt-32 text-center text-slate-400">
        Loading story document...
      </div>
    );
  }

  const currentChapter = story.chapters[currentChapterIndex] || story.chapters[0];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
      {/* Sticky Top Reading Progress Bar */}
      <ReadingProgress />

      {/* 3D WebGL Background Shifter */}
      <StoryBackground theme={story.backgroundTheme} />

      {/* Top Header Controls Bar */}
      {!focusMode && (
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-4 mb-6 z-10 relative">
          <Link
            href="/stories"
            className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Story Universe
          </Link>
          <span className="text-xs font-mono text-cyan-400 font-bold hidden sm:inline">
            ● Immersive 3D Story Mode
          </span>
        </div>
      )}

      {/* Hero Cover Header */}
      {!focusMode && <StoryHero story={story} />}

      {/* Audio Narration Bar */}
      {!focusMode && <AudioPlayer />}

      {/* Reading Controls & Typography Panel */}
      <ReadingSettings
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
      />

      {/* Chapter Reader Panel */}
      <StoryReader
        chapter={currentChapter}
        fontSize={fontSize}
        fontFamily={fontFamily}
      />

      {/* Chapter Switcher */}
      <ChapterNavigation
        chapters={story.chapters}
        currentChapterIndex={currentChapterIndex}
        onSelectChapterIndex={setCurrentChapterIndex}
      />

      {/* Story Actions */}
      {!focusMode && (
        <StoryActions
          storyTitle={story.title}
          relatedMissionId={story.relatedMissionId}
          relatedPlanetId={story.relatedPlanetId}
        />
      )}

      {/* End of Story Recommendations */}
      {!focusMode && <StoryRecommendations />}
    </div>
  );
}
