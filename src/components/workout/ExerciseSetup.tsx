"use client"

import { useState } from "react";
import { Rank, RANKS } from "@/lib/workout-utils";
import { Input } from "@/components/ui/input";

interface ExerciseSetupProps {
  initialMapping: Record<Rank, string>;
  onMappingChange: (mapping: Record<Rank, string>) => void;
}

export function ExerciseSetup({ initialMapping, onMappingChange }: ExerciseSetupProps) {
  const [mapping, setMapping] = useState<Record<Rank, string>>(initialMapping);

  const handleExerciseChange = (rank: Rank, name: string) => {
    const newMapping = { ...mapping, [rank]: name };
    setMapping(newMapping);
    onMappingChange(newMapping);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RANKS.map((rank) => (
          <div key={rank} className="flex items-center gap-3 bg-secondary/50 p-3 rounded-xl border border-border group focus-within:border-primary/50 transition-colors">
            <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-lg font-bold text-lg shadow-sm">
              {rank}
            </div>
            <div className="flex-1">
              <Input
                value={mapping[rank]}
                onChange={(e) => handleExerciseChange(rank, e.target.value)}
                placeholder={`Exercise for ${rank}...`}
                className="bg-transparent border-none h-10 focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
