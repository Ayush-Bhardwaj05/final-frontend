"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import RoadmapSection from "@/components/roadmap-section"
import LoadingSpline from "@/components/loading-spline"

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <div ref={containerRef} className="relative flex flex-col">
      {/* Hero Section with 3D Robot */}
      <section className="relative flex h-[90vh] w-full items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ opacity, scale }}
          className="absolute inset-0 z-10"
        >
          <LoadingSpline
            src="https://my.spline.design/nexbotrobotcharacterconcept-5e50b3339fddca3d56a0a0e7943ef3c0/"
            title="Loading VibeSense..."
          />
        </motion.div>

        {/* Overlay text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-16 left-0 z-20 w-full px-6 text-center md:bottom-24 md:px-12"
        >
          <div className="relative inline-block mb-4">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              Meet Vibe                   
              <span className="ml-2 bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                Sense
              </span>
            </h1>
            <div className="absolute -right-6 -top-6 text-purple-400 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all duration-300"
            >
              <Link href="/models" className="flex items-center">
                Explore Models <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-purple-500 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-300"
            >
              <Link href="/explore" className="flex items-center">
                Try Our Model <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13071E] to-transparent opacity-90"></div>
      </section>

      {/* Roadmap Section */}
      <RoadmapSection />
    </div>
  )
}