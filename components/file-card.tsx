import { Doc } from "@/convex/_generated/dataModel"

interface FileCardProps {
  file: Doc<"files">
}

export default function FileCard({ file }: FileCardProps) {
  return <div>FileCard</div>
}
