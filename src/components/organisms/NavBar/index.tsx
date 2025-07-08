'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Logo from '@/components/atoms/Logo'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { IoMdClose } from 'react-icons/io'
import { FiMenu } from 'react-icons/fi'
import { usePathname } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'

type NavLink = {
  name: string
  href: string
  hasDropdown: boolean
  subLinks?: { name: string; href: string }[]
}

interface NavbarProps {
  destinations: any[];
  activities: any[];
}

export default function Navbar({ destinations = [], activities = [] }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [navLinks, setNavLinks] = useState<NavLink[]>([])
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const newState = !prev
      document.body.style.overflow = newState ? 'hidden' : 'auto'
      return newState
    })
  }

  useEffect(() => {
    const formattedActivities = activities?.map((item: any) => ({
      name: item?.title || 'Untitled',
      href: `/activities/${item?.slug || ''}`
    }))

    const formattedDestinations = destinations?.map((item: any) => ({
      name: item?.title || 'Untitled',
      href: `/destinations/${item?.slug || ''}`
    }))

    const links: NavLink[] = [
      {
        name: 'Destinations',
        href: '/destinations',
        hasDropdown: true,
        subLinks: formattedDestinations
      },
      {
        name: 'Activities',
        href: '/activities',
        hasDropdown: true,
        subLinks: formattedActivities
      },
      {
        name: 'About',
        href: '/about',
        hasDropdown: false
      },
      {
        name: 'Blogs',
        href: '/blogs',
        hasDropdown: false
      },
      {
        name: 'Duration',
        href: '/duration',
        hasDropdown: false
      }
    ]

    setNavLinks(links)
  }, [destinations, activities])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      if (currentScrollY === 0) {
        setShowNavbar(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const getNavbarClasses = () => {
    if (pathname === '/' && scrollY === 0) {
      return 'blur-base bg-white/20 text-white shadow-lg'
    }
    return 'bg-[#0F7BBA] text-white'
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-60 px-2 transition-all duration-300 ease-linear ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } ${getNavbarClasses()}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4 h-20">
        <div>
          <Link href="/" className="cursor-pointer">
            <Logo/>
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 font-medium text-base relative">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="relative group"
              onMouseEnter={() => setDropdownOpen(link.hasDropdown ? link.name : null)}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                <Link href={link.href} className="cursor-pointer">{link.name}</Link>
                {link.hasDropdown && <ChevronDown className="w-3 h-4 mt-[2px]" />}
              </div>

              {link.hasDropdown && dropdownOpen === link.name && (
                <ul
                  className="absolute top-8 left-0 right-4 w-40 backdrop-blur-xl bg-white/20 rounded-md text-white shadow-lg py-2 z-50"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {link.subLinks?.map((sublink) => (
                    <li key={sublink.name}>
                      <Link
                        href={sublink.href}
                        className="block px-4 py-2 hover:bg-[#E47312] cursor-pointer"
                        onClick={() => setDropdownOpen(null)}
                      >
                        {sublink.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="https://wa.me/977985-1167629"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <FaWhatsapp className="text-white text-3xl hover:text-green-400 transition-colors" />
          </Link>

          <Link href="/contact" className="cursor-pointer">
            <button className="hidden lg:block bg-primary hover:bg-gradient-to-r from-[#D35400] to-[#A84300] text-white text-base font-medium h-[46px] w-[160px] rounded-full transition cursor-pointer">
              Contact
            </button>
          </Link>

          <button
            className="text-3xl md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <IoMdClose /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white text-black px-6 py-4 space-y-4 shadow-lg z-40">
          {navLinks.map((link) => (
            <div key={link.name}>
              <div
                className="flex justify-between items-center cursor-pointer py-2"
                onClick={() => setMobileDropdown(mobileDropdown === link.name ? null : link.name)}
              >
                <Link href={link.href} onClick={toggleMenu} className="cursor-pointer">
                  {link.name}
                </Link>
                {link.hasDropdown &&
                  (mobileDropdown === link.name ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  ))}
              </div>
              {link.hasDropdown && mobileDropdown === link.name && (
                <ul className="pl-4 space-y-2">
                  {link.subLinks?.map((sublink) => (
                    <li key={sublink.name}>
                      <Link
                        href={sublink.href}
                        onClick={toggleMenu}
                        className="block py-1 text-sm cursor-pointer"
                      >
                        {sublink.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <Link href="/contact" onClick={toggleMenu} className="cursor-pointer">
            <button className="w-full bg-primary hover:bg-gradient-to-r from-[#D35400] to-[#A84300] text-white font-medium h-[46px] rounded-full cursor-pointer">
              Contact
            </button>
          </Link>
        </div>
      )}
    </nav>
  )
}
