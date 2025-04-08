"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Loader2, Info, Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"

export default function RagFrontend() {
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<{ type: string; content: string }[]>([])
  const [contextVisible, setContextVisible] = useState(false)
  const [contextData, setContextData] = useState<string>("")
  const [textInput, setTextInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [micSupported, setMicSupported] = useState(true)

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition, isMicrophoneAvailable } =
    useSpeechRecognition()

  useEffect(() => {
    // Check if speech recognition is supported
    if (!browserSupportsSpeechRecognition) {
      setMicSupported(false)
      setError("Your browser doesn't support speech recognition.")
    }

    // Check if microphone is available
    if (browserSupportsSpeechRecognition && !isMicrophoneAvailable) {
      setError("Microphone access is required for speech recognition.")
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable])

  const handleRecord = async () => {
    setError(null)

    if (!listening) {
      try {
        resetTranscript()
        await SpeechRecognition.startListening({ continuous: true })
      } catch (err) {
        setError("Failed to start speech recognition. Please check microphone permissions.")
        console.error("Speech recognition error:", err)
      }
    } else {
      SpeechRecognition.stopListening()
      if (transcript) {
        await processQuery(transcript)
      }
    }
  }

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim()) {
      await processQuery(textInput)
      setTextInput("")
    }
  }

  const processQuery = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    setResponses([{ type: "query", content: query }])
    setContextVisible(false)
    setError(null)

    try {
      const res = await axios.post("https://rag-backend-sqqz.onrender.com/rag", {
        query: query,
      })

      const { context, base_response, final_answer } = res.data

      setResponses([
        { type: "query", content: query },
        { type: "base", content: base_response },
        { type: "final", content: final_answer },
      ])
      setContextData(context)
    } catch (error) {
      console.error("API error:", error)
      setError("Failed to fetch data from the backend. Please try again later.")
      setResponses([{ type: "query", content: query }])
    } finally {
      setLoading(false)
      resetTranscript()
    }
  }

  const getCardTitle = (type: string) => {
    switch (type) {
      case "query":
        return "Your Question"
      case "base":
        return "Base Response"
      case "final":
        return "Final Answer"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33] py-12 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-6 text-4xl md:text-5xl font-bold text-white">
            Ask Our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
              RAG Model
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-300">
            Speak your query or type it below and let our AI find the answer.
          </p>
        </motion.div>

        <div className="flex flex-col items-center mb-8">
          {micSupported && (
            <Button
              onClick={handleRecord}
              className={`mb-6 flex items-center space-x-2 ${
                listening
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-black/40 border border-purple-500/20 hover:bg-black/60"
              }`}
              disabled={loading}
            >
              {listening ? (
                <>
                  <MicOff className="h-5 w-5 text-white animate-pulse" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 text-purple-400" />
                  <span>Start Recording</span>
                </>
              )}
            </Button>
          )}

          {listening && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-black/30 border border-purple-500/20 rounded-lg max-w-2xl w-full"
            >
              <p className="text-slate-300">
                <span className="text-purple-400 font-medium">Listening: </span>
                {transcript}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleTextSubmit} className="flex w-full max-w-md gap-2 mb-6">
            <Input
              type="text"
              placeholder="Type your question here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="bg-black/40 border border-purple-500/20 text-white"
              disabled={loading || listening}
            />
            <Button
              type="submit"
              disabled={loading || listening || !textInput.trim()}
              className="bg-black/40 border border-purple-500/20 hover:bg-black/60"
            >
              <Send className="h-4 w-4 text-purple-400" />
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mb-6 max-w-md bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
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
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="space-y-6 mb-8"
          >
            {responses.map((res, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                className={index === 0 ? "max-w-md mx-auto" : ""}
              >
                <Card
                  className={`p-6 border border-purple-500/20 bg-black/40 backdrop-blur-sm ${
                    index === 2 ? "border-purple-500/40" : ""
                  }`}
                >
                  <h3 className="text-lg font-medium text-purple-400 mb-2">{getCardTitle(res.type)}</h3>
                  <p className="text-slate-300 whitespace-pre-line">{res.content}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {contextData && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setContextVisible(!contextVisible)}
              className="flex items-center space-x-2 bg-black/40 border border-purple-500/20 hover:bg-black/60"
            >
              <Info className="h-5 w-5 text-purple-400" />
              <span>{contextVisible ? "Hide Context" : "Show Context"}</span>
            </Button>

            {contextVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-4 p-6 border border-purple-500/20 bg-black/40 backdrop-blur-sm max-w-3xl mx-auto"
              >
                <h3 className="text-lg font-medium text-purple-400 mb-2">Context</h3>
                <p className="text-slate-300">{contextData}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

