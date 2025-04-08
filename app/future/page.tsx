"use client";

import { motion } from "framer-motion";
import { PlayCircle, Mic, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FutureSelfTalkPage() {
  const container = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33] py-24">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Future Self{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
              Connection
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-slate-300">
            Record your message to your future self and connect with guidance when you need it most.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center space-y-10"
        >
          {/* Button 1: Play Future Self Message */}
          <motion.div variants={item} className="w-full max-w-md">
            <Button className="w-full py-6 text-xl bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg rounded-lg flex items-center justify-center">
              <PlayCircle className="mr-3" /> Play Future Self Message
            </Button>
          </motion.div>

          {/* Button 2: Play Current Situation Recording */}
          <motion.div variants={item} className="w-full max-w-md">
            <Button className="w-full py-6 text-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg rounded-lg flex items-center justify-center">
              <Mic className="mr-3" /> Play Current Situation Recording
            </Button>
          </motion.div>

          {/* Button 3: Get Response from Future Self */}
          <motion.div variants={item} className="w-full max-w-md">
            <Button className="w-full py-6 text-xl bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white shadow-lg rounded-lg flex items-center justify-center">
              <MessageSquare className="mr-3" /> Get Response from Future Self
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}