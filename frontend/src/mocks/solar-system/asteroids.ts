export interface AsteroidItem {
  id: string;
  name: string;
  designation: string;
  type: "C-Type (Carbonaceous)" | "S-Type (Silicaceous)" | "M-Type (Metallic)" | "V-Type";
  diameterKm: number;
  orbitDistanceAU: number;
  hazardous: boolean;
  velocityKms: number;
  potentialImpactDate?: string;
  estimatedValueUsd?: string;
  description: string;
}

export const MOCK_ASTEROIDS: AsteroidItem[] = [
  {
    id: "ceres",
    name: "1 Ceres",
    designation: "Dwarf Planet / Asteroid #1",
    type: "C-Type (Carbonaceous)",
    diameterKm: 939.4,
    orbitDistanceAU: 2.77,
    hazardous: false,
    velocityKms: 17.9,
    description: "The largest object in the main asteroid belt, containing water ice ice-mantle reservoirs.",
  },
  {
    id: "vesta",
    name: "4 Vesta",
    designation: "Asteroid #4",
    type: "V-Type",
    diameterKm: 525.4,
    orbitDistanceAU: 2.36,
    hazardous: false,
    velocityKms: 19.3,
    description: "Second most massive asteroid, featuring Rheasilvia crater at its south pole.",
  },
  {
    id: "psyche",
    name: "16 Psyche",
    designation: "Metal-Rich Core #16",
    type: "M-Type (Metallic)",
    diameterKm: 226.0,
    orbitDistanceAU: 2.92,
    hazardous: false,
    velocityKms: 17.3,
    estimatedValueUsd: "$10,000 Quadrillion",
    description: "Exposed metallic iron-nickel core of a protoplanet currently targeted by NASA Psyche mission.",
  },
  {
    id: "apophis",
    name: "99942 Apophis",
    designation: "Potentially Hazardous NEO",
    type: "S-Type (Silicaceous)",
    diameterKm: 0.37,
    orbitDistanceAU: 0.92,
    hazardous: true,
    velocityKms: 30.7,
    potentialImpactDate: "2029-04-13 (Close Flyby)",
    description: "Near-Earth asteroid that will pass within 31,600 km of Earth's surface in April 2029.",
  },
  {
    id: "bennu",
    name: "101955 Bennu",
    designation: "Sample Return Asteroid",
    type: "C-Type (Carbonaceous)",
    diameterKm: 0.49,
    orbitDistanceAU: 1.12,
    hazardous: true,
    velocityKms: 28.0,
    description: "Carbonaceous asteroid sampled by OSIRIS-REx, revealing prebiotic organic molecules.",
  },
];
