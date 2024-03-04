import { z } from "zod"

export const uploadFileFormSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
})

export type UploadFileFormValues = z.infer<typeof uploadFileFormSchema>
