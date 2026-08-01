"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Clock, CheckCircle2, MessageSquare, Github, Twitter, Plus, Minus } from "lucide-react";
import { StarfieldCanvas } from "@/components/three/StarfieldCanvas";
import { EarthHeroCanvas } from "@/components/three/EarthHeroCanvas";
import { Footer } from "@/components/ui/Footer";

export default function ContactPage() {
  const [btnLabel, setBtnLabel] = useState("Transmit Message");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLabel("✓ Signal Received");
    e.currentTarget.reset();
    setTimeout(() => setBtnLabel("Transmit Message"), 2600);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Mission Control HQ",
      desc: "Level 12, Orbital Tower, Koramangala, Bengaluru 560095, India",
      color: "#4DA8FF",
    },
    {
      icon: Mail,
      title: "Email Us",
      desc: "hello@cosmora.space · press@cosmora.space · partners@cosmora.space",
      color: "#00E5FF",
    },
    {
      icon: Clock,
      title: "Response Time",
      desc: "We reply within one Earth day. Support: 24/7 via in-app chat.",
      color: "#FF7B54",
    },
  ];

  const communityChannels = [
    {
      icon: MessageSquare,
      title: "Discord",
      desc: "120k explorers chatting live about missions, theories and discoveries.",
      cta: "Join Server",
      link: "https://discord.gg",
      color: "#5865F2",
    },
    {
      icon: Github,
      title: "GitHub",
      desc: "Open-source components, data tools and our public roadmap.",
      cta: "View Repos",
      link: "https://github.com",
      color: "#F5F7FA",
    },
    {
      icon: Twitter,
      title: "Twitter / X",
      desc: "Launch alerts, JWST drops and daily cosmic wonder in your feed.",
      cta: "Follow Us",
      link: "https://twitter.com",
      color: "#4DA8FF",
    },
  ];

  const faqs = [
    {
      q: "How fast will I hear back?",
      a: "Within one business day for general enquiries, and within hours for Premium support via in-app chat.",
    },
    {
      q: "Do you take partnership pitches?",
      a: "Yes — museums, agencies and educators are exactly who we love to build with. Choose 'Partnership' in the form above.",
    },
    {
      q: "Can I contribute content?",
      a: "Community stories and guided tours arrive in late 2026. Join our Discord to get involved early.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#F5F7FA] overflow-x-hidden selection:bg-[#4DA8FF]/30 selection:text-white pt-24">
      {/* Starfield Background */}
      <StarfieldCanvas />

      {/* Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(1000px_700px_at_90%_10%,rgba(77,168,255,0.14),transparent_55%)]" />

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[400px]">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-[#00E5FF]/30 backdrop-blur-md text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
              Say Hello
            </div>
            <h1 className="font-['Space_Grotesk'] font-bold text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
              Let&apos;s explore{" "}
              <span className="bg-gradient-to-r from-[#4DA8FF] via-[#8B5CF6] to-[#00E5FF] bg-clip-text text-transparent bg-[length:200%_auto] animate-[aurora_6s_ease_infinite]">
                together
              </span>
            </h1>
            <p className="text-base sm:text-xl text-[#F5F7FA]/70 max-w-md leading-relaxed">
              Questions, partnerships, press or just a shared love of the cosmos — our team reads every message from mission control.
            </p>
          </div>

          <div className="relative h-[380px] w-full rounded-3xl overflow-hidden">
            <EarthHeroCanvas className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* FORM & CONTACT INFO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
          {/* Contact Form */}
          <div className="rounded-3xl p-8 md:p-10 border border-white/10 bg-white/6 backdrop-blur-md">
            <h2 className="font-['Space_Grotesk'] font-bold text-2xl mb-6 text-white">
              Send us a signal
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/60 mb-2">Name</label>
                  <input
                    required
                    placeholder="Ada Lovelace"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/14 text-white text-sm focus:outline-none focus:border-[#4DA8FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-2">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="you@galaxy.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/14 text-white text-sm focus:outline-none focus:border-[#4DA8FF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-2">Topic</label>
                <select className="w-full px-4 py-3 rounded-xl bg-[#08111F] border border-white/14 text-white text-sm focus:outline-none focus:border-[#4DA8FF] transition-colors">
                  <option value="general">General Question</option>
                  <option value="partnership">Partnership</option>
                  <option value="education">Education / Classroom</option>
                  <option value="press">Press & Media</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what's on your mind…"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/14 text-white text-sm focus:outline-none focus:border-[#4DA8FF] transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-[#4DA8FF] to-[#8B5CF6] text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {btnLabel.startsWith("✓") ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> {btnLabel}
                  </>
                ) : (
                  btnLabel
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 border border-white/10 bg-white/6 backdrop-blur-md flex gap-4 items-start"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center border"
                    style={{
                      backgroundColor: `${info.color}1f`,
                      borderColor: `${info.color}44`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: info.color }} />
                  </div>
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-semibold text-lg text-white mb-1">
                      {info.title}
                    </h3>
                    <p className="text-white/65 text-sm leading-relaxed">{info.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center mb-10">
          <div className="text-[#8B5CF6] text-xs font-mono tracking-[3px] uppercase mb-3">
            Community
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight">
            Join 200,000 explorers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityChannels.map((chan, idx) => {
            const Icon = chan.icon;
            return (
              <a
                key={idx}
                href={chan.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl p-7 border border-white/10 bg-white/6 backdrop-blur-md hover:-translate-y-1.5 transition-all duration-300 block"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border"
                  style={{
                    backgroundColor: `${chan.color}1f`,
                    borderColor: `${chan.color}44`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: chan.color }} />
                </div>
                <h3 className="font-['Space_Grotesk'] font-semibold text-xl mb-2 text-white">
                  {chan.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed mb-4">{chan.desc}</p>
                <span className="font-semibold text-sm" style={{ color: chan.color }}>
                  {chan.cta} →
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* QUICK FAQS */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center mb-8">
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl tracking-tight">
            Quick Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md overflow-hidden cursor-pointer"
              >
                <div className="p-5 flex justify-between items-center">
                  <h3 className="font-['Space_Grotesk'] font-semibold text-base text-white">
                    {faq.q}
                  </h3>
                  <span className="text-[#00E5FF] text-xl font-bold ml-4">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 text-white/65 text-sm leading-relaxed border-t border-white/6 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
