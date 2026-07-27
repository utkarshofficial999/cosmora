"use client";

import { useState, useRef, useEffect } from "react";
import { AIMessage } from "@/services/aiService";
import { Send, Bot, Sparkles } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { VoiceRecorder } from "./VoiceRecorder";
import { SuggestedPrompts } from "./SuggestedPrompts";

interface ChatWindowProps {
  messages: AIMessage[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
}

export function ChatWindow({
  messages,
  isThinking,
  onSendMessage,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between h-[calc(100vh-180px)]">
      {/* Top Bar Indicator */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white font-display">
            AI Hologram Conversation Channel
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          ● RAG Active
        </span>
      </div>

      {/* Message Stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-none"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Hologram RAG Core querying vector database...
          </div>
        )}
      </div>

      {/* Input Section */}
      <div>
        <SuggestedPrompts onSelectPrompt={onSendMessage} />

        <div className="glass-panel rounded-2xl p-2 flex items-center gap-2 border border-white/10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI about planets, missions, stories, or telemetry..."
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />

          <VoiceRecorder onTranscript={onSendMessage} />

          <button
            onClick={handleSend}
            className="btn-gradient-primary p-3 rounded-xl text-white shadow-lg shadow-purple-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
