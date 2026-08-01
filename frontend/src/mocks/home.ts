export interface HomeHeroRecommendation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  rating: number;
  duration: string;
  matchScore: number;
  imageUrl: string;
  videoUrl?: string;
  tags: string[];
}

export interface CarouselItem {
  id: string;
  title: string;
  category: string;
  subtitle?: string;
  readTime: string;
  imageUrl: string;
  progressPercent?: number;
  badge?: string;
  rating?: number;
  author?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export const MOCK_HOME_HERO: HomeHeroRecommendation = {
  id: "hero-1",
  title: "INTERSTELLAR JOURNEYS: BEYOND THE EVENT HORIZON",
  subtitle: "COSMORA FEATURED DOCUMENTARY STORY",
  description:
    "Embark on an immersive, physics-accurate visual journey to the edge of space and time. Uncover how Kerr black holes warp spacetime, bending starlight into magnificent Einstein rings.",
  category: "Deep Space Cosmology",
  rating: 4.9,
  duration: "18 MIN READ",
  matchScore: 98,
  imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80",
  tags: ["Black Holes", "Relativity", "JWST Data", "Interactive 3D"],
};

export const MOCK_CONTINUE_LEARNING: CarouselItem[] = [
  {
    id: "cont-1",
    title: "James Webb Discovers Atmospheric Water on WASP-18b",
    category: "Exoplanets",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    progressPercent: 65,
    badge: "65% COMPLETED",
  },
  {
    id: "cont-2",
    title: "Europa Ocean Depth Analysis: Is Subsurface Life Possible?",
    category: "Astrobiology",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80",
    progressPercent: 40,
    badge: "40% COMPLETED",
  },
  {
    id: "cont-3",
    title: "The Physics of Supermassive Black Hole Accretion Disks",
    category: "Astrophysics",
    readTime: "15 min read",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
    progressPercent: 88,
    badge: "88% COMPLETED",
  },
  {
    id: "cont-4",
    title: "Solar Storms & Planetary Magnetospheres",
    category: "Space Weather",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=600&q=80",
    progressPercent: 20,
    badge: "20% COMPLETED",
  },
];

export const MOCK_MARS_COLLECTION: CarouselItem[] = [
  {
    id: "mars-1",
    title: "Terraforming Mars: Oxygen Generation via MOXIE Protocol",
    category: "Mars Exploration",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    badge: "FEATURED",
  },
  {
    id: "mars-2",
    title: "Perseverance Rover Captures Ancient Martian River Delta",
    category: "Planetary Science",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
  },
  {
    id: "mars-3",
    title: "Valles Marineris: Exploring the Grand Canyon of Mars",
    category: "Geology",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
  },
  {
    id: "mars-4",
    title: "SpaceX Starship Architecture for Martian Colonization",
    category: "Rocketry",
    readTime: "14 min read",
    imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80",
    rating: 4.95,
    badge: "POPULAR",
  },
];

export const MOCK_ISRO_COLLECTION: CarouselItem[] = [
  {
    id: "isro-1",
    title: "Gaganyaan: India's Human Spaceflight Program Architecture",
    category: "ISRO Missions",
    readTime: "11 min read",
    imageUrl: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    badge: "ISRO HEADLINE",
  },
  {
    id: "isro-2",
    title: "Chandrayaan-3 Lunar South Pole Landing Scientific Results",
    category: "Lunar Exploration",
    readTime: "13 min read",
    imageUrl: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=600&q=80",
    rating: 4.95,
  },
  {
    id: "isro-3",
    title: "Aditya-L1 Solar Mission: Studying L1 Halo Orbit Flares",
    category: "Heliophysics",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=600&q=80",
    rating: 4.85,
  },
];

export const MOCK_BLACK_HOLE_COLLECTION: CarouselItem[] = [
  {
    id: "bh-1",
    title: "Sagittarius A*: Weighing the 4-Million Solar Mass Monster",
    category: "Black Holes",
    readTime: "16 min read",
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    badge: "MUST READ",
  },
  {
    id: "bh-2",
    title: "Hawking Radiation & Quantum Black Hole Thermodynamics",
    category: "Theoretical Physics",
    readTime: "20 min read",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
    rating: 4.88,
  },
  {
    id: "bh-3",
    title: "LIGO & Virgo: Gravitational Wave Binary Black Hole Mergers",
    category: "Astrophysics",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    rating: 4.92,
  },
];

export const MOCK_DAILY_QUIZ: QuizQuestion = {
  id: "quiz-101",
  question: "What is the escape velocity required to break free from Earth's gravitational pull?",
  options: ["7.9 km/s", "11.2 km/s", "16.7 km/s", "29.8 km/s"],
  correctIndex: 1,
  explanation:
    "Earth's escape velocity is approximately 11.2 km/s (around 25,000 mph). Objects travelling at or above this speed can escape Earth's gravity without further propulsion.",
  points: 250,
};
