"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Database, FileText, Server, Users, AlertTriangle, Cpu, Globe } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "The Realization",
    description: "We discovered that existing datasets lacked Indian accent data and were outdated, making it impossible to train an accurate AI model.",
    icon: AlertTriangle,
    color: "#66BFFF",
  },
  {
    id: 2,
    title: "Building Our Own Dataset",
    description: "To bridge this gap, we decided to collect fresh data from Indian users, ensuring diverse accents and real-world scenarios.",
    icon: FileText,
    color: "#66BFFF",
  },
  {
    id: 3,
    title: "Data Processing & Cleaning",
    description: "We meticulously cleaned and preprocessed the data, removing noise and inconsistencies to create high-quality training inputs.",
    icon: Database,
    color: "#66BFFF",
  },
  {
    id: 4,
    title: "Choosing the Right Model",
    description: "Instead of using outdated architectures, we opted for LSTM networks, which proved to be more efficient and accurate for our needs.",
    icon: Cpu,
    color: "#66BFFF",
  },
  {
    id: 5,
    title: "Model Training",
    description: "Our LSTM model was trained on a powerful hardware setup, allowing it to learn and adapt to the nuances of Indian accents.",
    icon: Server,
    color: "#66BFFF",
  },
  {
    id: 6,
    title: "Building a Modern Web App",
    description: "We developed a cutting-edge web application using Next.js, FastAPI, prop drilling, and lazy loading to optimize performance and user experience.",
    icon: Globe,
    color: "#66BFFF",
  },
  {
    id: 7,
    title: "User Testing & Refinement",
    description: "Real users tested our platform, helping us fine-tune the model for maximum accuracy and reliability in real-world applications.",
    icon: Users,
    color: "#66BFFF",
  },
];

export default function RoadmapSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="w-full py-24 bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="relative inline-block">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Our{" "}
              <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                Data Collection
              </span>{" "}
              Process
            </h2>
            <div className="absolute -right-6 -top-6 text-purple-400 animate-pulse">
              {/* <Sparkles className="h-6 w-6" /> */}
            </div>
          </div>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">
            We follow a rigorous methodology to ensure our AI models are trained on diverse, high-quality data.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className="relative">
            {/* Connecting line */}
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-purple-500/80 via-purple-500 to-purple-500/20"
            />

            {/* Steps */}
            <div className="space-y-24">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                  className={`relative flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="flex-1 md:px-8">
                    <motion.div
                      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(147, 51, 234, 0.2)" }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-xl border border-purple-500/20 bg-black/40 backdrop-blur-sm p-8 ${
                        index % 2 === 0 ? "md:mr-12" : "md:ml-12"
                      }`}
                    >
                      <h3 className="mb-3 text-2xl font-bold text-white">{step.title}</h3>
                      <p className="text-lg text-slate-300">{step.description}</p>
                    </motion.div>
                  </div>

                  <div className="absolute left-1/2 top-0 flex -translate-x-1/2 transform items-center justify-center md:relative md:left-auto md:top-auto md:translate-x-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 + index * 0.2 }}
                      className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-violet-600"
                      style={{ backgroundColor: step.color }}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                      {/* Glow effect */}
                      <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-purple-500 opacity-30 blur-md"></div>
                    </motion.div>
                  </div>

                  <div className="flex-1 md:px-8" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

