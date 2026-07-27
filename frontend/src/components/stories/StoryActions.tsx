"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Heart, Share2, Bot, Rocket } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

interface StoryActionsProps {
  storyTitle: string;
  relatedMissionId?: string;
  relatedPlanetId?: string;
}

export function StoryActions({
  storyTitle,
  relatedMissionId,
  relatedPlanetId,
}: StoryActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(3820);
  const [isLiked, setIsLiked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(
      isBookmarked ? "Removed Bookmark" : "Story Saved",
      isBookmarked
        ? `"${storyTitle}" removed from reading list.`
        : `"${storyTitle}" added to your personal collection.`,
      "success"
    );
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
      showToast("Story Liked", "Your appreciation has been recorded!", "success");
    } else {
      setLikes(likes - 1);
      setIsLiked(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link Copied", "Story URL copied to your clipboard!", "info");
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-2">
        <button
          onClick={handleBookmark}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isBookmarked
              ? "bg-purple-600/30 text-purple-300 border border-purple-500/50"
              : "glass-button text-slate-300 hover:text-white"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-purple-400 text-purple-400" : "text-purple-400"}`} />
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>

        <button
          onClick={handleLike}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isLiked
              ? "bg-pink-600/30 text-pink-300 border border-pink-500/50"
              : "glass-button text-slate-300 hover:text-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-pink-400 text-pink-400" : "text-pink-400"}`} />
          <span>{likes.toLocaleString()}</span>
        </button>

        <button
          onClick={handleShare}
          className="glass-button px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <Share2 className="w-4 h-4 text-cyan-400" />
          Share
        </button>
      </div>

      <div className="flex items-center gap-2">
        {relatedMissionId && (
          <Link
            href="/missions"
            className="glass-button px-3 py-2 rounded-xl text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5"
          >
            <Rocket className="w-4 h-4 text-indigo-400" />
            Related Mission
          </Link>
        )}

        <Link
          href="/ai-assistant"
          className="btn-gradient-purple px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-white"
        >
          <Bot className="w-4 h-4 text-yellow-300" />
          Ask AI About Chapter
        </Link>
      </div>
    </div>
  );
}
