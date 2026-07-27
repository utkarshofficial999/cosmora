/**
 * Cosmora Frontend — Mission Control API Service Layer.
 * Interfaces with backend endpoints (/api/v1/missions, /agencies, /milestones) with fallback mock structure.
 */

export interface MissionMilestone {
  id: string;
  title: string;
  stage: "Launch" | "Orbit Insertion" | "Cruise" | "Landing" | "Mission Complete";
  timestamp: string;
  completed: boolean;
  description: string;
}

export interface SpaceMission {
  id: string;
  name: string;
  agency: "NASA" | "ISRO" | "ESA" | "SpaceX";
  agencyLogo: string;
  target: string;
  launchDate: string;
  status: "Active Ops" | "Scheduled" | "In Preparation" | "Completed";
  type: string;
  description: string;
  crew: string[];
  duration: string;
  objectives: string[];
  telemetrySpeed: string;
  distanceFromEarth: string;
  milestones: MissionMilestone[];
  color: string;
}

const FALLBACK_MISSIONS: SpaceMission[] = [
  {
    id: "artemis-iii",
    name: "Artemis III",
    agency: "NASA",
    agencyLogo: "🚀",
    target: "Moon - South Pole",
    launchDate: "2026-09-15T12:00:00Z",
    status: "Scheduled",
    type: "Human Lunar Landing",
    description: "First human landing on the lunar South Pole region to explore water ice deposits and establish sustainable exploration.",
    crew: ["Reid Wiseman", "Victor Glover", "Christina Koch", "Jeremy Hansen"],
    duration: "30 Days",
    objectives: [
      "Land 2 astronauts near lunar South Pole",
      "Collect 85kg of lunar volatile samples",
      "Test next-generation xEMU spacesuits",
    ],
    telemetrySpeed: "1.02 km/s",
    distanceFromEarth: "384,400 km",
    color: "from-blue-600 to-indigo-600",
    milestones: [
      { id: "m1", title: "SLS Core Stage Ignition & Liftoff", stage: "Launch", timestamp: "T+00:00:00", completed: true, description: "SLS Rocket lifts off from Launch Complex 39B" },
      { id: "m2", title: "Trans-Lunar Injection (TLI)", stage: "Orbit Insertion", timestamp: "T+01:45:00", completed: true, description: "Orion spacecraft enters lunar transfer trajectory" },
      { id: "m3", title: "Translunar Coast Phase", stage: "Cruise", timestamp: "T+2 Days", completed: true, description: "Traversing 384,000km to lunar orbit" },
      { id: "m4", title: "Starship HLS South Pole Descent", stage: "Landing", timestamp: "T+5 Days", completed: false, description: "Precision touchdown near Shackleton crater" },
      { id: "m5", title: "Lunar Surface Splashdown Return", stage: "Mission Complete", timestamp: "T+30 Days", completed: false, description: "Orion capsule re-entry and Pacific splashdown" },
    ],
  },
  {
    id: "gaganyaan-1",
    name: "Gaganyaan-1",
    agency: "ISRO",
    agencyLogo: "🛰️",
    target: "Low Earth Orbit",
    launchDate: "2026-11-20T06:30:00Z",
    status: "In Preparation",
    type: "Human Spaceflight",
    description: "India's inaugural crewed orbital spacecraft mission carrying 3 astronauts into a 400km orbit for 3 days.",
    crew: ["Prashanth Nair", "Ajit Krishnan", "Angad Pratap", "Subhanshu Shukla"],
    duration: "3 Days",
    objectives: [
      "Demonstrate indigenous crew module orbital capability",
      "Validate environmental control and life support systems (ECLSS)",
      "Execute safe sea recovery in Bay of Bengal",
    ],
    telemetrySpeed: "7.80 km/s",
    distanceFromEarth: "400 km",
    color: "from-orange-500 to-amber-600",
    milestones: [
      { id: "gm1", title: "LVM3 Launch Vehicle Ignition", stage: "Launch", timestamp: "T+00:00:00", completed: true, description: "LVM3 lifts off from Sriharikota" },
      { id: "gm2", title: "Orbital Insertion at 400km", stage: "Orbit Insertion", timestamp: "T+00:16:00", completed: true, description: "Crew module enters 400km circular orbit" },
      { id: "gm3", title: "3-Day Microgravity Experiments", stage: "Cruise", timestamp: "T+1 Day", completed: false, description: "Executing bio-medical space payloads" },
      { id: "gm4", title: "De-orbit Burn & Atmospheric Re-entry", stage: "Landing", timestamp: "T+3 Days", completed: false, description: "Controlled atmospheric entry" },
      { id: "gm5", title: "Bay of Bengal Parachute Recovery", stage: "Mission Complete", timestamp: "T+3 Days", completed: false, description: "Indian Navy retrieves crew module" },
    ],
  },
  {
    id: "starship-mars-cargo",
    name: "Starship Mars Flight 1",
    agency: "SpaceX",
    agencyLogo: "✨",
    target: "Mars - Jezero Crater",
    launchDate: "2026-12-10T18:00:00Z",
    status: "Active Ops",
    type: "Interplanetary Cargo",
    description: "Uncrewed Starship cargo demonstration delivering robotic surface infrastructure and propellent synthesis hardware to Mars.",
    crew: ["Autonomous Robotic System"],
    duration: "6 Months",
    objectives: [
      "Demonstrate interplanetary Mars aerocapture",
      "Deploy Sabatier fuel production units",
      "Map subterranean water ice layers",
    ],
    telemetrySpeed: "11.20 km/s",
    distanceFromEarth: "225,000,000 km",
    color: "from-cyan-500 to-blue-600",
    milestones: [
      { id: "sm1", title: "Starship Super Heavy Orbital Launch", stage: "Launch", timestamp: "T+00:00:00", completed: true, description: "33 Raptor engines ignite in Boca Chica" },
      { id: "sm2", title: "In-Space Cryogenic Refueling", stage: "Orbit Insertion", timestamp: "T+01:00:00", completed: true, description: "Propellant transfer in LEO" },
      { id: "sm3", title: "Trans-Mars Injection (TMI)", stage: "Cruise", timestamp: "T+1 Day", completed: true, description: "Cruising 225M km across heliocentric orbit" },
      { id: "sm4", title: "Mars Supersonic Retropropulsion", stage: "Landing", timestamp: "T+6 Months", completed: false, description: "Vertical landing on Martian soil" },
      { id: "sm5", title: "Surface Infrastructure Deployment", stage: "Mission Complete", timestamp: "T+6 Months", completed: false, description: "Robotics initiate base construction" },
    ],
  },
];

export async function fetchMissions(): Promise<SpaceMission[]> {
  try {
    const res = await fetch("http://localhost:8000/api/v1/missions", {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Graceful fallback if backend unavailable during static prerendering
  }
  return FALLBACK_MISSIONS;
}

export async function fetchMissionById(id: string): Promise<SpaceMission> {
  const missions = await fetchMissions();
  return missions.find((m) => m.id === id) || missions[0];
}
