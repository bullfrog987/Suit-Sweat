export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  exerciseName: string;
}

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export function generateDeck(numSuits: number, rankToExercise: Record<Rank, string>): Card[] {
  const deck: Card[] = [];
  const activeSuits = SUITS.slice(0, numSuits);

  for (const suit of activeSuits) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        exerciseName: rankToExercise[rank],
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
  // Round rest occurs between suits (if more than 1 suit).
  // e.g. if 4 suits, we have 3 round rests.
  const totalRoundRest = numSuits > 1 ? (numSuits - 1) * roundRestTime : 0;
  
  return totalWork + totalBetweenRest + totalRoundRest;
}
