// // "use client";

// // import { useEffect, useState } from 'react';
// // import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
// // import './calender.css';

// // type EmotionType = 'happy' | 'sad' | 'angry' | 'neutral';

// // type EmotionEntry = {
// //   timestamp: string;
// //   emotion: EmotionType;
// // };

// // const emotionColors: Record<EmotionType, string> = {
// //   happy: '#A7F3D0',
// //   sad: '#BFDBFE',
// //   angry: '#FCA5A5',
// //   neutral: '#D1D5DB',
// // };

// // const CalendarView = () => {
// //   const [emotionsData, setEmotionsData] = useState<EmotionEntry[]>([]);

// //   useEffect(() => {
// //     fetch('/emotions.json')
// //       .then((res) => res.json())
// //       .then((data: EmotionEntry[]) => setEmotionsData(data));
// //   }, []);

// //   const today = new Date();
// //   const daysInMonth = eachDayOfInterval({
// //     start: startOfMonth(today),
// //     end: endOfMonth(today),
// //   });

// //   const emotionByDate: Record<string, EmotionType> = {};
// //   emotionsData.forEach((entry) => {
// //     const dateKey = format(new Date(entry.timestamp), 'yyyy-MM-dd');
// //     emotionByDate[dateKey] = entry.emotion;
// //   });

// //   return (
// //     <div className="p-6">
// //       <h2 className="text-xl font-bold mb-4">Emotion Calendar</h2>
// //       <div className="calendar-container">
// //         {daysInMonth.map((day) => {
// //           const dateKey = format(day, 'yyyy-MM-dd');
// //           const emotion = emotionByDate[dateKey] || 'neutral';
// //           return (
// //             <div
// //               key={dateKey}
// //               className="calendar-day"
// //               style={{ backgroundColor: emotionColors[emotion] }}
// //               title={`${dateKey}: ${emotion}`}
// //             />
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // };

// // export default CalendarView;

// "use client";

// import { useEffect, useState } from "react";
// import {
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   format,
// } from "date-fns";
// import { motion } from "framer-motion";

// type EmotionType = "happy" | "sad" | "angry" | "neutral";

// type EmotionEntry = {
//   timestamp: string;
//   emotion: EmotionType;
// };

// const emotionColors: Record<EmotionType, string> = {
//   happy: "#34D399",
//   sad: "#60A5FA",
//   angry: "#F87171",
//   neutral: "#9CA3AF",
// };

// const CalendarView = () => {
//   const [emotionsData, setEmotionsData] = useState<EmotionEntry[]>([]);

//   useEffect(() => {
//     fetch("/emotions.json")
//       .then((res) => res.json())
//       .then((data: EmotionEntry[]) => setEmotionsData(data));
//   }, []);

//   const today = new Date();
//   const daysInMonth = eachDayOfInterval({
//     start: startOfMonth(today),
//     end: endOfMonth(today),
//   });

//   const emotionByDate: Record<string, EmotionType> = {};
//   emotionsData.forEach((entry) => {
//     const dateKey = format(new Date(entry.timestamp), "yyyy-MM-dd");
//     emotionByDate[dateKey] = entry.emotion;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33] py-16">
//       <div className="container mx-auto px-6">
//         <motion.h2
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="mb-8 text-center text-4xl font-bold text-purple-400"
//         >
//           Emotion Calendar
//         </motion.h2>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="grid grid-cols-7 gap-3 bg-black/40 p-6 rounded-2xl backdrop-blur-md border border-purple-500/10"
//         >
//           {daysInMonth.map((day) => {
//             const dateKey = format(day, "yyyy-MM-dd");
//             const emotion = emotionByDate[dateKey] || "neutral";
//             return (
//               <motion.div
//                 key={dateKey}
//                 whileHover={{ scale: 1.05 }}
//                 className="aspect-square w-full rounded-xl text-center text-sm font-medium text-white shadow-md transition-all"
//                 style={{
//                   backgroundColor: `${emotionColors[emotion]}33`,
//                   border: `1px solid ${emotionColors[emotion]}`,
//                 }}
//                 title={`${dateKey}: ${emotion}`}
//               >
//                 <div className="flex h-full items-center justify-center">
//                   {format(day, "d")}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default CalendarView;
"use client";

import { useEffect, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";
import { motion } from "framer-motion";

type EmotionType = "happy" | "sad" | "angry" | "neutral";

type EmotionEntry = {
  timestamp: string;
  emotion: EmotionType;
};

const emotionColors: Record<EmotionType, string> = {
  happy: "#34D399",
  sad: "#60A5FA",
  angry: "#F87171",
  neutral: "#9CA3AF",
};

const CalendarView = () => {
  const [emotionsData, setEmotionsData] = useState<EmotionEntry[]>([]);

  useEffect(() => {
    fetch("/emotions.json")
      .then((res) => res.json())
      .then((data: EmotionEntry[]) => setEmotionsData(data));
  }, []);

  const today = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const emotionByDate: Record<string, EmotionType> = {};
  emotionsData.forEach((entry) => {
    const dateKey = format(new Date(entry.timestamp), "yyyy-MM-dd");
    emotionByDate[dateKey] = entry.emotion;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33] py-16">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center text-4xl font-bold text-purple-400"
        >
          Emotion Calendar
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-7 gap-3 bg-black/40 p-6 rounded-2xl backdrop-blur-md border border-purple-500/10"
        >
          {daysInMonth.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const emotion = emotionByDate[dateKey] || "neutral";
            return (
              <motion.div
                key={dateKey}
                whileHover={{ scale: 1.05 }}
                className="aspect-square w-full rounded-xl text-center text-sm font-medium text-white shadow-md transition-all"
                style={{
                  backgroundColor: `${emotionColors[emotion]}33`,
                  border: `1px solid ${emotionColors[emotion]}`,
                }}
                title={`${dateKey}: ${emotion}`}
              >
                <div className="flex h-full items-center justify-center">
                  {format(day, "d")}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarView;
