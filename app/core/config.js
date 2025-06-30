// Default configuration (used by main app)
export const DEFAULT_SCORING_PARAMS = {
  BASE_POINT: 2,
  DECAY_PER_DAY: 0.002,
  MIN_POINT: 1,
  LOW_SCORE_THRESHOLD: 50,
  LOW_SCORE_PENALTY: 0.1,
  HIGH_SCORE_PENALTY: 5,
};

// Experimental configurations
export const EXPERIMENTAL_CONFIGS = {
  aggressive: {
    ...DEFAULT_SCORING_PARAMS,
    DECAY_PER_DAY: 0.01,
    HIGH_SCORE_PENALTY: 10,
    LOW_SCORE_PENALTY: 0.2,
  },

  lenient: {
    ...DEFAULT_SCORING_PARAMS,
    DECAY_PER_DAY: 0.001,
    HIGH_SCORE_PENALTY: 2,
    LOW_SCORE_PENALTY: 0.05,
  },

  highReward: {
    ...DEFAULT_SCORING_PARAMS,
    BASE_POINT: 3,
    WEEKLY_BONUS_MULTIPLIER: 0.5,
  },
};
