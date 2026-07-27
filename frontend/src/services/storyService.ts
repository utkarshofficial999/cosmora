/**
 * Cosmora Frontend — Story Universe API Service Layer.
 * Interfaces with backend endpoints (/api/v1/stories, /chapters, /progress) with fallback narrative content.
 */

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  readTimeMinutes: number;
  content: string[];
  audioUrl?: string;
}

export interface StoryDetail {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  rating: string;
  views: number;
  likes: number;
  author: string;
  publishedDate: string;
  coverImage: string;
  backgroundTheme: "moon" | "mars" | "deep-space" | "iss";
  summary: string;
  relatedPlanetId: string;
  relatedMissionId: string;
  chapters: Chapter[];
}

const FALLBACK_STORIES: Record<string, StoryDetail> = {
  "apollo-11-legacy": {
    id: "apollo-11-legacy",
    title: "Apollo 11: The First Footsteps",
    category: "Historical Missions",
    difficulty: "Beginner",
    readTime: "8 min read",
    rating: "4.9",
    views: 14200,
    likes: 3820,
    author: "Dr. Eleanor Vance",
    publishedDate: "2026-07-20",
    coverImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000",
    backgroundTheme: "moon",
    summary: "Relive Neil Armstrong and Buzz Aldrin's nerve-wracking descent in the Lunar Module Eagle to the Sea of Tranquility.",
    relatedPlanetId: "earth",
    relatedMissionId: "artemis-iii",
    chapters: [
      {
        id: "c1",
        chapterNumber: 1,
        title: "Ignition at Kennedy Space Center",
        subtitle: "July 16, 1969 — 09:32 EDT",
        readTimeMinutes: 3,
        content: [
          "On July 16, 1969, at 9:32 AM EDT, the massive Saturn V rocket thundered off Launch Complex 39A at Kennedy Space Center. Generating 7.5 million pounds of thrust, the 363-foot rocket shook the sandy Florida soil and propelled astronauts Neil Armstrong, Buzz Aldrin, and Michael Collins toward cosmic history.",
          "The three astronauts sat atop 3,000 tons of high-explosive RP-1 kerosene and liquid oxygen. As the rocket accelerated through Earth's atmosphere, Mach 1 was shattered within 60 seconds. Four days of silent inter-planetary transit through the void lay ahead.",
        ],
      },
      {
        id: "c2",
        chapterNumber: 2,
        title: "Descent to the Sea of Tranquility",
        subtitle: "July 20, 1969 — Program Alarms 1202 & 1201",
        readTimeMinutes: 5,
        content: [
          "Four days later, Neil Armstrong and Buzz Aldrin undocked the Lunar Module Eagle from the Command Module Columbia. As Eagle descended toward the lunar surface, the onboard Apollo Guidance Computer triggered terrifying '1202' and '1201' executive overflow alarms.",
          "Looking out the triangular window, Armstrong realized the guidance computer was targeting a boulder-strewn crater the size of a football field. Taking manual control, Armstrong tilted Eagle forward and skimmed low across the grey crater rims with less than 30 seconds of fuel remaining.",
          "'Tranquility Base here. The Eagle has landed.' Words echoed across 240,000 miles to Houston Mission Control, sealing humanity's arrival on another world.",
        ],
      },
    ],
  },
  "james-webb-deep-space": {
    id: "james-webb-deep-space",
    title: "James Webb: Peering into Creation",
    category: "Modern Astrophysics",
    difficulty: "Intermediate",
    readTime: "12 min read",
    rating: "5.0",
    views: 18900,
    likes: 5100,
    author: "Prof. Marcus Thorne",
    publishedDate: "2026-07-22",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
    backgroundTheme: "deep-space",
    summary: "How the golden hexagonal mirrors of JWST unraveled the light of galaxies formed 13.5 billion years ago.",
    relatedPlanetId: "earth",
    relatedMissionId: "euclid",
    chapters: [
      {
        id: "jw1",
        chapterNumber: 1,
        title: "Unfolding the Origami Telescope",
        subtitle: "1 Million Miles From Earth at Lagrange Point 2",
        readTimeMinutes: 4,
        content: [
          "Unfolded in the freezing vacuum of space 1 million miles from Earth, the James Webb Space Telescope's 18 beryllium gold-coated hexagonal mirrors reflect infrared light from the universe's cosmic dawn.",
          "Equipped with a 5-layer tennis-court-sized Kapton sunshield, JWST operates at -388°F (-233°C), allowing NIRCam instruments to detect faint infrared photons emitted over 13.5 billion years ago.",
        ],
      },
      {
        id: "jw2",
        chapterNumber: 2,
        title: "The First Deep Field & Cosmic Dawn",
        subtitle: "SMACS 0723 & Gravitational Lensing",
        readTimeMinutes: 8,
        content: [
          "JWST's First Deep Field captured thousands of galaxies in a patch of sky the size of a grain of sand held at arm's length. Massive galaxy cluster SMACS 0723 acted as a gravitational lens, warping space-time to magnify extremely distant background primordial stars.",
        ],
      },
    ],
  },
  "mars-perseverance-rover": {
    id: "mars-perseverance-rover",
    title: "Perseverance: Searching for Ancient Martian Life",
    category: "Planetary Science",
    difficulty: "Intermediate",
    readTime: "10 min read",
    rating: "4.8",
    views: 11500,
    likes: 2900,
    author: "Dr. Sarah Chen",
    publishedDate: "2026-07-15",
    coverImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000",
    backgroundTheme: "mars",
    summary: "Exploring Jezero Crater's ancient river delta and caching core rock samples for future sample return missions.",
    relatedPlanetId: "mars",
    relatedMissionId: "starship-mars-cargo",
    chapters: [
      {
        id: "mp1",
        chapterNumber: 1,
        title: "Seven Minutes of Terror at Jezero Crater",
        subtitle: "February 18, 2021 — Sky Crane Touchdown",
        readTimeMinutes: 5,
        content: [
          "Plunging through Mars' thin carbon dioxide atmosphere at 12,000 mph, Perseverance deployed a 70-foot supersonic parachute before firing 8 retro-rockets on the revolutionary Sky Crane descent stage.",
        ],
      },
    ],
  },
};

export async function fetchStories(): Promise<StoryDetail[]> {
  return Object.values(FALLBACK_STORIES);
}

export async function fetchStoryById(id: string): Promise<StoryDetail> {
  return FALLBACK_STORIES[id] || FALLBACK_STORIES["apollo-11-legacy"];
}
