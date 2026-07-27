"use client";

import { AIMessage } from "@/services/aiService";
import { Bot, User } from "lucide-react";
import { CitationCard } from "./CitationCard";

interface MessageBubbleProps {
  message: AIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Sender Avatar Icon */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
          isUser
            ? "bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/20"
            : "bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-cyan-500/20"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-slate-950" />
        )}
      </div>

      {/* Message Content Bubble */}
      <div className="max-w-xl space-y-3">
        <div
          className={`rounded-2xl px-4 py-3 text-xs leading-relaxed border shadow-xl ${
            isUser
              ? "bg-purple-600/30 border-purple-500/40 text-white"
              : "bg-slate-900/90 border-white/10 text-slate-200"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
          )}

          <span className="block text-[9px] font-mono text-slate-500 mt-1.5 text-right">
            {message.timestamp}
          </span>
        </div>

        {/* Citations Grid */}
        {message.citations && message.citations.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Grounded RAG Sources ({message.citations.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.citations.map((c) => (
                <CitationCard key={c.id} citation={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
