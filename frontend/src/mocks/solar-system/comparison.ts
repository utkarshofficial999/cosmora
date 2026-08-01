export interface ComparisonPair {
  id: string;
  bodyA: string;
  bodyB: string;
  metrics: {
    radiusRatio: string;
    massRatio: string;
    gravityRatio: string;
    tempDelta: string;
    orbitSpeedRatio: string;
    habitabilityScoreA: number;
    habitabilityScoreB: number;
  };
  summary: string;
}

export const MOCK_COMPARISONS: Record<string, ComparisonPair> = {
  "earth-vs-mars": {
    id: "earth-vs-mars",
    bodyA: "Earth",
    bodyB: "Mars",
    metrics: {
      radiusRatio: "1.88x (Earth Larger)",
      massRatio: "9.30x (Earth Heavier)",
      gravityRatio: "2.64x (Earth Stronger)",
      tempDelta: "78°C Warmer on Earth",
      orbitSpeedRatio: "1.23x (Earth Faster)",
      habitabilityScoreA: 98,
      habitabilityScoreB: 35,
    },
    summary:
      "Earth is nearly twice the size of Mars with 9.3 times more mass, retaining a dense atmosphere and liquid water oceans, whereas Mars is a cold desert world with 38% Earth gravity.",
  },
  "jupiter-vs-saturn": {
    id: "jupiter-vs-saturn",
    bodyA: "Jupiter",
    bodyB: "Saturn",
    metrics: {
      radiusRatio: "1.20x (Jupiter Larger)",
      massRatio: "3.34x (Jupiter Heavier)",
      gravityRatio: "2.37x (Jupiter Stronger)",
      tempDelta: "30°C Warmer on Jupiter",
      orbitSpeedRatio: "1.37x (Jupiter Faster)",
      habitabilityScoreA: 5,
      habitabilityScoreB: 5,
    },
    summary:
      "Jupiter is 3.3 times more massive than Saturn, but Saturn possesses a vast, dazzling ring system spanning 282,000 km.",
  },
  "moon-vs-europa": {
    id: "moon-vs-europa",
    bodyA: "The Moon",
    bodyB: "Europa",
    metrics: {
      radiusRatio: "1.11x (Moon Larger)",
      massRatio: "1.53x (Moon Heavier)",
      gravityRatio: "1.24x (Moon Stronger)",
      tempDelta: "30°C Colder on Europa",
      orbitSpeedRatio: "0.19x (Europa Faster Orbit)",
      habitabilityScoreA: 10,
      habitabilityScoreB: 75,
    },
    summary:
      "While Earth's Moon is a dry, cratered world, Europa shelters a global liquid ocean containing 2-3x Earth's water under a 20 km ice shell.",
  },
};
