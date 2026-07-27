"use client";

import { ConversationSession } from "@/services/aiService";
import { MessageSquare, Plus, Search, Pin } from "lucide-react";

interface ConversationListProps {
  conversations: ConversationSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: ConversationListProps) {
  return (
    <aside className="glass-panel rounded-3xl p-4 border border-white/10 flex flex-col justify-between h-full">
      <div>
        {/* Top Header & New Chat */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
            Conversations
          </span>
          <button
            onClick={onNewChat}
            className="btn-gradient-primary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 text-white shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-none">
          {conversations.map((c) => {
            const isSelected = activeId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-slate-900/90 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                    : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold truncate flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {c.title}
                  </span>
                  {c.isPinned && <Pin className="w-3 h-3 text-purple-400 shrink-0" />}
                </div>

                <p className="text-[11px] text-slate-500 truncate font-mono">
                  {c.lastMessage}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
