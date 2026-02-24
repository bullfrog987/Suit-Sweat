"use client"

import { useState, useEffect, useCallback } from "react";
import { Card as WorkoutCard, Suit, Rank } from "@/lib/workout-utils";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, CheckCircle2, Heart, Diamond, Club, Spade } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { aiWorkoutCoach } from "@/ai/flows/ai-workout-coach";
import { Card } from "@/components/ui/card";

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
  const [aiMessage, setAiMessage] = useState<string>("");
  const [startTime] = useState(Date.now());

  const currentCard = deck[currentIndex];
  const nextCard = deck[currentIndex + 1];

  const fetchAiCoach = useCallback(async (currentPhase: Phase, exercise?: string) => {
    try {
      const result = await aiWorkoutCoach({
        workoutPhase: currentPhase,
        currentExercise: exercise
      });
      setAiMessage(result.message);
    } catch (e) {
      // Errors handled by global emitter if necessary
    }
  }, []);

  useEffect(() => {
    fetchAiCoach(phase, currentCard?.exerciseName);
  }, [currentIndex, phase, currentCard, fetchAiCoach]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handlePhaseTransition();
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
    const totalMinutes = Math.floor((Date.now() - startTime) / 60000);
    onComplete({
      totalTime: totalMinutes || 1,
      calories: (totalMinutes || 1) * 8,
    });
  };

  const skipPhase = () => {
    handlePhaseTransition();
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
  const progress = (timeLeft / totalTimeForPhase) * 100;

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl mx-auto py-8 min-h-screen px-4">
      {/* AI Motivation */}
      <div className="w-full text-center min-h-[4rem] flex items-center justify-center px-4 animate-in fade-in duration-700">
        <p className="text-accent italic font-medium text-lg md:text-xl leading-relaxed">
          {aiMessage ? `"${aiMessage}"` : "Concentrate. One rep at a time."}
        </p>
      </div>

      {/* Main Card Display */}
      <Card className="w-full aspect-[2/3] max-w-[380px] card-gradient border-none shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-8 text-white">
        {phase === "work" ? (
          <>
            <div className="absolute top-8 left-8 flex flex-col items-center gap-1">
              <span className="text-4xl font-black">{currentCard.rank}</span>
              {getSuitIcon(currentCard.suit)}
            </div>
            <div className="text-center px-4">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight uppercase drop-shadow-2xl">
                {currentCard.exerciseName || "Active"}
              </h2>
            </div>
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-1 rotate-180">
              <span className="text-4xl font-black">{currentCard.rank}</span>
              {getSuitIcon(currentCard.suit)}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-8">
            <h2 className="text-8xl font-black tracking-widest text-white/90 drop-shadow-2xl">
              REST
            </h2>
            {nextCard && (
              <div className="bg-black/20 p-6 rounded-2xl backdrop-blur-sm border border-white/10 text-center animate-in zoom-in duration-500">
                <p className="text-xs uppercase tracking-widest font-bold text-white/70 mb-2">Coming Up Next</p>
                <p className="text-3xl font-black uppercase tracking-tight">{nextCard.exerciseName}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Timer & Controls */}
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="text-8xl font-black tabular-nums tracking-tighter text-primary drop-shadow-xl">
            {timeLeft}s
          </div>
          <div className="px-8">
            <Progress value={progress} className="h-4 bg-secondary" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <Button
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-primary/20 bg-secondary hover:bg-secondary/80 text-primary"
            onClick={skipPhase}
          >
            <SkipForward className="h-8 w-8" />
          </Button>

          <Button
            size="lg"
            className="h-24 w-24 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-transform active:scale-95"
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause className="h-12 w-12 fill-current" /> : <Play className="h-12 w-12 fill-current ml-1" />}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-primary/20 bg-secondary hover:bg-secondary/80 text-primary"
            onClick={finishWorkout}
          >
            <CheckCircle2 className="h-8 w-8" />
          </Button>
        </div>

        <div className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest pt-4 opacity-70">
          Card {currentIndex + 1} of {deck.length}
        </div>
      </div>
    </div>
  );
}
