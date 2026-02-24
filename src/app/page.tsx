
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpinDial } from "@/components/workout/SpinDial";
import { ExerciseSetup } from "@/components/workout/ExerciseSetup";
import { WorkoutRunner } from "@/components/workout/WorkoutRunner";
import { generateDeck, calculateTotalTime, Rank, Card as WorkoutCard, DEFAULT_RANK_MAPPING } from "@/lib/workout-utils";
import { Dumbbell, Timer, Flame, Trophy, Play, Settings2, History, LayoutGrid, Info } from "lucide-react";

export default function Home() {
  const [view, setView] = useState<"setup" | "active" | "complete">("setup");
  const [numSuits, setNumSuits] = useState(1);
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(15);
  const [roundRestTime, setRoundRestTime] = useState(60);
  const [exerciseMapping, setExerciseMapping] = useState<Record<Rank, string>>(DEFAULT_RANK_MAPPING);
  const [activeDeck, setActiveDeck] = useState<WorkoutCard[]>([]);
  const [finalStats, setFinalStats] = useState<{ totalTime: number; calories: number } | null>(null);

  const handleStartWorkout = () => {
    const deck = generateDeck(numSuits, exerciseMapping);
    setActiveDeck(deck);
    setView("active");
  };

  const totalSeconds = calculateTotalTime(
    numSuits * 13,
    workTime,
    restTime,
    roundRestTime,
    numSuits
  );

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <Trophy className="w-20 h-20 text-accent mx-auto" />
          <h1 className="text-4xl font-black uppercase tracking-tighter">Workout Complete</h1>
          <p className="text-muted-foreground text-base">You crushed that session! Time to recover.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <Card className="bg-secondary/40 border-primary/20 p-5 flex flex-col items-center justify-center">
            <Timer className="w-6 h-6 text-primary mb-2" />
            <span className="text-2xl font-bold">{finalStats?.totalTime}m</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Time Spent</span>
          </Card>
          <Card className="bg-secondary/40 border-accent/20 p-5 flex flex-col items-center justify-center">
            <Flame className="w-6 h-6 text-accent mb-2" />
            <span className="text-2xl font-bold">{finalStats?.calories}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Calories</span>
          </Card>
        </div>

        <Button 
          size="lg" 
          className="w-full max-w-xs h-14 text-base font-bold uppercase tracking-widest bg-primary hover:bg-primary/90"
          onClick={() => setView("setup")}
        >
          Back to Setup
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6 pb-40 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Dumbbell className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Suit & Sweat</h1>
              <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5">Card Game Workout</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <History className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        <Tabs defaultValue="deck" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-16 bg-secondary/50 p-1 mb-6 rounded-2xl">
            <TabsTrigger value="deck" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl h-full font-black uppercase tracking-widest text-[10px] flex flex-col items-center justify-center gap-1 transition-all duration-300">
              <Settings2 className="w-4 h-4" />
              Deck Config
            </TabsTrigger>
            <TabsTrigger value="exercises" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-xl h-full font-black uppercase tracking-widest text-[10px] flex flex-col items-center justify-center gap-1 transition-all duration-300">
              <LayoutGrid className="w-4 h-4" />
              Exercise Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deck" className="animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:outline-none">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-secondary/30 border-border p-6 space-y-8 rounded-3xl">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Number of Suits</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((s) => (
                      <Button
                        key={s}
                        variant={numSuits === s ? "default" : "secondary"}
                        onClick={() => setNumSuits(s)}
                        className="h-14 font-black text-xl rounded-xl transition-all"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">Workout: {numSuits * 13} rounds.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <SpinDial label="Work Time" value={workTime} onChange={setWorkTime} />
                  <SpinDial label="Rest Time" value={restTime} onChange={setRestTime} />
                  <div className="space-y-2">
                    <SpinDial 
                      label="Round Rest" 
                      value={roundRestTime} 
                      onChange={setRoundRestTime} 
                      min={0}
                    />
                    {numSuits === 1 && (
                      <div className="flex items-start gap-2 px-1 text-[9px] text-muted-foreground italic uppercase tracking-wider">
                        <Info className="w-3 h-3 text-accent flex-shrink-0" />
                        <span>Only applies between suits (2+ suits)</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-primary/10 p-5 rounded-2xl border border-primary/20 flex flex-col justify-center text-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">Total Time</p>
                    <p className="text-3xl font-black tabular-nums">{formatTotalTime(totalSeconds)}</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:outline-none">
            <Card className="bg-secondary/30 border-border p-5 rounded-3xl">
              <div className="flex items-center gap-2 mb-6">
                <Dumbbell className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-bold uppercase tracking-widest">Exercise Map</h2>
              </div>
              <ExerciseSetup 
                initialMapping={exerciseMapping}
                onMappingChange={setExerciseMapping} 
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Persistent Start Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border z-50">
        <div className="max-w-4xl mx-auto">
          <Button 
            className="w-full h-16 text-lg font-black uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-transform active:scale-[0.98] rounded-2xl"
            onClick={handleStartWorkout}
          >
            <Play className="mr-3 w-5 h-5 fill-current" />
            Go
          </Button>
        </div>
      </div>
    </div>
  );
}
