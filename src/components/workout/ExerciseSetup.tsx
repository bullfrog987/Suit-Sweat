"use client"

import { useState } from "react";
import { Rank, RANKS } from "@/lib/workout-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const DEFAULT_EXERCISES = [
  "Pushups", "Squats", "Lunges", "Plank (sec)", "Burpees", 
  "Mountain Climbers", "Situps", "Jumping Jacks", "High Knees", 
  "Dips", "Diamond Pushups", "Russian Twists", "Leg Raises"
];

interface ExerciseSetupProps {
  onMappingChange: (mapping: Record<Rank, string>) => void;
}

export function ExerciseSetup({ onMappingChange }: ExerciseSetupProps) {
  const [mapping, setMapping] = useState<Record<Rank, string>>(
    RANKS.reduce((acc, rank, idx) => {
      acc[rank] = DEFAULT_EXERCISES[idx] || "";
      return acc;
    }, {} as Record<Rank, string>)
  );

  const handleExerciseChange = (rank: Rank, name: string) => {
    const newMapping = { ...mapping, [rank]: name };
    setMapping(newMapping);
    onMappingChange(newMapping);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RANKS.map((rank) => (
          <div key={rank} className="flex items-center gap-3 bg-secondary/50 p-3 rounded-xl border border-border">
            <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-lg font-bold text-lg">
              {rank}
            </div>
            <div className="flex-1">
              <Input
                value={mapping[rank]}
                onChange={(e) => handleExerciseChange(rank, e.target.value)}
                placeholder={`Exercise for ${rank}...`}
                className="bg-background border-none h-10"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
