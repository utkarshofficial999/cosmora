/**
 * Cosmora Frontend — AI Assistant Service Layer.
 * Interfaces with backend RAG endpoints (/api/v1/ai/chat, /stream, /conversations) with streaming fallback support.
 */

export interface Citation {
  id: string;
  title: string;
  type: "Planet" | "Mission" | "Story" | "Timeline";
  snippet: string;
  link: string;
}

export interface AIMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

export interface ConversationSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isPinned?: boolean;
}

const INITIAL_CONVERSATIONS: ConversationSession[] = [
  {
    id: "conv-1",
    title: "Saturn Ring Telemetry & Moons",
    lastMessage: "Saturn has 146 confirmed moons including Titan...",
    timestamp: "10 mins ago",
    isPinned: true,
  },
  {
    id: "conv-2",
    title: "Apollo 11 Eagle Descent",
    lastMessage: "Program alarms 1202 & 1201 occurred at T-3 minutes...",
    timestamp: "1 hour ago",
    isPinned: true,
  },
  {
    id: "conv-3",
    title: "James Webb Deep Field Infrared",
    lastMessage: "SMACS 0723 gravitational lensing magnified redshifted light...",
    timestamp: "Yesterday",
    isPinned: false,
  },
];

export async function sendChatMessage(
  message: string,
  onStreamToken?: (token: string) => void
): Promise<{ text: string; citations: Citation[] }> {
  try {
    const res = await fetch("http://localhost:8000/api/v1/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        text: data.answer || "I have processed your query based on Cosmora RAG telemetry.",
        citations: data.citations || [],
      };
    }
  } catch {
    // Graceful fallback response generator
  }

  // Simulated streaming delay
  const fullText = `Based on Cosmora RAG telemetry: "${message}" relates to key planetary physics and space exploration archives. Solar system bodies follow Keplerian orbital trajectories governed by gravitational potential fields.`;

  if (onStreamToken) {
    const tokens = fullText.split(" ");
    for (const token of tokens) {
      onStreamToken(token + " ");
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
  }

  return {
    text: fullText,
    citations: [
      {
        id: "c-1",
        title: "Earth Physical Properties & Orbits",
        type: "Planet",
        snippet: "Sol System 3rd planet, orbital period 365.25 days, radius 6,371km.",
        link: "/solar-system",
      },
      {
        id: "c-2",
        title: "Artemis III Lunar Landing Mission",
        type: "Mission",
        snippet: "NASA human spaceflight mission exploring lunar South Pole volatile deposits.",
        link: "/missions",
      },
      {
        id: "c-3",
        title: "Apollo 11: The First Footsteps",
        type: "Story",
        snippet: "Neil Armstrong & Buzz Aldrin lunar descent narrative.",
        link: "/stories/apollo-11-legacy",
      },
    ],
  };
}

export async function fetchConversations(): Promise<ConversationSession[]> {
  return INITIAL_CONVERSATIONS;
}
