"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, ArrowRight } from "lucide-react"

interface Model {
  id: number
  name: string
  image: string
  description: string
  url: string
}

const models = [
  {
    id: 1,
    name: "VibeSense Indian",
    image: "/placeholder.svg?height=400&width=400",
    description: "Model trained on Indian Accent to predict emotions and voice augmentation.",
    specs: {
      accuracy: "93.7%",
      training: "3000",
      response: "Under 10ms",
      // languages: "42 languages supported",
      specialization: "Natural conversation, creative content, Indian Accent",
    },
  },
  {
    id: 2,
    name: "VibeSense Foreign",
    image: "/placeholder.svg?height=400&width=400",
    description: "Model trained on CREMA-D, RAVDESS, SAVEE and TESS COMBINED.",
    specs: {
      accuracy: "96%",
      training: "33000",
      response: "Under 7ms",
      // languages: "28 languages supported",
      specialization: "Foreign accent, emotional analysis, voice modulation",
    },
  },
  {
    id: 3,
    name: "VibeSense Echo",
    image: "/placeholder.svg?height=400&width=400",
    description: "Gemini Model.",
    specs: {
      // accuracy: "9%",
      training: "Pre-Trained",
      // response: "Under 75ms",
      languages: "36 languages supported",
      specialization: "Pre trained model",
    },
  },
]

// Helper function to convert AudioBuffer to WAV format
const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const bytesPerSample = 2 // 16-bit
  const blockAlign = numChannels * bytesPerSample

  // Calculate data chunk size
  const dataChunkSize = buffer.length * numChannels * bytesPerSample

  // Create buffer for WAV header (44 bytes) + data
  const arrayBuffer = new ArrayBuffer(44 + dataChunkSize)
  const view = new DataView(arrayBuffer)

  // RIFF header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataChunkSize, true) // file length
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // fmt chunk length
  view.setUint16(20, 1, true) // PCM format
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true) // byte rate
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bytesPerSample * 8, true) // bits per sample
  writeString(view, 36, 'data')
  view.setUint32(40, dataChunkSize, true)

  // Write PCM samples
  let offset = 44
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
  }

  return arrayBuffer
}

const writeString = (view: DataView, offset: number, str: string) => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

// Convert any audio blob to WAV format
const convertToWav = async (blob: Blob): Promise<Blob> => {
  try {
    const arrayBuffer = await blob.arrayBuffer()
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    const wavArrayBuffer = audioBufferToWav(audioBuffer)
    return new Blob([wavArrayBuffer], { type: 'audio/wav' })
  } catch (error) {
    console.error("Error converting to WAV:", error)
    throw error
  }
}

export default function ModelsPage() {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const [activeModel, setActiveModel] = useState<Model | null>(null)
  const [selectedModel, setSelectedModel] = useState<(typeof models)[0] | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleTryModel = () => {
    if (isLoggedIn) {
      window.location.href = "/explore"
    } else {
      window.location.href = "/auth"
    }
  }
  const startRecording = async (model: Model) => {
    try {
      console.log("Starting recording for model:", model.name)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setActiveModel(model)

      // Use webm by default as most browsers don't support WAV recording
      const options = { mimeType: 'audio/webm;codecs=opus' }
      const recorder = new MediaRecorder(stream, options)
      console.log("MediaRecorder mimeType:", recorder.mimeType)

      recorder.onstart = () => {
        console.log("MediaRecorder started")
        audioChunks.current = []
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
          console.log("Chunk added. Total chunks:", audioChunks.current.length)
        }
      }

      recorder.onstop = async () => {
        console.log("Recording stopped")
        try {
          const audioBlob = new Blob(audioChunks.current, { type: recorder.mimeType })
          console.log("Original audio blob:", audioBlob)

          // Convert to WAV before uploading
          const wavBlob = await convertToWav(audioBlob)
          console.log("Converted WAV blob:", wavBlob)

          const formData = new FormData()
          formData.append("file", wavBlob, "recording.wav")

          console.log("Uploading file to:", model.url)
          const response = await fetch(model.url, {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            console.error("Server error:", response.status, response.statusText)
            throw new Error(`Server error: ${response.statusText}`)
          }

          const data = await response.json()
          console.log("Upload successful. Response:", data)
        } catch (error) {
          console.error("Upload error:", error)
        } finally {
          audioChunks.current = []
          stream.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.current = recorder
      recorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      console.log("Recording started")
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      setIsRecording(false)
      console.log("Stopping recording")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33] py-24">
      {/* Hero Section */}
      <div className="container mx-auto mb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl rounded-xl border border-purple-500/20 bg-black/40 p-10 text-center backdrop-blur-sm shadow-[0_0_30px_rgba(147,51,234,0.2)]"
        >
          <div className="relative inline-block">
            <h2 className="mb-6 text-4xl font-bold text-white">
              Experience Our{" "}
              <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                Best Model
              </span>
            </h2>
            <div className="absolute -right-6 -top-6 text-purple-400 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          <p className="mb-8 text-xl text-slate-300">
            Our flagship VibeSense AI model delivers unparalleled accuracy and natural language understanding. Try it
            now and experience the future of AI interaction.
          </p>
          <Button
            onClick={handleTryModel}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all duration-300"
            size="lg"
          >
            Try It Out <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">Models</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">
            Explore our range of advanced AI models designed for various applications and environments.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card
                className="group relative overflow-hidden border border-purple-500/20 bg-black/40 backdrop-blur-sm transition-all hover:border-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                onClick={() => setSelectedModel(model)}
              >
                <div className="aspect-square w-full overflow-hidden bg-black/60 p-6">
                  <motion.img
                    src={model.image}
                    alt={model.name}
                    className="h-full w-full object-contain transition-transform group-hover:scale-110"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13071E] to-transparent opacity-70"></div>
                </div>
                <CardContent className="relative z-10 p-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">{model.name}</h3>
                  <p className="mb-4 text-slate-300">{model.description}</p>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-slate-400">Accuracy</span>
                    <span className="text-sm font-medium text-purple-400">{model.specs.accuracy}</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300"
                    onClick={() => setSelectedModel(model)}
                  >
                    View Details
                  </Button>
                </CardContent>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 -z-10 bg-purple-500 opacity-5 blur-xl"></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal for model details */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
            onClick={() => setSelectedModel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-purple-500/30 bg-gradient-to-br from-black to-purple-900/20 backdrop-blur-lg p-0 shadow-[0_0_30px_rgba(147,51,234,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-purple-400 backdrop-blur-sm hover:bg-black/80 hover:text-purple-300"
                onClick={() => setSelectedModel(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square bg-black/50 p-8">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={selectedModel.image}
                    alt={selectedModel.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col p-8">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 text-3xl font-bold text-white"
                  >
                    {selectedModel.name}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6 text-slate-300"
                  >
                    {selectedModel.description}
                  </motion.p>

                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-3 text-xl font-semibold text-purple-400"
                  >
                    Specifications
                  </motion.h3>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-6 space-y-3"
                  >
                    {Object.entries(selectedModel.specs).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="flex justify-between border-b border-purple-500/20 pb-2"
                      >
                        <span className="font-medium capitalize text-purple-300">{key}</span>
                        <span className="text-slate-300">{value}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-auto"
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300"
                      onClick={handleTryModel}
                    >
                      Try It Out <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}