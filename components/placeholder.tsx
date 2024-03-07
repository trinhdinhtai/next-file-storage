import React from "react"
import Image from "next/image"

import UploadButton from "@/components/upload-button"

export default function Placeholder() {
  return (
    <div className="mt-24 flex w-full flex-col items-center gap-8">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">No file found, upload one now</div>
      <UploadButton />
    </div>
  )
}
