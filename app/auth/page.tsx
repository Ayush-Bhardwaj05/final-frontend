"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [errorMessage, setErrorMessage] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  // API request handler
  const handleAuth = async (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const endpoint = type === "login" ? "/auth/login" : "/auth/signup"

    try {
      const response = await fetch(`https://vibesense230.zapto.org${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.detail)

      if (type === "login") {
        localStorage.setItem("token", data.access_token)
        alert("Login successful!")
        router.push("/explore")
      } else {
        alert("Registration successful! Please log in.")
        setActiveTab("login")
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("An unknown error occurred")
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden py-16">
      {/* Background Animation */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-[#0A1F44]/80 to-[#050A1A] opacity-90"></div>

      <div className="container max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="overflow-hidden border-[#66BFFF]/20 bg-[#0F2A5C]/30 shadow-[0_0_30px_rgba(102,191,255,0.2)] backdrop-blur-xl">
            <div className="bg-gradient-to-r from-[#0A1F44] to-[#0F2A5C] p-6 text-white">
              <h2 className="text-3xl font-bold">Welcome to VibeSense</h2>
              <p className="mt-2 text-[#D1D1D1]">Sign in to your account or create a new one</p>
            </div>
            <CardContent className="p-6">
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8 grid w-full grid-cols-2 bg-[#0A1F44]/50 p-1">
                  <TabsTrigger value="login" className="data-[state=active]:bg-[#66BFFF]">Login</TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-[#66BFFF]">Register</TabsTrigger>
                </TabsList>

                {errorMessage && <p className="text-red-400 mb-4">{errorMessage}</p>}

                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }} transition={{ duration: 0.3 }}>
                    <TabsContent value="login" className="mt-0">
                      <form onSubmit={(e) => handleAuth(e, "login")}>                          
                        <AuthForm showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} />
                        <Button type="submit" className="mt-2 w-full bg-[#66BFFF]">Sign In</Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="register" className="mt-0">
                      <form onSubmit={(e) => handleAuth(e, "register")}>                          
                        <AuthForm showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} isRegister />
                        <Button type="submit" className="mt-2 w-full bg-[#66BFFF]">Create Account</Button>
                      </form>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

interface AuthFormProps {
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  isRegister?: boolean;
}

function AuthForm({ showPassword, togglePasswordVisibility, isRegister = false }: AuthFormProps) {
  return (
    <div className="space-y-5">
      {isRegister && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#D1D1D1]">Full Name</Label>
          <Input id="name" name="name" type="text" placeholder="John Doe" />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#D1D1D1]">Email</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#D1D1D1]">Password</Label>
        <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" />
        <Button type="button" variant="ghost" size="icon" onClick={togglePasswordVisibility}>{showPassword ? <EyeOff /> : <Eye />}</Button>
      </div>
    </div>
  )
}
