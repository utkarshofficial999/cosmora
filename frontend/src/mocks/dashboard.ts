export interface ExplorerProfile {
  name: string;
  callsign: string;
  rank: string;
  clearanceLevel: number;
  avatarUrl: string;
  streakDays: number;
  expPoints: number;
  nextLevelExp: number;
  level: number;
}

export interface TelemetryStats {
  readingHours: number;
  storiesCompleted: number;
  planetsExplored: number;
  missionsCompleted: number;
  weeklyProgress: { day: string; hours: number }[];
  learningProgressPercent: number;
}

export interface ISSData {
  latitude: number;
  longitude: number;
  altitudeKm: number;
  velocityKmh: number;
  visibility: string;
  orbitPhase: string;
}

export interface LaunchItem {
  id: string;
  missionName: string;
  agency: "SpaceX" | "NASA" | "ISRO" | "ESA";
  rocket: string;
  launchPad: string;
  targetDate: string; // ISO String
  payload: string;
  status: "GO" | "HOLD" | "FINAL COUNTDOWN";
}

export interface SpaceWeather {
  solarWindSpeedKms: number;
  geomagneticStormIndex: string; // e.g. "G1 Minor"
  solarFlareClass: string; // e.g. "X2.3"
  sunspotCount: number;
  auroraForecast: string;
}

export interface JourneyStory {
  id: string;
  title: string;
  category: string;
  progressPercent: number;
  remainingMinutes: number;
  imageUrl: string;
  readCount: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: string;
  rarity: "Legendary" | "Epic" | "Rare" | "Common";
}

export interface TimelineItem {
  id: string;
  timestamp: string;
  type: "story_completed" | "achievement_unlocked" | "ai_chat" | "mission_joined";
  title: string;
  description: string;
  badge?: string;
}

export const MOCK_EXPLORER: ExplorerProfile = {
  name: "Commander Alex Vance",
  callsign: "ORION-01",
  rank: "Senior Space Explorer",
  clearanceLevel: 5,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  streakDays: 14,
  expPoints: 12450,
  nextLevelExp: 15000,
  level: 12,
};

export const MOCK_TELEMETRY: TelemetryStats = {
  readingHours: 48.5,
  storiesCompleted: 34,
  planetsExplored: 8,
  missionsCompleted: 12,
  weeklyProgress: [
    { day: "Mon", hours: 2.1 },
    { day: "Tue", hours: 3.5 },
    { day: "Wed", hours: 1.8 },
    { day: "Thu", hours: 4.2 },
    { day: "Fri", hours: 2.9 },
    { day: "Sat", hours: 5.4 },
    { day: "Sun", hours: 3.8 },
  ],
  learningProgressPercent: 78,
};

export const MOCK_ISS: ISSData = {
  latitude: 51.6432,
  longitude: -0.1278,
  altitudeKm: 418.5,
  velocityKmh: 27580,
  visibility: "Daylight Orbit",
  orbitPhase: "Equatorial Crossing #4912",
};

export const MOCK_LAUNCHES: LaunchItem[] = [
  {
    id: "launch-1",
    missionName: "Starship Flight Test 6",
    agency: "SpaceX",
    rocket: "Super Heavy / Starship",
    launchPad: "Starbase, Boca Chica, TX",
    targetDate: "2026-08-05T18:00:00Z",
    payload: "Catch Test & Orbital Payload",
    status: "GO",
  },
  {
    id: "launch-2",
    missionName: "Gaganyaan G1 Flight",
    agency: "ISRO",
    rocket: "LVM3-M4",
    launchPad: "SDSC SHAR, Sriharikota",
    targetDate: "2026-08-12T04:30:00Z",
    payload: "Uncrewed Human Module",
    status: "FINAL COUNTDOWN",
  },
  {
    id: "launch-3",
    missionName: "Artemis II Crewed Lunar Flyby",
    agency: "NASA",
    rocket: "SLS Block 1",
    launchPad: "Pad 39B, Kennedy Space Center",
    targetDate: "2026-09-20T14:00:00Z",
    payload: "Orion Crew Capsule",
    status: "GO",
  },
];

export const MOCK_SPACE_WEATHER: SpaceWeather = {
  solarWindSpeedKms: 482.4,
  geomagneticStormIndex: "G2 Moderate",
  solarFlareClass: "X1.8 Active",
  sunspotCount: 142,
  auroraForecast: "High Latitude Activity Visible (KP Index 5.6)",
};

export const MOCK_JOURNEY_STORIES: JourneyStory[] = [
  {
    id: "story-1",
    title: "James Webb Discovers Water Vapor on Exoplanet WASP-18b",
    category: "Astrophysics",
    progressPercent: 65,
    remainingMinutes: 4,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    readCount: "14.2k explorers",
  },
  {
    id: "story-2",
    title: "Inside Europa Clipper: The Search for Subsurface Life",
    category: "Astrobiology",
    progressPercent: 40,
    remainingMinutes: 7,
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80",
    readCount: "9.8k explorers",
  },
  {
    id: "story-3",
    title: "The Physics of Supermassive Black Hole Event Horizons",
    category: "Cosmology",
    progressPercent: 88,
    remainingMinutes: 2,
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
    readCount: "22.5k explorers",
  },
];

export const MOCK_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: "ach-1",
    title: "Starlight Pioneer",
    description: "Read 25 deep space astrophysics exploration logs.",
    iconName: "Sparkles",
    unlockedAt: "2026-07-28",
    rarity: "Legendary",
  },
  {
    id: "ach-2",
    title: "Orbital Specialist",
    description: "Completed full interactive 3D Solar System analysis.",
    iconName: "Orbit",
    unlockedAt: "2026-07-25",
    rarity: "Epic",
  },
  {
    id: "ach-3",
    title: "Astro AI Pilot",
    description: "Conducted 10 AI queries regarding black hole physics.",
    iconName: "Bot",
    unlockedAt: "2026-07-20",
    rarity: "Rare",
  },
  {
    id: "ach-4",
    title: "Daily Voyager",
    description: "Maintained a 14-day continuous platform streak.",
    iconName: "Flame",
    unlockedAt: "2026-07-31",
    rarity: "Epic",
  },
];

export const MOCK_TIMELINE: TimelineItem[] = [
  {
    id: "tl-1",
    timestamp: "10 mins ago",
    type: "story_completed",
    title: "Completed Story Log",
    description: "Finished reading 'The Mystery of Dark Energy & Cosmic Inflation'.",
    badge: "+150 EXP",
  },
  {
    id: "tl-2",
    timestamp: "2 hours ago",
    type: "achievement_unlocked",
    title: "Unlocked Badge: Daily Voyager",
    description: "Reached a 14-day consecutive active space exploration streak!",
    badge: "EPIC BADGE",
  },
  {
    id: "tl-3",
    timestamp: "Yesterday",
    type: "ai_chat",
    title: "Astro-AI Diagnostic",
    description: "Consulted Astro-AI regarding relativistic time dilation near Sagittarius A*.",
  },
  {
    id: "tl-4",
    timestamp: "2 days ago",
    type: "mission_joined",
    title: "Joined Mission Protocol",
    description: "Enrolled in Mars Terraforming Simulation Expedition #42.",
  },
];

export const MOCK_SPACE_NEWS = [
  {
    id: "news-1",
    title: "JWST Captures Gravitational Lensing Cluster Cosmic Ring",
    timeAgo: "2h ago",
    source: "NASA Science",
  },
  {
    id: "news-2",
    title: "ISRO Prepares Chandrayaan-4 Sample Return Mission Architecture",
    timeAgo: "5h ago",
    source: "ISRO Telemetry",
  },
  {
    id: "news-3",
    title: "Solar Flare X-Class Radio Blackout Observed Over Pacific",
    timeAgo: "8h ago",
    source: "Space Weather Center",
  },
];
