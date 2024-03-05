import Image from "next/image"
import Link from "next/link"
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs"

import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <div className="relative z-10 border-b bg-gray-50 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Image src="/logo.png" width={50} height={50} alt="file drive logo" />
          FileDrive
        </Link>

        <div className="flex  gap-2">
          <SignedIn>
            <Button variant="outline">
              <Link href="/dashboard/files">Your Files</Link>
            </Button>
          </SignedIn>
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  )
}
