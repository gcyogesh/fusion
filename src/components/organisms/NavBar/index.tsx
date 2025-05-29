'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Logo from '@/components/atoms/Logo'
import { ChevronDown } from 'lucide-react'
import { IoMdClose } from 'react-icons/io'
import { FiMenu } from 'react-icons/fi'



const navLinks = [
  { name: "Home", href: "/", hasDropdown: false },
  { name: "Destinations", href: "/destinations", hasDropdown: true },
  { name: "Activities", href: "/activities", hasDropdown: true },
  { name: "About", href: "/about", hasDropdown: true },
  { name: "Contact", href: "/contact", hasDropdown: false },
];


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden'
  }

 

  return (
    <>
     <nav
      className={`${
        isHome ? 'absolute' : 'fixed'
      } top-0 left-1/2 transform -translate-x-1/2 w-full z-50 flex items-center justify-center h-20 
      ${isHome ? 'bg-white/15 backdrop-blur-lg' : 'bg-[#0F7BBA]'}`}
    >
  <div className="w-full max-w-7xl flex justify-between items-center  py-2">
    {/* Logo & Brand */}
   <Logo />

    {/* Nav Links (Desktop) */}

   <ul className="hidden md:flex gap-8 text-white font-medium text-base">
      {navLinks.map((link) => (
        <li key={link.name} className="flex items-center gap-1 cursor-pointer">
          <Link href={link.href}>{link.name}</Link>
          {link.hasDropdown && <ChevronDown className="w-3 h-4 mt-[2px]" />}
        </li>
      ))}
    </ul>

    {/* CTA and Toggle Button */}
    <div className="flex items-center justify-center gap-4 ">
      <Link href="/plan-trip">
        <button className="hidden lg:block bg-gradient-to-r from-[#F28A15] to-[#E47312] hover:from-[#0f7bba] hover:to-[#0f7bba] text-white text-sm font-medium  h-[46px] w-[160px] rounded-full transition">
          Plan Your Trip
        </button>
      </Link>
      <button
  className="text-white text-5xl"
  onClick={toggleMenu}
  aria-label="Toggle Menu"
>
  {isMenuOpen ? (
    <IoMdClose className="text-white text-4xl transition-transform duration-300 rotate-90" />
  ) : (
     <FiMenu className="text-white transition-transform p-1 duration-250" />
  )}
</button>
    </div>
  </div>
</nav>

    </>
  )
}