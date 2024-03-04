"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileIcon, StarIcon, TrashIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const pathname = usePathname()

  const sidebarLinks = [
    {
      href: "/dashboard/files",
      icon: FileIcon,
      label: "All Files",
    },
    {
      href: "/dashboard/favorites",
      icon: StarIcon,
      label: "Favorites",
    },
    {
      href: "/dashboard/trash",
      icon: TrashIcon,
      label: "Trash",
    },
  ]

  return (
    <div className="flex w-40 flex-col gap-4">
      {sidebarLinks.map((link) => (
        <Link href={link.href} key={link.href}>
          <Button
            variant="link"
            className={cn(
              "flex gap-2",
              pathname.includes(link.href) ? "text-blue-500" : ""
            )}
          >
            <link.icon /> {link.label}
          </Button>
        </Link>
      ))}
    </div>
  )
}
