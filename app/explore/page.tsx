"use client";
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import VoiceWaveform from "@/components/voice-waveform"

type Message = {
  role: "user" | "ai"
  content: string
}
declare var webkitSpeechRecognition: any
declare var SpeechRecognition: any

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [savedFilePath, setSavedFilePath] = useState<string | null>(null);
  const [responses, setResponses] = useState<string[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");

      // Send the audio file to the backend
      const response = await fetch("http://127.0.0.1:8000/convo/process-audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setSavedFilePath(data.file_path);
      setAudioURL(URL.createObjectURL(audioBlob));

      // Update the state with the new response and log it
      setResponses((prev) => {
        const updated = [...prev, data.response];
        console.log("Responses:", updated);
        return updated;
      });

      // Clear the audio chunks for the next recording
      audioChunks.current = [];
    };

    mediaRecorder.current = recorder;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33] py-24">
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="relative inline-block">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              Voice{" "}
              <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                Interaction
              </span>
            </h1>
            <div className="absolute -right-6 -top-6 text-purple-400 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
      <h1 className="text-2xl font-bold mb-4">Audio Recorder</h1>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={"group relative h-20 w-40 bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

    </div>
  );
}
