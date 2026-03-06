'use client'

import { useState } from 'react'
import { ImageIcon, Loader2, X } from 'lucide-react'

interface MediaUploadProps {
    folder?: string
    value?: string
    label?: string
    onChange: (url: string) => void
}

export default function MediaUpload({ folder = 'uploads', value, label = 'Upload Gambar', onChange }: MediaUploadProps) {
    const [uploading, setUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('folder', folder)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()
            if (data.url) {
                onChange(data.url)
            }
        } catch (error) {
            console.error('Upload failed:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        onChange('')
    }

    return (
        <div>
            <label className="text-white/40 text-xs font-black tracking-widest block mb-2">
                {label.toUpperCase()}
            </label>

            {value ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
                    <img src={value} alt="preview" className="w-full h-full object-cover" />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-yellow-400/40 hover:bg-yellow-400/5 transition-all">
                    {uploading ? (
                        <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                    ) : (
                        <>
                            <ImageIcon className="w-6 h-6 text-white/20 mb-2" />
                            <span className="text-white/30 text-xs font-bold">Klik untuk upload</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    )
}