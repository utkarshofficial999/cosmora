"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Sparkles, RefreshCw, Cpu, Activity } from "lucide-react";
import {
  fetchConversations,
  sendChatMessage,
  AIMessage,
  ConversationSession,
} from "@/services/aiService";
import { Hologram } from "@/components/ai/Hologram";
import { ConversationList } from "@/components/ai/ConversationList";
import { ChatWindow } from "@/components/ai/ChatWindow";

export default function AIAssistantPage() {
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [hologramState, setHologramState] = useState<"idle" | "thinking" | "speaking">("idle");
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Greetings explorer! I am the Cosmora 3D Hologram Intelligence Core. Grounded in space physics, solar system telemetry, and mission logs. How may I assist your exploration today?",
      timestamp: "Just now",
      citations: [
        {
          id: "cit-1",
          title: "3D Solar System Orbits",
          type: "Planet",
          snippet: "Interactive 3D Keplerian planetary orbital simulation.",
          link: "/solar-system",
        },
      ],
    },
  ]);

  useEffect(() => {
    fetchConversations().then((data) => setConversations(data));
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setHologramState("thinking");

    // Send query to AI Service
    const aiResponse = await sendChatMessage(text);

    setHologramState("speaking");

    const aiMsg: AIMessage = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: aiResponse.text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      citations: aiResponse.citations,
    };

    setMessages((prev) => [...prev, aiMsg]);

    setTimeout(() => {
      setHologramState("idle");
    }, 2500);
  };

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: ConversationSession = {
      id: newId,
      title: "New Exploration Channel",
      lastMessage: "Channel initialized...",
      timestamp: "Just now",
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
    setMessages([messages[0]]);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Top Header Command Bar */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white font-display">
                Cosmora 3D Hologram Assistant
              </h1>
              <p className="text-xs text-cyan-400 font-mono">
                Grounded RAG Intelligence • 3D WebGL Avatar Active
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Command Center Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Conversations History Sidebar (3 cols) */}
        <div className="lg:col-span-3 hidden lg:block">
          <ConversationList
            conversations={conversations}
            activeId={activeConvId}
            onSelect={setActiveConvId}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Center Column: Interactive Chat Window (6 cols) */}
        <div className="lg:col-span-6">
          <ChatWindow
            messages={messages}
            isThinking={hologramState === "thinking"}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Right Column: 3D Hologram Core Stage & Telemetry (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* 3D Hologram Core Stage Card */}
          <div className="glass-panel rounded-3xl p-4 border border-white/10 text-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Hologram Core
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {hologramState.toUpperCase()}
              </span>
            </div>

            {/* 3D WebGL Hologram Scene */}
            <div className="w-full h-64 relative">
              <Hologram state={hologramState} />
            </div>

            <p className="text-[11px] text-slate-400 font-mono mt-2">
              Pulsating Icosahedron Energy Core with Dual Gyroscopic Holographic Rings
            </p>
          </div>

          {/* AI Core Telemetry */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Model Engine</span>
              <span className="text-white font-bold">Cosmora RAG v1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Embedding Vector</span>
              <span className="text-cyan-400 font-bold">pgvector 1536d</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Stream Latency</span>
              <span className="text-emerald-400 font-bold">35ms / token</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Voice Synthesis</span>
              <span className="text-purple-400 font-bold">Web Speech API</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
