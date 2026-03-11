'use client'

import { useEffect, useState, useRef } from 'react'
import { Flame, Save, Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle, Upload, X, Loader2 } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
interface MenuHeroData {
    id?: string
    badgeText: string
    headingLine1: string
    headingLine2: string
    subtitle: string
    imageUrl: string
}

const DEFAULT_DATA: MenuHeroData = {
    badgeText: 'CRAFTED WITH OBSESSION',
    headingLine1: 'OUR',
    headingLine2: 'MENU',
    subtitle: 'Every dish slow-cooked to perfection. Choose your curry, choose your adventure.',
    imageUrl: '/images/MAINDISH/AI1.png',
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl
            ${type === 'success'
                ? 'bg-zinc-950 border border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950 border border-red-500/40 text-red-300'}`}>
            {type === 'success'
                ? <CheckCircle className="w-5 h-5 shrink-0" />
                : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-bold">{message}</span>
        </div>
    )
}

// ── Input helpers ─────────────────────────────────────────────
const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 transition-all'
const labelCls = 'text-white/40 text-xs font-black tracking-widest block mb-2'

function Field({ label, value, onChange, placeholder, hint, mono = false, textarea = false }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; hint?: string; mono?: boolean; textarea?: boolean
}) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            {textarea
                ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    rows={3} className={inputCls + ' resize-none' + (mono ? ' font-mono tracking-wider' : '')} />
                : <input type="text" value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder} className={inputCls + (mono ? ' font-mono tracking-wider' : '')} />}
            {hint && <p className="text-xs text-white/20 mt-1.5">{hint}</p>}
        </div>
    )
}

// ── Live Preview ──────────────────────────────────────────────
function LivePreview({ data, isDark }: { data: MenuHeroData; isDark: boolean }) {
    if (isDark) {
        return (
            <section className="relative min-h-[240px] overflow-hidden bg-black flex items-center">
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
                <div className="relative z-10 px-8 py-10 w-full">
                    <div className="mb-4 inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2">
                        <Flame className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-bold tracking-wider">{data.badgeText}</span>
                    </div>
                    <h1 className="text-5xl font-black text-white leading-none mb-3">
                        {data.headingLine1}
                        <span className="block text-yellow-400">{data.headingLine2}</span>
                    </h1>
                    <div className="mb-4 flex items-center gap-3">
                        <div className="h-1 w-12 bg-yellow-400 rounded-full" />
                        <div className="h-1 w-6 bg-yellow-400/40 rounded-full" />
                    </div>
                    <p className="text-white/50 text-sm max-w-md leading-relaxed">{data.subtitle}</p>
                </div>
            </section>
        )
    }
    return (
        <section className="relative min-h-[240px] overflow-hidden bg-amber-50 flex items-center">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="relative z-10 px-8 py-10 w-full">
                <div className="mb-4 inline-flex items-center gap-2 bg-yellow-400 rounded-full px-4 py-2 shadow-lg shadow-yellow-400/30">
                    <Flame className="w-3 h-3 text-black" />
                    <span className="text-black text-xs font-black tracking-wider">{data.badgeText}</span>
                </div>
                <h1 className="text-5xl font-black leading-none mb-3">
                    <span className="text-gray-900">{data.headingLine1}</span>
                    <span className="block text-yellow-500">{data.headingLine2}</span>
                </h1>
                <div className="mb-4 flex items-center gap-3">
                    <div className="h-1 w-12 bg-yellow-400 rounded-full" />
                    <div className="h-1 w-6 bg-yellow-400/40 rounded-full" />
                </div>
                <p className="text-gray-500 text-sm max-w-md leading-relaxed">{data.subtitle}</p>
            </div>
        </section>
    )
}

// ── Main CMS ──────────────────────────────────────────────────
export default function MenuHeroCMS() {
    const [data, setData] = useState<MenuHeroData>(DEFAULT_DATA)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [previewDark, setPreviewDark] = useState(true)
    const [isDirty, setIsDirty] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const originalRef = useRef<MenuHeroData>(DEFAULT_DATA)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetch('/api/admin/menu/hero')
            .then(r => r.json())
            .then(d => { setData(d); originalRef.current = d })
            .catch(() => showToast('Gagal memuat data', 'error'))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        setIsDirty(JSON.stringify(data) !== JSON.stringify(originalRef.current))
    }, [data])

    const set = (key: keyof MenuHeroData) => (val: string) => setData(prev => ({ ...prev, [key]: val }))

    function showToast(message: string, type: 'success' | 'error') {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    async function handleUpload(file: File) {
        if (!file.type.startsWith('image/')) { showToast('File harus berupa gambar', 'error'); return }
        if (file.size > 5 * 1024 * 1024) { showToast('Ukuran file maks 5MB', 'error'); return }
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (!res.ok) throw new Error()
            const { url } = await res.json()
            setData(prev => ({ ...prev, imageUrl: url }))
            showToast('Gambar berhasil diupload!', 'success')
        } catch { showToast('Gagal upload gambar', 'error') }
        finally { setUploading(false) }
    }

    async function handleSave() {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/menu/hero', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setData(updated); originalRef.current = updated; setIsDirty(false)
            showToast('Konten berhasil disimpan!', 'success')
        } catch { showToast('Gagal menyimpan konten', 'error') }
        finally { setSaving(false) }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-8 bg-black min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Menu Hero</h1>
                    <p className="text-white/40 text-sm mt-1">Edit konten section hero halaman menu</p>
                </div>
                <div className="flex items-center gap-3">
                    {isDirty && (
                        <span className="hidden sm:flex items-center gap-1.5 text-xs text-yellow-400/80 bg-yellow-400/5 border border-yellow-400/20 rounded-full px-3 py-1.5">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                            Ada perubahan
                        </span>
                    )}
                    <button onClick={() => { setData(originalRef.current); setIsDirty(false) }} disabled={!isDirty}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-black hover:bg-white/10 hover:text-white/60 disabled:opacity-30 transition-all">
                        <RefreshCw className="w-3.5 h-3.5" /> Reset
                    </button>
                    <button onClick={handleSave} disabled={saving || !isDirty}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 text-black text-sm font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-40 disabled:scale-100">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_440px] gap-6">

                {/* ── Form Panel ─────────────────────────────────── */}
                <div className="space-y-4">

                    {/* Badge */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                        <p className="text-white/40 text-xs font-black tracking-widest mb-4">BADGE / LABEL</p>
                        <Field label="TEKS BADGE" value={data.badgeText} onChange={set('badgeText')}
                            placeholder="CRAFTED WITH OBSESSION" mono
                            hint="Gunakan HURUF KAPITAL" />
                    </div>

                    {/* Heading */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                        <p className="text-white/40 text-xs font-black tracking-widest mb-4">HEADING UTAMA</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Field label="BARIS PERTAMA" value={data.headingLine1} onChange={set('headingLine1')}
                                placeholder="OUR" mono hint="Warna putih" />
                            <Field label="BARIS KEDUA" value={data.headingLine2} onChange={set('headingLine2')}
                                placeholder="MENU" mono hint="Warna kuning / aksen" />
                        </div>
                        <div className="bg-white/5 rounded-xl px-4 py-3 flex items-baseline gap-3">
                            <span className="text-2xl font-black text-white">{data.headingLine1 || '—'}</span>
                            <span className="text-2xl font-black text-yellow-400">{data.headingLine2 || '—'}</span>
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-white/40 text-xs font-black tracking-widest">SUBTITLE</p>
                            <span className={`text-xs font-bold ${data.subtitle.length > 150 ? 'text-red-400' : 'text-white/20'}`}>
                                {data.subtitle.length} / 150
                            </span>
                        </div>
                        <Field label="TEKS SUBTITLE" value={data.subtitle} onChange={set('subtitle')}
                            placeholder="Every dish slow-cooked to perfection..." textarea
                            hint="Maks ~150 karakter direkomendasikan" />
                    </div>

                    {/* Background Image */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                        <p className="text-white/40 text-xs font-black tracking-widest mb-4">BACKGROUND IMAGE</p>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = '' }} />

                        {data.imageUrl ? (
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                                <div className="relative w-full h-48 bg-white/5">
                                    <img src={data.imageUrl} alt="Background preview" className="w-full h-full object-cover"
                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                                        <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black text-sm font-black rounded-xl hover:scale-105 transition-all disabled:opacity-50">
                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                            Ganti
                                        </button>
                                        <button onClick={() => setData(prev => ({ ...prev, imageUrl: '' }))}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-black rounded-xl hover:bg-red-500 transition-all">
                                            <X className="w-4 h-4" /> Hapus
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-white/5 px-4 py-2.5 flex items-center justify-between">
                                    <span className="text-xs font-mono text-white/30 truncate max-w-xs">{data.imageUrl}</span>
                                    <span className="text-xs text-white/20 shrink-0 ml-2">Hover untuk ganti</span>
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => fileInputRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleUpload(f) }}
                                className={`w-full h-44 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-all
                                    ${dragOver ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                                    ${uploading ? 'pointer-events-none' : ''}`}>
                                {uploading ? (
                                    <><Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                                        <p className="text-sm text-white/40 font-bold">Mengupload...</p></>
                                ) : (
                                    <><div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-white/30" />
                                    </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-white/40">{dragOver ? 'Lepas untuk upload' : 'Klik atau drag & drop'}</p>
                                            <p className="text-xs text-white/20 mt-1">PNG, JPG, WebP — maks 5MB</p>
                                        </div></>
                                )}
                            </div>
                        )}

                        {data.imageUrl && (
                            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-black hover:bg-white/10 hover:text-white/60 disabled:opacity-40 transition-all">
                                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengupload...</> : <><Upload className="w-4 h-4" /> Ganti Gambar</>}
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Preview Panel ───────────────────────────────── */}
                <div className="space-y-4">
                    <div className="sticky top-8">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-white/40 text-xs font-black tracking-widest">LIVE PREVIEW</p>
                            <button onClick={() => setPreviewDark(p => !p)}
                                className="flex items-center gap-2 text-xs font-black text-white/40 bg-white/5 border border-white/10 rounded-xl px-3 py-2 hover:bg-white/10 hover:text-white/60 transition-all">
                                {previewDark ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                {previewDark ? 'Dark' : 'Light'}
                            </button>
                        </div>

                        {/* Preview frame */}
                        <div className="rounded-2xl overflow-hidden border border-white/10">
                            <div className="bg-white/5 border-b border-white/5 px-4 py-2.5 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                </div>
                                <span className="text-xs text-white/20 ml-2 font-mono">
                                    /menu — {previewDark ? '🌙 dark' : '☀️ light'}
                                </span>
                            </div>
                            <LivePreview data={data} isDark={previewDark} />
                        </div>

                        {/* Stats */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                                <p className="text-white/30 text-xs mb-1">Badge</p>
                                <p className="text-2xl font-black text-white">{data.badgeText.length}</p>
                                <p className="text-white/20 text-xs">karakter</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                                <p className="text-white/30 text-xs mb-1">Subtitle</p>
                                <p className={`text-2xl font-black ${data.subtitle.length > 150 ? 'text-red-400' : 'text-white'}`}>{data.subtitle.length}</p>
                                <p className="text-white/20 text-xs">/ 150 recommended</p>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="mt-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
                            <p className="text-xs font-black text-yellow-400 mb-2">💡 TIPS</p>
                            <ul className="text-xs text-white/30 space-y-1">
                                <li>• Toggle preview untuk dark & light mode</li>
                                <li>• Badge text sebaiknya HURUF KAPITAL</li>
                                <li>• Heading tampil 2 baris warna berbeda</li>
                                <li>• Subtitle maks 150 karakter</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    )
}