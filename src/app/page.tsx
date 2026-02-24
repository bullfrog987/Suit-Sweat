"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SpinDial } from "@/components/workout/SpinDial";
import { ExerciseSetup } from "@/components/workout/ExerciseSetup";
import { WorkoutRunner } from "@/components/workout/WorkoutRunner";
import { generateDeck, calculateTotalTime, Rank, Card as WorkoutCard } from "@/lib/workout-utils";
import { Dumbbell, Timer, Flame, Trophy, Play, Settings2, History } from "lucide-react";

export default function Home() {
  const [view, setView] = useState<"setup" | "active" | "complete">("setup");
  const [numSuits, setNumSuits] = useState(1);
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(15);
  const [roundRestTime, setRoundRestTime] = useState(60);
  const [exerciseMapping, setExerciseMapping] = useState<Record<Rank, string>>({} as any);
  const [activeDeck, setActiveDeck] = useState<WorkoutCard[]>([]);
  const [finalStats, setFinalStats] = useState<{ totalTime: number; calories: number } | null>(null);

  const handleStartWorkout = () => {
    const deck = generateDeck(numSuits, exerciseMapping);
    setActiveDeck(deck);
    setView("active");
  };

  const totalEstimatedTime = calculateTotalTime(
    numSuits * 13,
    workTime,
    restTime,
    roundRestTime,
    numSuits
  );

  if (view === "active") {
    return (
      <div className="min-h-screen bg-background">
        <WorkoutRunner
          deck={activeDeck}
          workTime={workTime}
          restTime={restTime}
          roundRestTime={roundRestTime}
          numSuits={numSuits}
          onComplete={(stats) => {
            setFinalStats(stats);
            setView("complete");
          }}
        />
      </div>
    );
  }

  if (view === "complete") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-12 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <Trophy className="w-24 h-24 text-accent mx-auto" />
          <h1 className="text-5xl font-black uppercase tracking-tighter">Workout Complete</h1>
          <p className="text-muted-foreground text-lg">You crushed that session! Time to recover.</p>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-md">
          <Card className="bg-secondary/40 border-primary/20 p-6 flex flex-col items-center justify-center">
            <Timer className="w-8 h-8 text-primary mb-2" />
            <span className="text-3xl font-bold">{finalStats?.totalTime}m</span>
            <span className="text-xs uppercase font-bold text-muted-foreground">Elapsed Time</span>
          </Card>
          <Card className="bg-secondary/40 border-accent/20 p-6 flex flex-col items-center justify-center">
            <Flame className="w-8 h-8 text-accent mb-2" />
            <span className="text-3xl font-bold">{finalStats?.calories}</span>
            <span className="text-xs uppercase font-bold text-muted-foreground">Calories Est.</span>
          </Card>
        </div>

        <Button 
          size="lg" 
          className="w-full max-w-xs h-14 text-lg font-bold uppercase tracking-widest bg-primary hover:bg-primary/90"
          onClick={() => setView("setup")}
        >
          Back to Setup
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Dumbbell className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Suit & Sweat</h1>
            <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mt-1">Card Game Workout</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <History className="w-6 h-6 text-muted-foreground" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Deck Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-secondary/30 border-border p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold uppercase tracking-wider">Deck Config</h2>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Number of Suits</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <Button
                    key={s}
                    variant={numSuits === s ? "default" : "secondary"}
                    onClick={() => setNumSuits(s)}
                    className="h-12 font-bold text-lg"
                  >
                    {s}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">Total Cards: {numSuits * 13}</p>
            </div>

            <div className="space-y-6 pt-4">
              <SpinDial label="Work Time (sec)" value={workTime} onChange={setWorkTime} />
              <SpinDial label="Rest Time (sec)" value={restTime} onChange={setRestTime} />
              <SpinDial label="Round Rest (sec)" value={roundRestTime} onChange={setRoundRestTime} />
            </div>

            <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 text-center">
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-1">Estimated Duration</p>
              <p className="text-3xl font-black tabular-nums">{Math.ceil(totalEstimatedTime / 60)} min</p>
            </div>
          </Card>
        </div>

        {/* Right Column: Exercise Mapping */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-secondary/30 border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Dumbbell className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold uppercase tracking-wider">Exercise Mapping</h2>
            </div>
            <ExerciseSetup onMappingChange={setExerciseMapping} />
          </Card>
        </div>
      </div>

      {/* Persistent Start Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-50">
        <div className="max-w-4xl mx-auto">
          <Button 
            className="w-full h-16 text-xl font-black uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-transform active:scale-[0.98]"
            onClick={handleStartWorkout}
          >
            <Play className="mr-3 w-6 h-6 fill-current" />
            Start Workout
          </Button>
        </div>
      </div>
    </div>
  );
}
