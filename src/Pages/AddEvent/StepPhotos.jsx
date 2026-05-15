import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImagePlus, X } from 'lucide-react'

export function StepPhotos({ files, onChange, error }) {
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    )
    onChange([...files, ...newFiles])
  }, [files, onChange])

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index)
    onChange(updated)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    multiple: true,
  })

  return (
    <div>
      {/* Photo grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {files.map((file, idx) => (
            <div key={idx} className="relative aspect-square rounded overflow-hidden border border-accent-warm">
              <img
                src={file.preview}
                alt={`Selected ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeFile(idx)}
                className="absolute top-1 right-1 bg-text/70 text-white rounded-full p-0.5 hover:bg-text/90 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-sienna bg-sienna/5'
            : error
            ? 'border-destructive bg-destructive/5'
            : 'border-accent-warm hover:border-sienna/50'
        }`}
      >
        <input {...getInputProps()} />
        <ImagePlus size={32} className="mx-auto mb-3 text-muted-text" />
        <p className="text-sm text-muted-text">
          {isDragActive
            ? 'Drop photos here...'
            : files.length > 0
            ? 'Add more photos'
            : 'Tap to select photos or drag & drop'}
        </p>
      </div>

      {error && (
        <p className="text-destructive text-xs mt-2">{error}</p>
      )}

      {files.length > 0 && (
        <p className="text-xs text-muted-text mt-3">
          {files.length} photo{files.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}
