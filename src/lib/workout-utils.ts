
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  exerciseName: string;
}

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export const DEFAULT_EXERCISES = [
  "Pushups", "Squats", "Lunges", "Plank (sec)", "Burpees", 
  "Mountain Climbers", "Situps", "Jumping Jacks", "High Knees", 
  "Dips", "Diamond Pushups", "Russian Twists", "Leg Raises"
];

export const DEFAULT_RANK_MAPPING: Record<Rank, string> = RANKS.reduce((acc, rank, idx) => {
  acc[rank] = DEFAULT_EXERCISES[idx] || "Active";
  return acc;
}, {} as Record<Rank, string>);

export function generateDeck(numSuits: number, rankToExercise: Record<Rank, string>): Card[] {
  const deck: Card[] = [];
  const activeSuits = SUITS.slice(0, numSuits);

  for (const suit of activeSuits) {
    for (const rank of RANKS) {
      // Use the provided mapping, but trim it and fallback to default if it's blank
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
  const totalWork = numCards * workTime;
  const totalBetweenRest = (numCards - 1) * restTime;
  const totalRoundRest = numSuits > 1 ? (numSuits - 1) * roundRestTime : 0;
  
  return totalWork + totalBetweenRest + totalRoundRest;
}
