"use client"

import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { Protect } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { FileIcon, MoreVertical, Star, TrashIcon, UndoIcon } from "lucide-react"
import { toast } from "sonner"

import { getFileUrl } from "@/lib/file"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FileActionsProps {
  file: Doc<"files">
}

export default function FileActions({ file }: FileActionsProps) {
  const deleteFile = useMutation(api.files.deleteFile)
  const restoreFile = useMutation(api.files.restoreFile)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const currentUser = useQuery(api.users.getCurrentUser)

  const handleDownload = () => {
    window.open(getFileUrl(file.fileId), "_blank")
  }

  const handleDangerItemClick = () => {
    if (file.shouldDelete) {
      restoreFile({
        fileId: file._id,
      })
    } else {
      setIsConfirmOpen(true)
    }
  }

  const handleDeleteFile = async () => {
    await deleteFile({
      fileId: file._id,
    })

    toast.success("File deleted successfully")
  }

  const menuItems = [
    {
      icon: <FileIcon className="h-4 w-4" />,
      label: "Download",
      onClick: handleDownload,
    },
    {
      icon: <Star className="h-4 w-4" />,
      label: "Favorite",
      onClick: () => {},
    },
  ]

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted periodically
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFile}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="h-5 w-5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={item.onClick}
              className="flex cursor-pointer items-center gap-1"
            >
              {item.icon} {item.label}
            </DropdownMenuItem>
          ))}

          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === currentUser?._id
              )
            }}
            fallback={<></>}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-1"
              onClick={handleDangerItemClick}
            >
              {file.shouldDelete ? (
                <div className="flex cursor-pointer items-center gap-1 text-green-600">
                  <UndoIcon className="h-4 w-4" /> Restore
                </div>
              ) : (
                <div className="flex cursor-pointer items-center gap-1 text-red-600">
                  <TrashIcon className="h-4 w-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
