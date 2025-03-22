"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, Layers, Users, Mic, LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Our Models", path: "/models", icon: Layers },
  { name: "About Us", path: "/about", icon: Users },
  { name: "Explore", path: "/explore", icon: Mic },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Simulate login/logout functionality
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: 0, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 z-50 w-full bg-black/60  border-b border-purple-900/20"
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-bold text-white">
              <span className="text-purple-400">Echo</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`group flex items-center gap-2 text-base font-medium transition-all hover:text-purple-400 ${
                      pathname === item.path ? "text-purple-400" : "text-slate-200"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="relative">
                      {item.name}
                      <span
                        className={`absolute -bottom-1 left-0 h-[2px] w-0 bg-purple-400 transition-all duration-300 group-hover:w-full ${
                          pathname === item.path ? "w-full" : ""
                        }`}
                      ></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Button
              onClick={toggleLogin}
              asChild={!isLoggedIn}
              className="relative overflow-hidden bg-purple-600 text-white hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
            >
              {isLoggedIn ? (
                <button className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <Link href="/auth" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login / Sign Up
                </Link>
              )}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-200 hover:bg-purple-900/20 hover:text-purple-400 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden md:hidden"
            >
              <div className="container mx-auto bg-gradient-to-b from-black to-purple-900/20 backdrop-blur-md px-4 py-6">
                <ul className="flex flex-col space-y-6">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className={`flex items-center gap-2 text-lg font-medium transition-colors hover:text-purple-400 ${
                          pathname === item.path ? "text-purple-400" : "text-slate-200"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Button
                      onClick={() => {
                        toggleLogin()
                        setIsOpen(false)
                      }}
                      asChild={!isLoggedIn}
                      className="w-full bg-purple-600 text-white hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                    >
                      {isLoggedIn ? (
                        <button className="flex items-center justify-center gap-2">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      ) : (
                        <Link href="/auth" className="flex items-center justify-center gap-2">
                          <LogIn className="h-4 w-4" />
                          Login / Sign Up
                        </Link>
                      )}
                    </Button>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  )
}

