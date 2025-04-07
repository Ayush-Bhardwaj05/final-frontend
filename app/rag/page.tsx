"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RagFrontend() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);
  const [contextVisible, setContextVisible] = useState(false);
  const [contextData, setContextData] = useState<string>("");

  // Simulate recording and backend fetching logic
  const handleRecord = async () => {
    setRecording(true);
    setResponses([]);
    setContextVisible(false);

    // Simulate recording duration (e.g., 2 seconds)
    setTimeout(() => {
      setRecording(false);
      setLoading(true);

      // Simulate backend processing delay (e.g., 2 seconds)
      setTimeout(() => {
        setResponses([
          "Response Card 1: This is the fetched response from the backend.",
          "Response Card 2: Additional information regarding the query.",
          "Response Card 3: Final piece of the answer.",
        ]);
        setContextData(
          "Detailed backend context: The query was processed using vector search, relevant documents were retrieved, and the answer was synthesized from multiple sources."
        );
        setLoading(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33] py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-6 text-5xl font-bold text-white">
            Ask Our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
              RAG Model
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">
            Speak your query and let our AI find the answer.
          </p>
        </motion.div>

        <div className="flex flex-col items-center">
          <Button
            onClick={handleRecord}
            className="mb-6 flex items-center space-x-2 bg-black/40 border border-purple-500/20 hover:bg-black/60"
          >
            <Mic className="h-6 w-6 text-purple-400" />
            <span>{recording ? "Recording..." : "Record"}</span>
          </Button>
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-6"
            >
              <Loader2 className="h-10 w-10 text-purple-400" />
            </motion.div>
          )}
        </div>

        {responses.length > 0 && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
            }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {responses.map((res, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <Card className="p-6 border border-purple-500/20 bg-black/40 backdrop-blur-sm">
                  <p className="text-slate-300">{res}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setContextVisible(!contextVisible)}
            className="flex items-center space-x-2 bg-black/40 border border-purple-500/20 hover:bg-black/60"
          >
            <Info className="h-5 w-5 text-purple-400" />
            <span>Context</span>
          </Button>
          {contextVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-4 p-6 border border-purple-500/20 bg-black/40 backdrop-blur-sm"
            >
              <p className="text-slate-300">{contextData}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
