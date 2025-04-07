"use client";
import emotions from "../data/emotions.json";
import { motion } from "framer-motion";

type EmotionType = "happy" | "sad" | "angry" | "neutral" | "anxious" | "calm";

type EmotionEntry = {
  timestamp: string;
  emotion: EmotionType;
  confidence: number;
};

type HeatMapProps = {
  emotions: EmotionEntry[];
};

const getDayName = (date: Date): string =>
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];

const getTimeSlot = (date: Date): string => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};

const emotionColors: Record<EmotionType, string> = {
  happy: "#ffe066",
  sad: "#74c0fc",
  angry: "#ff6b6b",
  neutral: "#ced4da",
  anxious: "#b197fc",
  calm: "#8ce99a",
};

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeslots = ["Morning", "Afternoon", "Evening", "Night"];

const HeatMap = ({ emotions }: HeatMapProps) => {
  const emotionMap: Record<string, Record<string, EmotionType>> = {};

  emotions.forEach((entry) => {
    const date = new Date(entry.timestamp);
    const day = getDayName(date);
    const timeSlot = getTimeSlot(date);
    const emotion = entry.emotion;
    if (!emotionMap[day]) emotionMap[day] = {};
    emotionMap[day][timeSlot] = emotion;
  });

  return (
    <motion.div
      className="p-6 rounded-2xl bg-white/5 border border-purple-500/20 backdrop-blur-md shadow-lg text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold text-purple-300 mb-6">🗓️ Weekly Emotion Heatmap</h2>
      <div className="grid" style={{ display: "grid", gridTemplateColumns: "120px repeat(7, 1fr)", gap: "2px" }}>
        <div></div>
        {weekdays.map((day) => (
          <div key={day} className="text-center font-medium text-zinc-300">{day}</div>
        ))}

        {timeslots.map((slot) => (
          <>
            <div key={slot} className="font-medium text-zinc-300">{slot}</div>
            {weekdays.map((day) => {
              const emotion = emotionMap[day]?.[slot];
              const bg = emotion ? emotionColors[emotion] : "#2a2a2a";
              const fg = emotion ? "#000" : "#777";
              return (
                <div
                  key={`${day}-${slot}`}
                  style={{
                    backgroundColor: bg,
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontWeight: 600,
                    color: fg,
                    borderRadius: "8px"
                  }}
                >
                  {emotion || ""}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </motion.div>
  );
};

export default HeatMap;
