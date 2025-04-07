// "use client";
// import HeatMap from "./HeatMap";
// import { EmotionStats } from "./EmotionStats";
// import emotions from "../data/emotions.json";
// import EmotionSummary from "./EmotionSummary";
// import EmotionGraphs from "./EmotionGraphs";
// import CalendarView from "./CalendarView";

// type Emotion = {
//   timestamp: string;
//   emotion: "happy" | "sad" | "angry" | "neutral";
//   confidence: number;
// };

// const Dashboard = () => {
//   const typedEmotions: Emotion[] = emotions
//     .filter((e) => ["happy", "sad", "angry", "neutral"].includes(e.emotion))
//     .map((e) => ({
//       timestamp: e.timestamp,
//       emotion: e.emotion as "happy" | "sad" | "angry" | "neutral",
//       confidence: e.confidence,
//     }));

//   return (
//     <div className="p-4 space-y-4">
//       <h1 className="text-2xl font-bold mb-4">Emotional Heatmap Dashboard</h1>
//       <HeatMap emotions={typedEmotions} />
//       <EmotionStats emotions={typedEmotions} />
//       <EmotionSummary />
//       <EmotionGraphs />
//       <CalendarView />
//     </div>
//   );
// };

// export default Dashboard;
"use client";
import HeatMap from "./HeatMap";
import { EmotionStats } from "./EmotionStats";
import emotions from "../data/emotions.json";
import EmotionSummary from "./EmotionSummary";
import EmotionGraphs from "./EmotionGraphs";
import CalendarView from "./CalendarView";
import { motion } from "framer-motion";

// import { EmotionType } from "./HeatMap";

// type Emotion = EmotionType;
type Emotion = "happy" | "sad" | "angry" | "neutral" | "anxious" | "calm";

type EmotionData = {
  timestamp: string;
  emotion: Emotion;
  confidence: number;
};

const Dashboard = () => {
  const typedEmotions: EmotionData[] = emotions
    .filter((e) => ["happy", "sad", "angry", "neutral"].includes(e.emotion))
    .map((e) => ({
      timestamp: e.timestamp,
      emotion: e.emotion as Emotion,
      confidence: e.confidence,
    }));
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#140720] to-[#1A0A2F] text-white px-4 py-10">
      <motion.h1
        className="text-center text-4xl font-extrabold text-purple-400 mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Emotional Heatmap Dashboard
      </motion.h1>

      <div className="grid gap-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/5 p-6 shadow-md backdrop-blur-md border border-purple-500/10"
        >
          <HeatMap emotions={typedEmotions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/5 p-6 shadow-md backdrop-blur-md border border-purple-500/10"
        >
          <EmotionStats emotions={typedEmotions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/5 p-6 shadow-md backdrop-blur-md border border-purple-500/10"
        >
          <EmotionSummary />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white/5 p-6 shadow-md backdrop-blur-md border border-purple-500/10"
        >
          <EmotionGraphs />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white/5 p-6 shadow-md backdrop-blur-md border border-purple-500/10"
        >
          <CalendarView />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
