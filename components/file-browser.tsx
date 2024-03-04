import UploadButton from "@/components/upload-button"

interface FileBrowserProps {
  title: string
}

export default function FileBrowser({ title }: FileBrowserProps) {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{title}</h1>
        <UploadButton />
      </div>
    </>
  )
}
