export interface LandingSite {
  name: string;
  agency: string;
  year: string;
  lat: number;
  long: number;
  description: string;
}

export interface MoonDetail {
  id: string;
  slug: string;
  name: string;
  planetSlug: string;
  radius: string;
  mass: string;
  gravity: string;
  orbitalPeriod: string;
  surfaceTemp: string;
  description: string;
  landingSites: LandingSite[];
  geology: string;
  futureMissions: string[];
}

export const MOCK_MOONS: Record<string, MoonDetail> = {
  moon: {
    id: "moon",
    slug: "moon",
    name: "The Moon (Luna)",
    planetSlug: "earth",
    radius: "1,737 km",
    mass: "7.34 × 10²² kg",
    gravity: "1.62 m/s²",
    orbitalPeriod: "27.3 days",
    surfaceTemp: "-130°C to 120°C",
    description: "Earth's only natural satellite, tidally locked in synchronous rotation, revealing its heavily cratered highlands and dark volcanic maria.",
    landingSites: [
      {
        name: "Apollo 11 Landing Site",
        agency: "NASA",
        year: "1969",
        lat: 0.674,
        long: 23.47,
        description: "Sea of Tranquility—First human crewed lunar landing by Neil Armstrong & Buzz Aldrin.",
      },
      {
        name: "Chandrayaan-3 Shiv Shakti Point",
        agency: "ISRO",
        year: "2023",
        lat: -69.37,
        long: 32.35,
        description: "Historic lunar South Pole landing exploring water ice deposits and elemental composition.",
      },
      {
        name: "Artemis III Target Landing Site",
        agency: "NASA",
        year: "2026",
        lat: -89.5,
        long: 0.0,
        description: "South Pole Shackleton Crater region targeting permanently shadowed water ice regions.",
      },
    ],
    geology: "Composed of silicate crust, anorthositic highlands, basaltic maria plains, and an iron-rich core.",
    futureMissions: ["NASA Artemis Program", "ISRO Chandrayaan-4 Sample Return", "CNSA ILRS Station"],
  },
  europa: {
    id: "europa",
    slug: "europa",
    name: "Europa",
    planetSlug: "jupiter",
    radius: "1,560 km",
    mass: "4.80 × 10²² kg",
    gravity: "1.31 m/s²",
    orbitalPeriod: "3.55 days",
    surfaceTemp: "-160°C",
    description: "Icy moon of Jupiter containing a global subsurface liquid water ocean with more water than all of Earth's oceans combined.",
    landingSites: [],
    geology: "Crisscrossed by reddish brown lineae fractures created by tidal flexure from Jupiter's gravitational pull.",
    futureMissions: ["NASA Europa Clipper", "ESA JUICE Mission"],
  },
  titan: {
    id: "titan",
    slug: "titan",
    name: "Titan",
    planetSlug: "saturn",
    radius: "2,574 km",
    mass: "1.34 × 10²³ kg",
    gravity: "1.35 m/s²",
    orbitalPeriod: "15.9 days",
    surfaceTemp: "-179°C",
    description: "Saturn's largest moon with a thick nitrogen-methane atmosphere and liquid hydrocarbon lakes of methane and ethane.",
    landingSites: [
      {
        name: "Huygens Landing Spot",
        agency: "ESA/NASA",
        year: "2005",
        lat: -10.2,
        long: 192.4,
        description: "First landing in the outer Solar System, revealing rounded ice pebbles and liquid methane rainfall.",
      },
    ],
    geology: "Organic rich dunes, liquid methane lakes (Kraken Mare), and a subsurface water-ammonia ocean.",
    futureMissions: ["NASA Dragonfly Rotorcraft (2028 Launch)"],
  },
};
