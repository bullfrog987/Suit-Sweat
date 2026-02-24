"use client"

import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SpinDialProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export function SpinDial({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 300, 
  step = 5,
  unit = "s" 
}: SpinDialProps) {
  const handleIncrement = () => {
    if (value + step <= max) onChange(value + step);
  };

  const handleDecrement = () => {
    if (value - step >= min) onChange(value - step);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
        {label}
      </Label>
      <div className="flex items-center bg-secondary rounded-lg p-1 border border-border shadow-inner">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-10 w-10 text-primary hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center font-bold text-xl tabular-nums">
          {value}{unit}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-10 w-10 text-primary hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
