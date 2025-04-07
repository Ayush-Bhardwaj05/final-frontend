"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import emotionData from "../data/emotions.json";

type EmotionType = "happy" | "sad" | "angry" | "neutral";

type EmotionEntry = {
  timestamp: string;
  emotion: EmotionType;
  confidence: number;
};

type SummaryType = Record<EmotionType, number>;

const EmotionSummary = () => {
  const [summary, setSummary] = useState<SummaryType>({
    happy: 0,
    sad: 0,
    angry: 0,
    neutral: 0
  });
  const [danger, setDanger] = useState(false);

  useEffect(() => {
    const counts: SummaryType = {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 0
    };

    (emotionData as EmotionEntry[]).forEach((entry) => {
      if (counts[entry.emotion] !== undefined) {
        counts[entry.emotion]++;
      }
    });

    const dangerZone = counts.sad + counts.angry >= 4;
    setSummary(counts);
    setDanger(dangerZone);
  }, []);

  return (
    <motion.div
      className="mt-8 p-6 rounded-2xl bg-white/5 border border-purple-500/20 backdrop-blur-md shadow-lg text-white max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold text-purple-300 mb-4">📊 Emotion Summary (This Week)</h3>
      <ul className="space-y-2 text-zinc-300">
        <li>😃 Happy: {summary.happy}</li>
        <li>😢 Sad: {summary.sad}</li>
        <li>😠 Angry: {summary.angry}</li>
        <li>😐 Neutral: {summary.neutral}</li>
      </ul>
      <div className="mt-4 text-lg font-bold">
        {danger ? (
          <span className="text-red-400">🔴 Danger Zone: Yes</span>
        ) : (
          <span className="text-green-400">🟢 Danger Zone: No</span>
        )}
      </div>
    </motion.div>
  );
};

export default EmotionSummary;
