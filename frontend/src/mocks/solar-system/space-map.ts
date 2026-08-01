export interface SpacecraftTrajectory {
  id: string;
  name: string;
  agency: string;
  target: string;
  currentDistanceAU: number;
  speedKms: number;
  status: "Active Telemetry" | "Interstellar Transit" | "En Route";
  coordinates: { x: number; y: number; z: number };
}

export const MOCK_SPACECRAFT: SpacecraftTrajectory[] = [
  {
    id: "voyager1",
    name: "Voyager 1",
    agency: "NASA",
    target: "Interstellar Medium",
    currentDistanceAU: 162.8,
    speedKms: 17.0,
    status: "Interstellar Transit",
    coordinates: { x: 140, y: 45, z: 70 },
  },
  {
    id: "voyager2",
    name: "Voyager 2",
    agency: "NASA",
    target: "Interstellar Heliosheath",
    currentDistanceAU: 136.2,
    speedKms: 15.4,
    status: "Interstellar Transit",
    coordinates: { x: -110, y: -65, z: -40 },
  },
  {
    id: "perseverance",
    name: "Perseverance & Ingenuity",
    agency: "NASA",
    target: "Mars Jezero Crater",
    currentDistanceAU: 1.52,
    speedKms: 24.1,
    status: "Active Telemetry",
    coordinates: { x: 5.5, y: 1.2, z: 0.5 },
  },
  {
    id: "chandrayaan3",
    name: "Chandrayaan-3 Vikram Lander",
    agency: "ISRO",
    target: "Moon Shiv Shakti Point",
    currentDistanceAU: 1.0025,
    speedKms: 1.02,
    status: "Active Telemetry",
    coordinates: { x: 4.4, y: 0.2, z: 0.1 },
  },
];
