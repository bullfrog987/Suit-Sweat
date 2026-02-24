"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpinDial } from "@/components/workout/SpinDial";
import { ExerciseSetup } from "@/components/workout/ExerciseSetup";
import { WorkoutRunner } from "@/components/workout/WorkoutRunner";
import { generateDeck, calculateTotalTime, Rank, Card as WorkoutCard, DEFAULT_RANK_MAPPING } from "@/lib/workout-utils";
import { Dumbbell, Timer, Flame, Trophy, Play, Settings2, History, LayoutGrid } from "lucide-react";

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

      <Tabs defaultValue="deck" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-secondary/50 p-1 mb-8">
          <TabsTrigger value="deck" className="data-[state=active]:bg-primary data-[state=active]:text-white h-full font-bold uppercase tracking-widest">
            <Settings2 className="w-4 h-4 mr-2" />
            Deck Config
          </TabsTrigger>
          <TabsTrigger value="exercises" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground h-full font-bold uppercase tracking-widest">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Exercise Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deck" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-secondary/30 border-border p-6 space-y-8">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Number of Suits</label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((s) => (
                    <Button
                      key={s}
                      variant={numSuits === s ? "default" : "secondary"}
                      onClick={() => setNumSuits(s)}
                      className="h-16 font-black text-2xl"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">Your workout will consist of {numSuits * 13} cards.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <SpinDial label="Work Time" value={workTime} onChange={setWorkTime} />
                <SpinDial label="Rest Time" value={restTime} onChange={setRestTime} />
                <SpinDial label="Round Rest" value={roundRestTime} onChange={setRoundRestTime} />
                <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20 flex flex-col justify-center text-center">
                  <p className="text-xs uppercase tracking-widest font-bold text-primary mb-1">Estimated Time</p>
                  <p className="text-4xl font-black tabular-nums">{Math.ceil(totalEstimatedTime / 60)}:00</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="bg-secondary/20 border-border p-6 h-full flex flex-col items-center justify-center text-center">
                <Timer className="w-12 h-12 text-primary/40 mb-4" />
                <h3 className="font-bold uppercase tracking-wider mb-2">Ready to Sweat?</h3>
                <p className="text-sm text-muted-foreground">Adjust your timers and suits to customize the intensity of your session.</p>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="bg-secondary/30 border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Dumbbell className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold uppercase tracking-wider">Map Cards to Moves</h2>
            </div>
            <ExerciseSetup 
              initialMapping={exerciseMapping}
              onMappingChange={setExerciseMapping} 
            />
          </Card>
        </TabsContent>
      </Tabs>

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
