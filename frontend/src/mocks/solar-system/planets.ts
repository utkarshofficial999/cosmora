export interface PlanetDetail {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: "Star" | "Terrestrial" | "Gas Giant" | "Ice Giant" | "Dwarf Planet";
  color: string;
  radius: string;
  mass: string;
  gravity: string;
  orbitalPeriod: string;
  rotationPeriod: string;
  distanceSun: string;
  tempAvg: string;
  moonsCount: number;
  description: string;
  atmosphereLayers: { name: string; altitude: string; desc: string }[];
  internalStructure: { layer: string; thickness: string; desc: string }[];
  missions: { agency: string; name: string; year: string; type: string }[];
  gallery: { url: string; caption: string }[];
  aiSummary: string;
}

export const MOCK_PLANETS: Record<string, PlanetDetail> = {
  sun: {
    id: "sun",
    slug: "sun",
    name: "Sun",
    subtitle: "The Heart of the Solar System",
    category: "Star",
    color: "#fbbf24",
    radius: "696,340 km",
    mass: "1.989 × 10³⁰ kg",
    gravity: "274 m/s²",
    orbitalPeriod: "230 Million Years (Galactic)",
    rotationPeriod: "25-35 days",
    distanceSun: "0 AU",
    tempAvg: "5,500°C (Surface) / 15M°C (Core)",
    moonsCount: 0,
    description: "Yellow dwarf star containing 99.86% of the mass of the Solar System. Powered by nuclear fusion converting 600 million tons of hydrogen per second, its surface features intense magnetic sunspots, solar flares, and coronal mass ejections.",
    atmosphereLayers: [
      { name: "Photosphere & Sunspots", altitude: "0-500 km", desc: "Visible surface harboring sunspots—cool magnetic active regions with dark central Umbras (3,000°C) and reddish-brown Penumbras surrounded by bright Faculae." },
      { name: "Chromosphere & Flares", altitude: "2,000 km", desc: "Rosy-red lower atmosphere where magnetic reconnection triggers solar flares and prominences." },
      { name: "Solar Corona", altitude: "Millions of km", desc: "Outermost superheated plasma aura reaching 2,000,000°C emitting continuous solar wind into the heliosphere." },
    ],
    internalStructure: [
      { layer: "Core", thickness: "175,000 km", desc: "Nuclear fusion engine converting hydrogen to helium under 250 billion atmospheres pressure at 15,000,000°C." },
      { layer: "Radiative Zone", thickness: "350,000 km", desc: "Dense energy transport layer where photons take 100,000 years to bounce outward." },
      { layer: "Convective Zone & Dynamo", thickness: "200,000 km", desc: "Boiling plasma convection currents generating the Sun's powerful 11-year magnetic cycle." },
    ],
    missions: [
      { agency: "NASA", name: "Parker Solar Probe", year: "2018", type: "Corona Touch" },
      { agency: "ESA/NASA", name: "SOHO Observatory", year: "1995", type: "Heliophysics" },
      { agency: "ISRO", name: "Aditya-L1", year: "2023", type: "L1 Halo Orbit" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=800&q=80", caption: "Solar Flare Ejection Captured by SDO" },
    ],
    aiSummary: "The Sun's dark surface spots are Sunspots—cooler magnetic active regions where suppressed plasma convection forms dark Umbra cores (3,000°C) encircled by wispy Penumbra halos and bright Faculae magnetic rings.",
  },
  mercury: {
    id: "mercury",
    slug: "mercury",
    name: "Mercury",
    subtitle: "The Swift Planet",
    category: "Terrestrial",
    color: "#a1a1aa",
    radius: "2,439 km",
    mass: "3.30 × 10²³ kg",
    gravity: "3.7 m/s²",
    orbitalPeriod: "88 days",
    rotationPeriod: "58.6 days",
    distanceSun: "0.39 AU",
    tempAvg: "-180°C to 430°C",
    moonsCount: 0,
    description: "Smallest planet in the solar system and closest to the Sun with an iron-rich metallic core occupying 85% of its radius.",
    atmosphereLayers: [
      { name: "Exosphere", altitude: "Trace", desc: "Thin layer of sodium, potassium, oxygen, and helium atoms knocked off by solar wind." },
    ],
    internalStructure: [
      { layer: "Solid Inner Core", thickness: "1,000 km", desc: "Dense iron-nickel solid core." },
      { layer: "Liquid Outer Core", thickness: "1,000 km", desc: "Molten metallic layer generating weak magnetic field." },
      { layer: "Silicate Crust", thickness: "400 km", desc: "Heavy cratering similar to Earth's Moon." },
    ],
    missions: [
      { agency: "NASA", name: "Mariner 10", year: "1974", type: "Flyby" },
      { agency: "NASA", name: "MESSENGER", year: "2004", type: "Orbiter" },
      { agency: "ESA/JAXA", name: "BepiColombo", year: "2018", type: "Orbiter En Route" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", caption: "Caloris Basin Impact Structure" },
    ],
    aiSummary: "Mercury completes three rotations on its axis for every two orbits around the Sun due to a 3:2 spin-orbit resonance.",
  },
  venus: {
    id: "venus",
    slug: "venus",
    name: "Venus",
    subtitle: "The Morning Star",
    category: "Terrestrial",
    color: "#fde047",
    radius: "6,051 km",
    mass: "4.87 × 10²⁴ kg",
    gravity: "8.87 m/s²",
    orbitalPeriod: "225 days",
    rotationPeriod: "243 days (Retrograde)",
    distanceSun: "0.72 AU",
    tempAvg: "465°C",
    moonsCount: 0,
    description: "Hottest planet in the solar system due to a runaway greenhouse effect from a dense CO2 atmosphere 92 times thicker than Earth's.",
    atmosphereLayers: [
      { name: "Sulfuric Acid Cloud Deck", altitude: "50-70 km", desc: "Opaque yellow clouds reflecting 75% of sunlight." },
      { name: "Dense CO2 Troposphere", altitude: "0-50 km", desc: "Crushing surface pressure of 92 bar." },
    ],
    internalStructure: [
      { layer: "Iron Core", thickness: "3,000 km", desc: "Metallic core similar to Earth." },
      { layer: "Rocky Mantle", thickness: "3,000 km", desc: "Silicate rock with active volcanism." },
    ],
    missions: [
      { agency: "Soviet Union", name: "Venera 13", year: "1981", type: "Lander" },
      { agency: "NASA", name: "Magellan", year: "1989", type: "Radar Mapper" },
      { agency: "ISRO", name: "Shukrayaan-1", year: "2028", type: "Planned Orbiter" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", caption: "Magellan Radar Topography Map" },
    ],
    aiSummary: "Venus rotates backward relative to most planets, meaning the Sun rises in the west and sets in the east.",
  },
  earth: {
    id: "earth",
    slug: "earth",
    name: "Earth",
    subtitle: "The Blue Planet",
    category: "Terrestrial",
    color: "#38bdf8",
    radius: "6,371 km",
    mass: "5.97 × 10²⁴ kg",
    gravity: "9.81 m/s²",
    orbitalPeriod: "365.25 days",
    rotationPeriod: "23.9 hours",
    distanceSun: "1.00 AU",
    tempAvg: "15°C",
    moonsCount: 1,
    description: "Only known planet harboring liquid water oceans, protective magnetosphere, and intelligent carbon-based life.",
    atmosphereLayers: [
      { name: "Troposphere", altitude: "0-12 km", desc: "Houses 75% of atmospheric mass and weather systems." },
      { name: "Stratosphere & Ozone", altitude: "12-50 km", desc: "Shields surface from UV radiation." },
      { name: "Thermosphere & Ionosphere", altitude: "80-700 km", desc: "Site of auroral displays and orbital spacecraft." },
    ],
    internalStructure: [
      { layer: "Solid Inner Core", thickness: "1,220 km", desc: "Crystallized iron-nickel sphere at 5,400°C." },
      { layer: "Liquid Outer Core", thickness: "2,260 km", desc: "Convecting liquid iron generating magnetosphere." },
      { layer: "Mantle", thickness: "2,890 km", desc: "Viscous silicate rock driving plate tectonics." },
    ],
    missions: [
      { agency: "NASA/ESA/ISRO", name: "Earth Observing System", year: "1999", type: "Global Constellation" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", caption: "Blue Marble Orbit Shot" },
    ],
    aiSummary: "Earth's active dynamo in the liquid outer core generates a magnetosphere deflecting harmful cosmic rays.",
  },
  mars: {
    id: "mars",
    slug: "mars",
    name: "Mars",
    subtitle: "The Red Planet",
    category: "Terrestrial",
    color: "#ef4444",
    radius: "3,389 km",
    mass: "6.42 × 10²³ kg",
    gravity: "3.72 m/s²",
    orbitalPeriod: "687 days",
    rotationPeriod: "24.6 hours",
    distanceSun: "1.52 AU",
    tempAvg: "-63°C",
    moonsCount: 2,
    description: "Cold desert world colored red by iron oxide dust on its surface. Prime target for human interplanetary colonization.",
    atmosphereLayers: [
      { name: "CO2 Thin Atmosphere", altitude: "0-100 km", desc: "95% carbon dioxide with surface pressure 0.6% of Earth." },
    ],
    internalStructure: [
      { layer: "Iron-Sulfur Core", thickness: "1,800 km", desc: "Partially liquid metallic core." },
      { layer: "Silicate Mantle", thickness: "1,500 km", desc: "Rigid mantle supporting massive volcanoes." },
    ],
    missions: [
      { agency: "NASA", name: "Perseverance Rover", year: "2020", type: "Sample Collector" },
      { agency: "ISRO", name: "Mars Orbiter Mission (Mangalyaan)", year: "2013", type: "Orbiter" },
      { agency: "SpaceX", name: "Starship Mars Architecture", year: "2028", type: "Cargo & Crew" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", caption: "Jezero Crater Delta Region" },
    ],
    aiSummary: "Mars hosts Olympus Mons, a shield volcano 21.9 km tall—nearly three times the height of Mount Everest.",
  },
  jupiter: {
    id: "jupiter",
    slug: "jupiter",
    name: "Jupiter",
    subtitle: "King of Planets",
    category: "Gas Giant",
    color: "#f97316",
    radius: "69,911 km",
    mass: "1.90 × 10²⁷ kg",
    gravity: "24.79 m/s²",
    orbitalPeriod: "11.86 years",
    rotationPeriod: "9.9 hours",
    distanceSun: "5.20 AU",
    tempAvg: "-110°C",
    moonsCount: 95,
    description: "Massive gas giant containing twice the mass of all other planets combined. Famous for the Great Red Spot anticyclonic storm.",
    atmosphereLayers: [
      { name: "Ammonia Crystal Clouds", altitude: "50 km", desc: "Outer cloud deck forming colorful bands." },
      { name: "Molecular Hydrogen", altitude: "20,000 km", desc: "Dense hydrogen gas transitioning to liquid." },
    ],
    internalStructure: [
      { layer: "Metallic Hydrogen Layer", thickness: "40,000 km", desc: "Liquid hydrogen under 4 million bar pressure acting as liquid metal." },
      { layer: "Diffuse Core", thickness: "10,000 km", desc: "Heavy element icy-rock core." },
    ],
    missions: [
      { agency: "NASA", name: "Juno Orbiter", year: "2011", type: "Polar Orbiter" },
      { agency: "ESA", name: "JUICE", year: "2023", type: "Icy Moons Explorer" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80", caption: "Great Red Spot Close-up" },
    ],
    aiSummary: "Jupiter's magnetic field is 20,000 times stronger than Earth's, creating immense radiation belts.",
  },
  saturn: {
    id: "saturn",
    slug: "saturn",
    name: "Saturn",
    subtitle: "Jewel of the Solar System",
    category: "Gas Giant",
    color: "#eab308",
    radius: "58,232 km",
    mass: "5.68 × 10²⁶ kg",
    gravity: "10.44 m/s²",
    orbitalPeriod: "29.45 years",
    rotationPeriod: "10.7 hours",
    distanceSun: "9.58 AU",
    tempAvg: "-140°C",
    moonsCount: 146,
    description: "Famous for its spectacular ring system composed of billions of ice chunks and rock particles spanning 282,000 km across.",
    atmosphereLayers: [
      { name: "Upper Ammonia Deck", altitude: "100 km", desc: "Pale yellow hazy clouds with hexagonal polar jet stream." },
    ],
    internalStructure: [
      { layer: "Liquid Metallic Hydrogen", thickness: "30,000 km", desc: "Conductive liquid hydrogen layer." },
      { layer: "Rock-Ice Core", thickness: "25,000 km", desc: "Dense core 9-22 times Earth's mass." },
    ],
    missions: [
      { agency: "NASA/ESA", name: "Cassini-Huygens", year: "1997", type: "Orbiter & Titan Probe" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80", caption: "Cassini Ring Plane Mosaic" },
    ],
    aiSummary: "Saturn is the only planet in the solar system whose average density is less than water (0.687 g/cm³).",
  },
  uranus: {
    id: "uranus",
    slug: "uranus",
    name: "Uranus",
    subtitle: "The Tilted Ice Giant",
    category: "Ice Giant",
    color: "#38bdf8",
    radius: "25,362 km",
    mass: "8.68 × 10²⁵ kg",
    gravity: "8.69 m/s²",
    orbitalPeriod: "84 years",
    rotationPeriod: "17.2 hours (Retrograde)",
    distanceSun: "19.2 AU",
    tempAvg: "-195°C",
    moonsCount: 28,
    description: "Ice giant featuring an extreme axial tilt of 97.8 degrees, causing its poles to face the Sun directly during orbital solstices.",
    atmosphereLayers: [
      { name: "Methane Cloud Layer", altitude: "Top Deck", desc: "Methane gas absorbing red light, giving Uranus its cyan color." },
    ],
    internalStructure: [
      { layer: "Mantle Fluid", thickness: "15,000 km", desc: "Hot dense fluid of water, ammonia, and methane ice." },
    ],
    missions: [
      { agency: "NASA", name: "Voyager 2", year: "1986", type: "Flyby" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", caption: "Voyager 2 Cyan Disk Image" },
    ],
    aiSummary: "Uranus has the coldest atmosphere of any solar system planet, dropping as low as -224°C.",
  },
  neptune: {
    id: "neptune",
    slug: "neptune",
    name: "Neptune",
    subtitle: "The Windy Frontier",
    category: "Ice Giant",
    color: "#6366f1",
    radius: "24,622 km",
    mass: "1.02 × 10²⁶ kg",
    gravity: "11.15 m/s²",
    orbitalPeriod: "164.8 years",
    rotationPeriod: "16.1 hours",
    distanceSun: "30.07 AU",
    tempAvg: "-200°C",
    moonsCount: 16,
    description: "Distant azure ice giant boasting the fastest recorded planetary winds in the solar system, exceeding 2,100 km/h.",
    atmosphereLayers: [
      { name: "High-Altitude Cirrus Clouds", altitude: "50 km", desc: "Methane ice crystals floating in deep blue atmosphere." },
    ],
    internalStructure: [
      { layer: "Water-Ammonia Mantle", thickness: "15,000 km", desc: "Electrically conducting superheated fluid." },
    ],
    missions: [
      { agency: "NASA", name: "Voyager 2", year: "1989", type: "Flyby" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80", caption: "Great Dark Spot Voyager Image" },
    ],
    aiSummary: "Neptune's moon Triton orbits in a retrograde direction and has active nitrogen cryovolcanoes.",
  },
};
