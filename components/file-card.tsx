import { ReactNode } from "react"
import Image from "next/image"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { formatRelative } from "date-fns"
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react"

import { getFileUrl } from "@/lib/file"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import FileActions from "@/components/file-actions"

interface FileCardProps {
  file: Doc<"files">
}

export default function FileCard({ file }: FileCardProps) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  })

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typeIcons[file.type]}</div>{" "}
          {file.name}
        </CardTitle>
        <div className="absolute right-3 top-4">
          <FileActions file={file} />
        </div>
      </CardHeader>

      <CardContent className="flex h-[200px] items-center justify-center">
        {file.type === "image" && (
          <Image
            alt={file.name}
            width={200}
            height={100}
            src={getFileUrl(file.fileId)}
          />
        )}

        {file.type === "csv" && <GanttChartIcon className="h-20 w-20" />}
        {file.type === "pdf" && <FileTextIcon className="h-20 w-20" />}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex w-40 items-center gap-2 text-xs text-gray-700">
          <Avatar className="h-6 w-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700">
          Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  )
}
