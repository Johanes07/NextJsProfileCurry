'use client'

import { useEffect, useRef, useState } from 'react'
import {
    ChefHat, Clock, ImageIcon, Loader2, Save,
    RefreshCw, Upload, X,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────
interface AboutHeroData {
    id?: string
    badgeText: string
    headingLine1: string
    headingLine2: string
    description: string
    imageUrl: string
}

const DEFAULT: AboutHeroData = {
    badgeText: 'OUR STORY',
    headingLine1: 'ABOUT',
    headingLine2: '100HOURS',
    description: 'Born from obsession. Driven by flavor. We believe the best things in life — and curry — cannot be rushed.',
    imageUrl: '/images/MAINDISH/AI8.png',
}

// ─── Reusable Field ───────────────────────────────────────
const Field = ({
    label, value, onChange, placeholder = '', maxLength,
}: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; maxLength?: number
}) => (
    <div>
        <label className="block text-xs font-black text-white/40 tracking-widest mb-2">{label}</label>
        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 transition"
        />
    </div>
)

// ─── Section wrapper ──────────────────────────────────────
function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xs font-black text-white/30 tracking-widest">{title}</h2>
                {hint && <span className="text-xs text-white/20 font-bold">{hint}</span>}
            </div>
            <div className="p-6">{children}</div>
        </div>
    )
}

// ─── Live Preview ─────────────────────────────────────────
function LivePreview({ data }: { data: AboutHeroData }) {
    return (
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-black flex items-center">
            {data.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.imageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black/60" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl" />

            <div className="relative z-10 px-8 py-10 w-full">
                <div className="mb-5 inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-black tracking-widest uppercase">{data.badgeText || '—'}</span>
                </div>
                <h1 className="text-4xl font-black text-white leading-none">
                    {data.headingLine1 || '—'}
                    <span className="block text-yellow-400">{data.headingLine2 || '—'}</span>
                </h1>
                <div className="my-4 flex items-center gap-3">
                    <div className="h-1 w-12 bg-yellow-400 rounded-full" />
                    <div className="h-1 w-6 bg-yellow-400/40 rounded-full" />
                </div>
                <p className="text-white/50 text-sm max-w-sm leading-relaxed">{data.description || '—'}</p>
            </div>

            {/* Locked spinning badge */}
            <div className="absolute bottom-6 right-6 hidden md:block">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-spin" style={{ animationDuration: '10s' }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <defs><path id="prev-c" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" /></defs>
                            <text fontSize="10.5" fontWeight="bold" fill="black" letterSpacing="2">
                                <textPath href="#prev-c">CRAFTED WITH PASSION • EST 2020 •</textPath>
                            </text>
                        </svg>
                    </div>
                    <div className="absolute inset-2.5 bg-black rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────
export default function AboutHeroCMSPage() {
    const [data, setData] = useState<AboutHeroData>(DEFAULT)
    const [savedData, setSavedData] = useState<AboutHeroData>(DEFAULT)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const isDirty = JSON.stringify(data) !== JSON.stringify(savedData)

    // ── Fetch
    useEffect(() => {
        fetch('/api/admin/about-hero')
            .then(r => r.json())
            .then(d => {
                const clean: AboutHeroData = {
                    id: d.id,
                    badgeText: d.badgeText ?? DEFAULT.badgeText,
                    headingLine1: d.headingLine1 ?? DEFAULT.headingLine1,
                    headingLine2: d.headingLine2 ?? DEFAULT.headingLine2,
                    description: d.description ?? DEFAULT.description,
                    imageUrl: d.imageUrl ?? DEFAULT.imageUrl,
                }
                setData(clean)
                setSavedData(clean)
            })
            .catch(() => setError('Gagal memuat data'))
            .finally(() => setLoading(false))
    }, [])

    // ── Save
    const handleSave = async () => {
        setSaving(true); setError(null)
        try {
            const res = await fetch('/api/admin/about-hero', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            setSavedData({ ...data, id: json.id })
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch (e: any) {
            setError(e.message || 'Gagal menyimpan, coba lagi')
        } finally {
            setSaving(false)
        }
    }

    // ── Upload image
    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) { setError('File harus berupa gambar'); return }
        setUploading(true); setError(null)
        try {
            const fd = new FormData()
            fd.append('file', file)
            const res = await fetch('/api/admin/about-hero/upload', { method: 'POST', body: fd })
            if (!res.ok) throw new Error()
            const { url } = await res.json()
            setData(f => ({ ...f, imageUrl: url }))
        } catch {
            setError('Upload gagal')
        } finally {
            setUploading(false)
        }
    }

    const update = (key: keyof AboutHeroData, value: string) =>
        setData(prev => ({ ...prev, [key]: value }))

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
        </div>
    )

    return (
        <div className="p-8 bg-black min-h-screen">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">About Hero</h1>
                    <p className="text-white/40 text-sm mt-1">Edit konten section hero halaman About</p>
                </div>
                <div className="flex items-center gap-3">
                    {isDirty && (
                        <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-2 rounded-xl font-black">
                            Unsaved
                        </span>
                    )}
                    {error && (
                        <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-xl">
                            {error}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                        className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                        {saving
                            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan...</>
                            : saved
                                ? <><Save className="w-4 h-4" /> Tersimpan!</>
                                : <><Save className="w-4 h-4" /> Simpan</>
                        }
                    </button>
                </div>
            </div>

            <div className="space-y-4">

                {/* Badge & Heading */}
                <Section title="BADGE & HEADING">
                    <div className="grid grid-cols-3 gap-4">
                        <Field
                            label="BADGE TEXT"
                            value={data.badgeText}
                            onChange={v => update('badgeText', v)}
                            placeholder="OUR STORY"
                            maxLength={40}
                        />
                        <Field
                            label="HEADING LINE 1"
                            value={data.headingLine1}
                            onChange={v => update('headingLine1', v)}
                            placeholder="ABOUT"
                            maxLength={20}
                        />
                        <Field
                            label="HEADING LINE 2 (KUNING)"
                            value={data.headingLine2}
                            onChange={v => update('headingLine2', v)}
                            placeholder="100HOURS"
                            maxLength={20}
                        />
                    </div>
                </Section>

                {/* Description */}
                <Section title="DESKRIPSI">
                    <div>
                        <label className="block text-xs font-black text-white/40 tracking-widest mb-2">SUBTITLE</label>
                        <textarea
                            value={data.description}
                            onChange={e => update('description', e.target.value)}
                            placeholder="Born from obsession..."
                            rows={3}
                            maxLength={200}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 transition resize-none"
                        />
                        <p className="text-right text-xs text-white/20 mt-1">{data.description.length}/200</p>
                    </div>
                </Section>

                {/* Background Image */}
                <Section title="BACKGROUND IMAGE" hint="Drag & drop atau klik untuk upload">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Drop zone */}
                        <div
                            className={`relative border-2 border-dashed rounded-2xl transition cursor-pointer ${dragOver ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/10 hover:border-white/20 bg-white/5'
                                }`}
                            onClick={() => fileRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f) }}
                        >
                            <input
                                ref={fileRef} type="file" accept="image/*" className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = '' }}
                            />
                            {data.imageUrl ? (
                                <div className="relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={data.imageUrl} alt="bg" className="w-full h-44 object-cover rounded-2xl opacity-60" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl opacity-0 hover:opacity-100 transition">
                                        {uploading
                                            ? <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                                            : <><Upload className="w-5 h-5 text-yellow-400 mb-1" /><span className="text-xs text-yellow-400 font-black">Ganti Gambar</span></>
                                        }
                                    </div>
                                </div>
                            ) : (
                                <div className="h-44 flex flex-col items-center justify-center gap-3">
                                    {uploading
                                        ? <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                                        : <><ImageIcon className="w-8 h-8 text-white/20" /><p className="text-xs text-white/30 font-black">Drag & drop atau klik</p><p className="text-xs text-white/20">PNG, JPG, WEBP</p></>
                                    }
                                </div>
                            )}
                        </div>

                        {/* URL input + remove */}
                        <div className="space-y-4 flex flex-col justify-between">
                            <div>
                                <label className="block text-xs font-black text-white/40 tracking-widest mb-2">ATAU MASUKKAN URL</label>
                                <input
                                    value={data.imageUrl}
                                    onChange={e => update('imageUrl', e.target.value)}
                                    placeholder="/images/MAINDISH/AI8.png"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 transition"
                                />
                            </div>
                            {data.imageUrl && (
                                <button
                                    onClick={() => update('imageUrl', '')}
                                    className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition font-black"
                                >
                                    <X className="w-3.5 h-3.5" /> Hapus Gambar
                                </button>
                            )}
                        </div>
                    </div>
                </Section>

                {/* Live Preview */}
                <Section title="LIVE PREVIEW" hint="Estimasi tampilan dark mode">
                    <LivePreview data={data} />
                </Section>

                {/* Locked element notice */}
                <div className="bg-zinc-950 border border-white/5 rounded-3xl px-6 py-4 flex items-center gap-4">
                    <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-white/30" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-white/30 tracking-widest">ELEMEN TERKUNCI</p>
                        <p className="text-xs text-white/20 mt-0.5">
                            Spinning badge{' '}
                            <span className="text-white/40 font-black">"CRAFTED WITH PASSION • EST 2020 •"</span>
                            {' '}bersifat hardcoded dan tidak dapat diubah melalui CMS.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}