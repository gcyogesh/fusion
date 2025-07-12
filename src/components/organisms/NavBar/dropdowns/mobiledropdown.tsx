'use client'

import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

type SubLink = {
  name: string
  href: string
}

type Props = {
  name: string
  href: string
  subLinks?: SubLink[]
  isMobile?: boolean
  onClickLink?: () => void
}

export default function DropdownMenu({ name, href, subLinks = [], isMobile = false, onClickLink }: Props) {
  const [open, setOpen] = useState(false)

  const toggleDropdown = () => {
    setOpen((prev) => !prev)
  }

  const handleLinkClick = () => {
    if (onClickLink) onClickLink()
    setOpen(false)
  }

  return (
    <div className={isMobile ? 'w-full' : 'relative group'} onMouseLeave={() => !isMobile && setOpen(false)}>
      <div
        className={`flex items-center justify-between cursor-pointer ${isMobile ? 'py-2' : 'gap-1'}`}
        onClick={isMobile ? toggleDropdown : undefined}
        onMouseEnter={() => !isMobile && setOpen(true)}
      >
        <Link href={href} onClick={isMobile ? handleLinkClick : undefined} className="cursor-pointer">
          {name}
        </Link>
        {subLinks.length > 0 &&
          (open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
      </div>

      {subLinks.length > 0 && open && (
        <ul
          className={`${
            isMobile
              ? 'pl-4 space-y-2'
              : 'absolute top-8 left-0 w-40 backdrop-blur-xl bg-white/20 rounded-md text-white shadow-lg py-2 z-50'
          }`}
        >
          {subLinks.map((sub) => (
            <li key={sub.name}>
              <Link
                href={sub.href}
                className={`block ${
                  isMobile ? 'py-1 text-sm' : 'px-4 py-2 hover:bg-[#E47312]'
                } cursor-pointer`}
                onClick={isMobile ? handleLinkClick : () => setOpen(false)}
              >
                {sub.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
