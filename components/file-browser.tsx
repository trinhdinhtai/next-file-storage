"use client"

import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useOrganization, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { GridIcon, Loader2, RowsIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileCard from "@/components/file-card"
import UploadButton from "@/components/upload-button"

interface FileBrowserProps {
  title: string
}

export default function FileBrowser({ title }: FileBrowserProps) {
  const { organization } = useOrganization()

  const [query, setQuery] = useState("")
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all")

  const files = useQuery(
    api.files.getFiles,
    organization?.id
      ? {
          orgId: organization?.id,
          type: type === "all" ? undefined : type,
          query,
        }
      : "skip"
  )

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{title}</h1>
        <UploadButton />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between">
          <TabsList className="mb-2">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Label htmlFor="type-select">Type Filter</Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any)
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {}
        </div>

        {files ? (
          <TabsContent value="grid">
            <div className="grid grid-cols-3 gap-4">
              {files?.map((file) => {
                return <FileCard key={file._id} file={file} />
              })}
            </div>
          </TabsContent>
        ) : (
          <div className="mt-24 flex w-full flex-col items-center gap-8">
            <Loader2 className="h-16 w-16 animate-spin" />
            <div className="text-xl">Loading your files...</div>
          </div>
        )}
      </Tabs>
    </>
  )
}
