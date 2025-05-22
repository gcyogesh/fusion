'use client'
import Link from 'next/link'
import { useState } from 'react'
import Logo from '@/components/atoms/Logo'
import { ChevronDown } from 'lucide-react'
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden'
  }

 

  return (
    <>
     <nav className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full z-50 flex items-center justify-center backdrop-blur-lg bg-white/15 ">
  <div className="w-full max-w-7xl flex justify-between items-center px-6 py-2">
    {/* Logo & Brand */}
   <Logo />

    {/* Nav Links (Desktop) */}
    <ul className="hidden md:flex gap-8 text-white font-medium text-base">
      <li>
        <Link href="/">Home</Link>
      </li>

      <li className="flex items-center gap-1 cursor-pointer">
        <Link href="/destinations">Destinations</Link>
        <ChevronDown className="w-4 h-4 mt-[2px]" />
      </li>

      <li className="flex items-center gap-1 cursor-pointer">
        <Link href="/activities">Activities</Link>
        <ChevronDown className="w-4 h-4 mt-[2px]" />
      </li>

      <li className="flex items-center gap-1 cursor-pointer">
        <Link href="/about">About</Link>
        <ChevronDown className="w-4 h-4 mt-[2px]" />
      </li>
    </ul>

    {/* CTA and Toggle Button */}
    <div className="flex items-center gap-4">
      <Link href="/plan-trip">
        <button className="hidden lg:block bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium  h-[46px] w-[160px] rounded-full transition">
          Plan Your Trip
        </button>
      </Link>
      <button
        className="text-white text-3xl"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>
    </div>
  </div>
</nav>

    </>
  )
}