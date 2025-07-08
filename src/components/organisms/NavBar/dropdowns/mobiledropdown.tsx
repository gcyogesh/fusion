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
  onClickLink?: () => void
}

export default function MobileDropdownMenu({ name, href, subLinks = [], onClickLink }: Props) {
  const [open, setOpen] = useState(false)

  const toggleDropdown = () => setOpen((prev) => !prev)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-2 cursor-pointer" onClick={toggleDropdown}>
        <Link href={href} onClick={onClickLink}>
          {name}
        </Link>
        {subLinks.length > 0 &&
          (open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
      </div>

      {subLinks.length > 0 && open && (
        <ul className="pl-4 space-y-2">
          {subLinks.map((sub) => (
            <li key={sub.name}>
              <Link
                href={sub.href}
                className="block py-1 text-sm"
                onClick={onClickLink}
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
