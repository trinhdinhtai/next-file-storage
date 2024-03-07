import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, SearchIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  searchFormSchema,
  SearchFormValues,
} from "@/lib/validations/search-schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query,
    },
  })

  const {
    control,
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: SearchFormValues) {
    setQuery(values.query)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-2"
      >
        <FormField
          control={control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="your file names" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          size="sm"
          type="submit"
          disabled={isSubmitting}
          className="flex gap-1"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <SearchIcon /> Search
        </Button>
      </form>
    </Form>
  )
}
