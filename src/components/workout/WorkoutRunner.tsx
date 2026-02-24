
"use client"

import { useState, useEffect, useMemo } from "react";
import { Card as WorkoutCard, Suit, calculateTotalTime } from "@/lib/workout-utils";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, CheckCircle2, Heart, Diamond, Club, Spade, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WorkoutRunnerProps {
  deck: WorkoutCard[];
  workTime: number;
  restTime: number;
  roundRestTime: number;
  numSuits: number;
  onComplete: (stats: { totalTime: number; calories: number }) => void;
}

type Phase = "work" | "rest" | "round-rest";

export function WorkoutRunner({ 
  deck, 
  workTime, 
  restTime, 
  roundRestTime, 
  numSuits,
  onComplete 
}: WorkoutRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  
  // Calculate the absolute initial duration for progress tracking
  const initialTotalDuration = useMemo(() => 
    calculateTotalTime(deck.length, workTime, restTime, roundRestTime, numSuits),
    [deck.length, workTime, restTime, roundRestTime, numSuits]
  );

  // Track the total remaining time
  const [totalRemaining, setTotalRemaining] = useState(initialTotalDuration);
  
  // Track total elapsed for calorie calculation at end
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentCard = deck[currentIndex];
  const nextCard = deck[currentIndex + 1];

  // Main Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        
        // Decrement phase timer
        if (timeLeft > 0) {
          setTimeLeft((prev) => prev - 1);
        } else {
          handlePhaseTransition();
        }

        // Decrement total remaining timer
        setTotalRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handlePhaseTransition = () => {
    if (phase === "work") {
      const isEndOfSuit = (currentIndex + 1) % 13 === 0 && currentIndex !== deck.length - 1;
      
      if (isEndOfSuit && roundRestTime > 0) {
        setPhase("round-rest");
        setTimeLeft(roundRestTime);
      } else if (currentIndex < deck.length - 1) {
        setPhase("rest");
        setTimeLeft(restTime);
      } else {
        finishWorkout();
      }
    } else {
      setPhase("work");
      setTimeLeft(workTime);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const finishWorkout = () => {
    setIsActive(false);
    const totalMinutes = Math.ceil(elapsedSeconds / 60);
    onComplete({
      totalTime: totalMinutes || 1,
      calories: (totalMinutes || 1) * 8,
    });
  };

  const skipPhase = () => {
    // Subtract the remaining time of the CURRENT phase from totalRemaining
    setTotalRemaining((prev) => Math.max(0, prev - timeLeft));
    handlePhaseTransition();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSuitIcon = (suit: Suit) => {
    switch (suit) {
      case 'hearts': return <Heart className="w-10 h-10 text-red-500 fill-current" />;
      case 'diamonds': return <Diamond className="w-10 h-10 text-red-400 fill-current" />;
      case 'clubs': return <Club className="w-10 h-10 text-white fill-current" />;
      case 'spades': return <Spade className="w-10 h-10 text-white fill-current" />;
    }
  };

  const totalTimeForPhase = phase === "work" ? workTime : (phase === "round-rest" ? roundRestTime : restTime);
  
  // Phase progress: fills from 0 to 100 as time passes
  const phaseProgress = totalTimeForPhase > 0 
    ? ((totalTimeForPhase - timeLeft) / totalTimeForPhase) * 100 
    : 100;

  // Total workout progress: fills from 0 to 100 based on remaining time
  const totalWorkoutProgress = initialTotalDuration > 0
    ? ((initialTotalDuration - totalRemaining) / initialTotalDuration) * 100
    : 100;

  return (
    <div className="flex flex-col items-center justify-between gap-4 w-full max-w-2xl mx-auto py-4 min-h-screen px-4 overflow-hidden">
      {/* Top Persistent Total Progress */}
      <div className="w-full space-y-2">
        <Progress value={totalWorkoutProgress} className="h-2 bg-secondary/50 rounded-full overflow-hidden" />
        <div className="w-full flex justify-between items-center px-4 py-2 bg-secondary/30 rounded-2xl border border-border/50 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Workout Remaining</span>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              <span className="text-base font-black tabular-nums">{formatTime(totalRemaining)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Card</span>
            <span className="text-base font-black">{currentIndex + 1} <span className="text-muted-foreground font-medium">/ {deck.length}</span></span>
          </div>
        </div>
      </div>

      {/* Main Card Display */}
      <Card 
        className={cn(
          "w-full aspect-[2/3] max-w-[340px] border-none shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-8 text-white transition-all duration-700",
          phase === "work" ? "card-gradient" : "bg-gradient-to-br from-indigo-900 to-purple-950"
        )}
      >
        {phase === "work" ? (
          <>
            <div className="absolute top-6 left-6 flex flex-col items-center gap-1">
              <span className="text-3xl font-black">{currentCard.rank}</span>
              {getSuitIcon(currentCard.suit)}
            </div>
            <div className="text-center px-4 space-y-4">
              <div className="w-full flex justify-center opacity-20">
                 {getSuitIcon(currentCard.suit)}
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase drop-shadow-2xl leading-none">
                {currentCard.exerciseName || "Active"}
              </h2>
            </div>
            <div className="absolute bottom-6 right-6 flex flex-col items-center gap-1 rotate-180">
              <span className="text-3xl font-black">{currentCard.rank}</span>
              {getSuitIcon(currentCard.suit)}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
            <h2 className="text-6xl font-black tracking-widest text-white/90 drop-shadow-2xl">
              {phase === "round-rest" ? "BREAK" : "REST"}
            </h2>
            {nextCard && (
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/70 mb-2">Next Up</p>
                <p className="text-2xl font-black uppercase tracking-tight">{nextCard.exerciseName}</p>
                <p className="text-xs font-bold text-accent mt-1">{nextCard.rank} of {nextCard.suit}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Phase Timer & Controls */}
      <div className="w-full max-w-md space-y-6 pb-6">
        <div className="text-center space-y-4">
          <div className={cn(
            "text-8xl font-black tabular-nums tracking-tighter transition-colors duration-300",
            phase === "work" ? "text-primary" : "text-accent"
          )}>
            {timeLeft}s
          </div>
          <div className="px-6">
            <Progress value={phaseProgress} className="h-4 bg-secondary shadow-inner" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14 rounded-full border-2 border-primary/10 bg-secondary/50 hover:bg-secondary text-primary"
            onClick={skipPhase}
          >
            <SkipForward className="h-6 w-6" />
          </Button>

          <Button
            size="lg"
            className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-transform active:scale-95"
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14 rounded-full border-2 border-primary/10 bg-secondary/50 hover:bg-secondary text-primary"
            onClick={finishWorkout}
          >
            <CheckCircle2 className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
