import { useRef, useState } from 'react'

import { FolderIcon, TrashIcon } from '../../../shared/ui'
import type { CreateTaskAttachment } from '../types'

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AttachmentDropzone({
  attachments,
  onChange,
}: {
  attachments: CreateTaskAttachment[]
  onChange: (next: CreateTaskAttachment[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const next: CreateTaskAttachment[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      name: file.name,
      sizeLabel: formatSize(file.size),
    }))
    onChange([...attachments, ...next])
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragOver(false)
          addFiles(event.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed py-8 text-center ${
          dragOver ? 'border-accent bg-accent-dim' : 'border-line-2 bg-bg-2'
        }`}
      >
        <FolderIcon size={24} className="text-text-3" />
        <p className="text-sm font-semibold text-text">Click to upload or drag and drop</p>
        <p className="text-xs text-text-4">Allowed file formats — jpg, png, jpeg, pdf (Max size 2MB)</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>

      {attachments.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {attachments.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 truncate text-text-2">
                <FolderIcon size={15} className="shrink-0 text-text-3" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-xs text-text-4">{file.sizeLabel}</span>
              </span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => onChange(attachments.filter((a) => a.id !== file.id))}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
              >
                <TrashIcon size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
