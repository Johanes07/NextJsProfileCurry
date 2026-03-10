'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen, ImageIcon, Loader2, Save, RefreshCw, Upload, X } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────
interface OurStoryData {
    id?: string
    badge: string
    headingLine1: string
    headingLine2: string
    headingLine3: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
    stat1Value: string
    stat1Label: string
    stat2Value: string
    stat2Label: string
    stat3Value: string
    stat3Label: string
    hoursValue: string
    hoursLabel1: string
    hoursLabel2: string
    imageUrl: string
}

const DEFAULT: OurStoryData = {
    badge: 'How It All Started',
    headingLine1: 'FROM A HOME',
    headingLine2: 'KITCHEN TO',
    headingLine3: 'THE WORLD',
    paragraph1: "It started in 2020 when our founder spent an entire weekend perfecting his grandmother's curry recipe. After 100 hours of slow cooking, he discovered something magical — depth of flavor that no shortcut could ever replicate.",
    paragraph2: "What began as a passion project shared with friends quickly grew into Jakarta's most talked-about curry destination. Word spread not through ads, but through the irresistible aroma and unforgettable taste.",
    paragraph3: 'Today, we still follow the same 100-hour process. No compromises. No shortcuts. Just pure, obsessive dedication to the perfect bowl of curry.',
    stat1Value: '2020', stat1Label: 'Founded',
    stat2Value: '3', stat2Label: 'Locations',
    stat3Value: '50K+', stat3Label: 'Bowls Served',
    hoursValue: '100',
    hoursLabel1: 'Hours of dedication',
    hoursLabel2: 'in every single bowl',
    imageUrl: '/images/MAINDISH/AI1.png',
}

// ─── Reusable components ──────────────────────────────────
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

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 transition'
const textareaCls = `${inputCls} resize-none`

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-black text-white/40 tracking-widest mb-2">{label}</label>
            {children}
        </div>
    )
}

// ─── Live Preview ─────────────────────────────────────────
function LivePreview({ data }: { data: OurStoryData }) {
    return (
        <div className="bg-zinc-900 rounded-2xl p-6 grid grid-cols-2 gap-6 items-center">
            {/* Image side */}
            <div className="relative rounded-2xl overflow-hidden h-64 bg-zinc-800">
                {data.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.imageUrl} alt="preview" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-yellow-400 rounded-xl p-4">
                        <p className="text-black font-black text-2xl">{data.hoursValue}</p>
                        <p className="text-black/70 font-bold text-xs">{data.hoursLabel1}</p>
                        <p className="text-black/70 font-bold text-xs">{data.hoursLabel2}</p>
                    </div>
                </div>
            </div>
            {/* Content side */}
            <div className="space-y-3">
                <span className="inline-block bg-yellow-400/10 text-yellow-400 text-xs font-black px-3 py-1.5 rounded-full border border-yellow-400/25">
                    {data.badge}
                </span>
                <h3 className="text-xl font-black text-white leading-tight">
                    {data.headingLine1}
                    <span className="block text-yellow-400">{data.headingLine2}</span>
                    {data.headingLine3}
                </h3>
                <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{data.paragraph1}</p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                        { v: data.stat1Value, l: data.stat1Label },
                        { v: data.stat2Value, l: data.stat2Label },
                        { v: data.stat3Value, l: data.stat3Label },
                    ].map(({ v, l }) => (
                        <div key={l} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                            <p className="text-yellow-400 font-black text-base">{v}</p>
                            <p className="text-white/30 text-xs mt-0.5">{l}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────
export default function OurStoryCMSPage() {
    const [data, setData] = useState<OurStoryData>(DEFAULT)
    const [savedData, setSavedData] = useState<OurStoryData>(DEFAULT)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const isDirty = JSON.stringify(data) !== JSON.stringify(savedData)

    useEffect(() => {
        fetch('/api/admin/our-story')
            .then(r => r.json())
            .then(d => {
                const clean = { ...DEFAULT, ...d }
                setData(clean)
                setSavedData(clean)
            })
            .catch(() => setError('Gagal memuat data'))
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true); setError(null)
        try {
            const res = await fetch('/api/admin/our-story', {
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
            setError(e.message || 'Gagal menyimpan')
        } finally {
            setSaving(false)
        }
    }

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) { setError('File harus berupa gambar'); return }
        setUploading(true); setError(null)
        try {
            const fd = new FormData()
            fd.append('file', file)
            const res = await fetch('/api/upload?folder=our-story', { method: 'POST', body: fd })
            if (!res.ok) throw new Error()
            const { url } = await res.json()
            setData(f => ({ ...f, imageUrl: url }))
        } catch {
            setError('Upload gagal')
        } finally {
            setUploading(false)
        }
    }

    const set = (key: keyof OurStoryData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setData(prev => ({ ...prev, [key]: e.target.value }))
    const upd = (key: keyof OurStoryData, value: string) =>
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
                    <h1 className="text-3xl font-black text-white">Our Story</h1>
                    <p className="text-white/40 text-sm mt-1">Edit konten section Our Story halaman About</p>
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
                    <div className="space-y-4">
                        <Field label="BADGE TEXT">
                            <input className={inputCls} value={data.badge} onChange={set('badge')} placeholder="How It All Started" maxLength={50} />
                        </Field>
                        <div className="grid grid-cols-3 gap-4">
                            <Field label="HEADING LINE 1">
                                <input className={inputCls} value={data.headingLine1} onChange={set('headingLine1')} placeholder="FROM A HOME" maxLength={30} />
                            </Field>
                            <Field label="HEADING LINE 2 (KUNING)">
                                <input className={inputCls} value={data.headingLine2} onChange={set('headingLine2')} placeholder="KITCHEN TO" maxLength={30} />
                            </Field>
                            <Field label="HEADING LINE 3">
                                <input className={inputCls} value={data.headingLine3} onChange={set('headingLine3')} placeholder="THE WORLD" maxLength={30} />
                            </Field>
                        </div>
                    </div>
                </Section>

                {/* Body text */}
                <Section title="BODY TEXT" hint="3 paragraf cerita">
                    <div className="space-y-4">
                        {(['paragraph1', 'paragraph2', 'paragraph3'] as const).map((key, i) => (
                            <Field key={key} label={`PARAGRAF ${i + 1}`}>
                                <textarea
                                    className={textareaCls}
                                    rows={3}
                                    value={data[key]}
                                    onChange={set(key)}
                                    maxLength={400}
                                />
                                <p className="text-right text-xs text-white/20 mt-1">{(data[key] as string).length}/400</p>
                            </Field>
                        ))}
                    </div>
                </Section>

                {/* Stats */}
                <Section title="STATISTIK">
                    <div className="grid grid-cols-3 gap-6">
                        {([
                            { vKey: 'stat1Value', lKey: 'stat1Label', num: 1 },
                            { vKey: 'stat2Value', lKey: 'stat2Label', num: 2 },
                            { vKey: 'stat3Value', lKey: 'stat3Label', num: 3 },
                        ] as const).map(({ vKey, lKey, num }) => (
                            <div key={num} className="space-y-3">
                                <p className="text-xs font-black text-white/20 tracking-widest">STAT {num}</p>
                                <Field label="NILAI">
                                    <input className={inputCls} value={data[vKey]} onChange={set(vKey)} placeholder="2020" maxLength={10} />
                                </Field>
                                <Field label="LABEL">
                                    <input className={inputCls} value={data[lKey]} onChange={set(lKey)} placeholder="Founded" maxLength={20} />
                                </Field>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Floating badge */}
                <Section title="FLOATING BADGE (di atas foto)" hint="Angka & teks kuning">
                    <div className="grid grid-cols-3 gap-4">
                        <Field label="ANGKA">
                            <input className={inputCls} value={data.hoursValue} onChange={set('hoursValue')} placeholder="100" maxLength={10} />
                        </Field>
                        <Field label="TEKS BARIS 1">
                            <input className={inputCls} value={data.hoursLabel1} onChange={set('hoursLabel1')} placeholder="Hours of dedication" maxLength={40} />
                        </Field>
                        <Field label="TEKS BARIS 2">
                            <input className={inputCls} value={data.hoursLabel2} onChange={set('hoursLabel2')} placeholder="in every single bowl" maxLength={40} />
                        </Field>
                    </div>
                </Section>

                {/* Image */}
                <Section title="FOTO SECTION" hint="Drag & drop atau klik untuk upload">
                    <div className="grid grid-cols-2 gap-6">
                        <div
                            className={`relative border-2 border-dashed rounded-2xl transition cursor-pointer ${dragOver ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                            onClick={() => fileRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f) }}
                        >
                            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = '' }} />
                            {data.imageUrl ? (
                                <div className="relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={data.imageUrl} alt="preview" className="w-full h-44 object-cover rounded-2xl opacity-60" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl opacity-0 hover:opacity-100 transition">
                                        {uploading ? <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                                            : <><Upload className="w-5 h-5 text-yellow-400 mb-1" /><span className="text-xs text-yellow-400 font-black">Ganti Gambar</span></>}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-44 flex flex-col items-center justify-center gap-3">
                                    {uploading ? <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                                        : <><ImageIcon className="w-8 h-8 text-white/20" /><p className="text-xs text-white/30 font-black">Drag & drop atau klik</p></>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 flex flex-col justify-between">
                            <Field label="ATAU MASUKKAN URL">
                                <input
                                    className={inputCls}
                                    value={data.imageUrl}
                                    onChange={e => upd('imageUrl', e.target.value)}
                                    placeholder="/images/MAINDISH/AI1.png"
                                />
                            </Field>
                            {data.imageUrl && (
                                <button onClick={() => upd('imageUrl', '')} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition font-black">
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

            </div>
        </div>
    )
}