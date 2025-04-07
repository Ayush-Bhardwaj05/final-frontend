"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { motion } from "framer-motion";

type EmotionType = "happy" | "sad" | "angry" | "neutral" | string;

type EmotionEntry = {
  emotion: EmotionType;
  timestamp: string;
  confidence: number;
};

type Props = {
  emotions: EmotionEntry[];
};

export const EmotionStats = ({ emotions }: Props) => {
  const emotionCounts: Record<EmotionType, number> = {};
  const dailySadAngryCounts: Record<string, number> = {};

  emotions.forEach((entry) => {
    const emotion = entry.emotion;
    const date = new Date(entry.timestamp).toDateString();

    if (!emotionCounts[emotion]) emotionCounts[emotion] = 0;
    emotionCounts[emotion] += 1;

    if ((emotion === "sad" || emotion === "angry") && entry.confidence > 0.8) {
      if (!dailySadAngryCounts[date]) dailySadAngryCounts[date] = 0;
      dailySadAngryCounts[date] += 1;
    }
  });

  const dangerDays = Object.values(dailySadAngryCounts).filter((count) => count >= 3);

  const chartData = Object.keys(emotionCounts).map((emotion) => ({
    emotion,
    count: emotionCounts[emotion]
  }));

  return (
    <motion.div
      className="p-4 rounded-2xl bg-white/5 border border-purple-500/20 backdrop-blur-md shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-bold text-purple-300 mb-2">📊 Weekly Emotion Overview</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="emotion" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: "#1e1e2f", border: "none" }} />
          <Bar dataKey="count" fill="#a78bfa" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {dangerDays.length > 0 ? (
        <div className="mt-4 p-3 bg-red-500/10 text-red-400 rounded-lg border border-red-400/30">
          ⚠️ Emotional stress detected on {dangerDays.length} day(s). Reach out for support.
        </div>
      ) : (
        <div className="mt-4 p-3 bg-green-500/10 text-green-300 rounded-lg border border-green-400/30">
          ✅ All good! No emotional danger zones detected this week.
        </div>
      )}
    </motion.div>
  );
};
