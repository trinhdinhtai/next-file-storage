import { z } from "zod"

export const searchFormSchema = z.object({
  query: z.string().min(0).max(200),
})

export type SearchFormValues = z.infer<typeof searchFormSchema>
