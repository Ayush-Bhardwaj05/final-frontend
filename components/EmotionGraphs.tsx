"use client";
import emotionData from "../data/emotions.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

type EmotionType = "happy" | "sad" | "angry" | "neutral";

type EmotionEntry = {
  timestamp: string;
  emotion: EmotionType;
};

type LineChartData = {
  date: string;
  happy: number;
  sad: number;
  angry: number;
  neutral: number;
};

const COLORS = ["#4ade80", "#f87171", "#facc15", "#a1a1aa"];

const EmotionGraphs = () => {
  const lineDataMap: Record<string, LineChartData> = {};

  (emotionData as EmotionEntry[]).forEach((entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString("en-IN");
    if (!lineDataMap[date]) {
      lineDataMap[date] = { date, happy: 0, sad: 0, angry: 0, neutral: 0 };
    }
    lineDataMap[date][entry.emotion]++;
  });

  const lineData = Object.values(lineDataMap);

  const emotionCount: Record<EmotionType, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    neutral: 0,
  };

  (emotionData as EmotionEntry[]).forEach((e) => {
    emotionCount[e.emotion]++;
  });

  const pieData = Object.keys(emotionCount).map((key) => ({
    name: key,
    value: emotionCount[key as EmotionType],
  }));

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full h-80 bg-white/5 border border-purple-500/20 backdrop-blur-md rounded-2xl p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-purple-300">📈 Weekly Emotion Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: "#1e1e2f", border: "none" }} />
            <Legend />
            <Line type="monotone" dataKey="happy" stroke="#4ade80" strokeWidth={2} />
            <Line type="monotone" dataKey="sad" stroke="#f87171" strokeWidth={2} />
            <Line type="monotone" dataKey="angry" stroke="#facc15" strokeWidth={2} />
            <Line type="monotone" dataKey="neutral" stroke="#a1a1aa" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-80 bg-white/5 border border-purple-500/20 backdrop-blur-md rounded-2xl p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-purple-300">📊 Emotion Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default EmotionGraphs;
