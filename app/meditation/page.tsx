"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function BreathingExercisePage() {
  const [phase, setPhase] = useState("Breathe In");
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!isRunning) return;

    function cyclePhases() {
      setPhase("Breathe In");
      const holdTimeout = setTimeout(() => setPhase("Hold"), 3000);
      const exhaleTimeout = setTimeout(() => setPhase("Breathe Out"), 7000);
      timeoutRefs.current.push(holdTimeout, exhaleTimeout);
    }

    cyclePhases();
    intervalRef.current = setInterval(cyclePhases, 14000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      timeoutRefs.current.forEach((t) => clearTimeout(t));
      timeoutRefs.current = [];
    };
  }, [isRunning]);

  const handleStop = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRefs.current.forEach((t) => clearTimeout(t));
  };

  const handleStart = () => {
    setPhase("Breathe In");
    setIsRunning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33] py-24 flex flex-col items-center">
      <div className="container mx-auto px-4 text-center mb-10">
        <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
          Breathing Exercise{" "}
          <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
            Relax
          </span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-slate-300">
          Follow the rhythm of your breath and let your mind settle.
        </p>
      </div>

      {isRunning ? (
        <div className="flex flex-col items-center">
          {/* Breathing graph container */}
          <div className="relative w-20 h-80 bg-black/40 border border-purple-500/20 rounded-full overflow-hidden">
            <motion.div
              key={phase}
              className="absolute bottom-0 w-full h-full bg-gradient-to-t from-purple-500 to-purple-300"
              style={{ transformOrigin: "bottom" }}
              initial={{ scaleY: phase === "Breathe In" ? 0.2 : 1 }}
              animate={{
                scaleY:
                  phase === "Breathe In" ? 1 :
                  phase === "Hold" ? 1 :
                  phase === "Breathe Out" ? 0.2 : 0.2,
              }}
              transition={{
                duration:
                  phase === "Breathe In" ? 3 :
                  phase === "Hold" ? 4 :
                  phase === "Breathe Out" ? 7 : 0,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Display the current phase */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-white">{phase}</h2>
          </div>

          {/* Stop button */}
          <div className="mt-8">
            <Button
              onClick={handleStop}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Stop Exercise
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Exercise Ended. Feel the calm!
          </h2>
          <div className="mt-8">
            <Button
              onClick={handleStart}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Start Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
