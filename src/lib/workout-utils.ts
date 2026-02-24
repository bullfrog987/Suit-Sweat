
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  exerciseName: string;
}

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J' | 'Q' | 'K'];
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export const DEFAULT_EXERCISES = [
  "Pushups", "Squats", "Lunges", "Plank (sec)", "Burpees", 
  "Mountain Climbers", "Situps", "Jumping Jacks", "High Knees", 
  "Dips", "Diamond Pushups", "Russian Twists", "Leg Raises"
];

export const DEFAULT_RANK_MAPPING: Record<Rank, string> = {
  'A': "Pushups",
  '2': "Squats",
  '3': "Lunges",
  '4': "Plank (sec)",
  '5': "Burpees",
  '6': "Mountain Climbers",
  '7': "Situps",
  '8': "Jumping Jacks",
  '9': "High Knees",
  '10': "Dips",
  'J': "Diamond Pushups",
  'Q': "Russian Twists",
  'K': "Leg Raises"
};

export function generateDeck(numSuits: number, rankToExercise: Record<Rank, string>): Card[] {
  const deck: Card[] = [];
  const activeSuits = SUITS.slice(0, numSuits);
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  for (const suit of activeSuits) {
    for (const rank of ranks) {
      const name = rankToExercise[rank]?.trim() || DEFAULT_RANK_MAPPING[rank];
      deck.push({
        suit,
        rank,
        exerciseName: name,
      });
    }
  }

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export function calculateTotalTime(
  numCards: number,
  workTime: number,
  restTime: number,
  roundRestTime: number,
  numSuits: number
): number {
  if (numCards === 0) return 0;

  // Number of work phases
  const totalWork = numCards * workTime;
  
  // Transitions between cards
  const totalTransitions = numCards - 1;
  
  // Number of round rests (at the end of each suit except the last)
  const numRoundRests = numSuits > 1 ? numSuits - 1 : 0;
  
  // Number of normal rests
  const numNormalRests = totalTransitions - numRoundRests;
  
  const totalRest = (numNormalRests * restTime) + (numRoundRests * roundRestTime);
  
  return totalWork + totalRest;
}
