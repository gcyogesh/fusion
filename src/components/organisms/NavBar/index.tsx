'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Logo from '@/components/atoms/Logo'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { IoMdClose } from 'react-icons/io'
import { FiMenu } from 'react-icons/fi'
import { usePathname } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'
import { fetchAPI } from '@/utils/apiService'

type NavLink = {
  name: string
  href: string
  hasDropdown: boolean
  subLinks?: { name: string; href: string }[]
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [navbarBg, setNavbarBg] = useState('transparent')
  const [navbarBlur, setNavbarBlur] = useState(true)
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
    const fetchData = async () => {
      const activitiesRes = await fetchAPI({ endpoint: 'activities' })
      const destinationsRes = await fetchAPI({ endpoint: 'destinations' })

      const formattedActivities = activitiesRes?.data?.map((item: any) => ({
        name: item?.title || 'Untitled',
        href: `/activities/${item?.slug || ''}`
      }))

      const formattedDestinations = destinationsRes?.data?.map((item: any) => ({
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
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY === 0) {
        if (pathname === '/') {
          setNavbarBg('transparent')
          setNavbarBlur(true)
        } else {
          setNavbarBg('#0F7BBA')
          setNavbarBlur(false)
        }
        setShowNavbar(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false)
        setNavbarBg('transparent')
        setNavbarBlur(false)
      } else {
        setShowNavbar(true)
        setNavbarBg('#0F7BBA')
        setNavbarBlur(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, pathname])

  return (
    <nav
      style={{
        backgroundColor: navbarBg,
        backdropFilter: navbarBlur ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: navbarBlur ? 'blur(10px)' : 'none'
      }}
      className={`fixed top-0 left-0 w-full z-60 transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } transition-colors duration-500 ease-in-out px-2`}
    >
      <div
        className={`max-w-7xl mx-auto flex justify-between items-center px-4 py-3 h-20 ${
          navbarBg === 'transparent' && navbarBlur ? 'text-black' : 'text-white'
        }`}
      >
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 font-medium text-base relative ">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="relative group text-white"
              onMouseEnter={() => setDropdownOpen(link.hasDropdown ? link.name : null)}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                <Link href={link.href}>{link.name}</Link>
                {link.hasDropdown && <ChevronDown className="w-3 h-4 mt-[2px]" />}
              </div>

              {link.hasDropdown && dropdownOpen === link.name && (
                <ul
                  className="absolute top-8 left-0 w-44 bg-white text-black rounded shadow-md py-2 z-50"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {link.subLinks?.map((sublink) => (
                    <li key={sublink.name}>
                      <Link
                        href={sublink.href}
                        className="block px-4 py-2 hover:bg-gray-100"
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
          <FaWhatsapp className="text-white text-3xl" />
          <Link href="/contact">
            <button className="hidden lg:block bg-gradient-to-r from-[#F28A15] to-[#E47312] hover:from-[#0E334F] hover:to-[#0E334F] text-white text-base font-medium h-[46px] w-[160px] rounded-full transition">
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
                <Link href={link.href} onClick={toggleMenu}>
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
                        className="block py-1 text-sm"
                      >
                        {sublink.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <Link href="/contact" onClick={toggleMenu}>
            <button className="w-full bg-gradient-to-r from-[#F28A15] to-[#E47312] text-white font-medium h-[46px] rounded-full">
              Contact
            </button>
          </Link>
        </div>
      )}
    </nav>
  )
}
