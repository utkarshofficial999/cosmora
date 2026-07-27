"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      setIsListening(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Simulated Speech Fallback if browser Speech API unsupported
      setIsListening(true);
      setTimeout(() => {
        onTranscript("Tell me about Saturn ring composition and telemetry.");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`p-3 rounded-xl transition-all ${
        isListening
          ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40"
          : "glass-button text-slate-300 hover:text-white"
      }`}
      title={isListening ? "Listening... Speak now" : "Push-to-Talk Voice Input"}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}
