"use client"

import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useOrganization, useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  uploadFileFormSchema,
  UploadFileFormValues,
} from "@/lib/validations/upload-file-schema"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function UploadButton() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const createFile = useMutation(api.files.createFile)
  const { organization } = useOrganization()
  const user = useUser()

  const [isOpenDialog, setIsOpenDialog] = useState(false)

  const form = useForm<UploadFileFormValues>({
    resolver: zodResolver(uploadFileFormSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })

  const {
    control,
    reset,
    formState: { isSubmitting },
  } = form

  const fileRef = form.register("file")

  if (!organization?.id || !user.isLoaded) return null

  const onSubmit = async (values: UploadFileFormValues) => {
    const postUrl = await generateUploadUrl()
    const fileType = values.file[0].type

    const result = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": fileType,
      },
      body: values.file[0],
    })

    const { storageId } = await result.json()

    const types = {
      "image/png": "image",
      "application/pdf": "pdf",
      "text/csv": "csv",
    } as Record<string, Doc<"files">["type"]>

    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId: organization.id,
        type: types[fileType],
      })

      reset()
      setIsOpenDialog(false)
      toast.success("File uploaded")
    } catch (error) {
      console.log(error)
      toast.error("Failed to upload file")
    }
  }

  const onOpenDialogChange = (isOpen: boolean) => {
    setIsOpenDialog(isOpen)
    reset()
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={onOpenDialogChange}>
      <DialogTrigger asChild>
        <Button>Upload File</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">Upload your file here</DialogTitle>
          <DialogDescription>
            This file will be uploaded to the server and processed. Please make
            sure the file is in the correct format.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png,.csv,.pdf"
                        {...fileRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex gap-1"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
