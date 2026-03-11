'use client'

import { useEffect, useState, useRef } from 'react'
import { Flame, Save, Eye, EyeOff, ImageIcon, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

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
        <div className={`
      fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl
      transition-all duration-300 animate-in slide-in-from-bottom-4
      ${type === 'success'
                ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950 border border-red-500/40 text-red-300'
            }
    `}>
            {type === 'success'
                ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            }
            <span className="text-sm font-medium">{message}</span>
        </div>
    )
}

// ── Input Field ───────────────────────────────────────────────
function Field({
    label, value, onChange, placeholder, hint, mono = false, textarea = false
}: {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    hint?: string
    mono?: boolean
    textarea?: boolean
}) {
    const baseClass = `
    w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-white
    placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/60
    focus:ring-2 focus:ring-yellow-400/10 transition-all duration-200
    ${mono ? 'font-mono text-sm tracking-wider' : 'text-sm'}
  `
    return (
        <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {label}
            </label>
            {textarea ? (
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className={baseClass + ' resize-none'}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={baseClass}
                />
            )}
            {hint && <p className="text-xs text-zinc-600">{hint}</p>}
        </div>
    )
}

// ── Live Preview ──────────────────────────────────────────────
function LivePreview({ data, isDark }: { data: MenuHeroData; isDark: boolean }) {
    if (isDark) {
        return (
            <section className="relative min-h-[280px] overflow-hidden bg-black flex items-center rounded-2xl">
                <div className="absolute inset-0">
                    {data.imageUrl && (
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-700 opacity-50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
                </div>
                <div className="relative z-10 px-8 py-10 w-full">
                    <div className="mb-4 inline-flex">
                        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2">
                            <Flame className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-400 text-xs font-bold tracking-wider">{data.badgeText}</span>
                        </div>
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
        <section className="relative min-h-[280px] overflow-hidden bg-amber-50 flex items-center rounded-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-yellow-400 to-transparent" />
            <div className="relative z-10 px-8 py-10 w-full">
                <div className="mb-4 inline-flex">
                    <div className="inline-flex items-center gap-2 bg-yellow-400 rounded-full px-4 py-2 shadow-lg shadow-yellow-400/30">
                        <Flame className="w-3 h-3 text-black" />
                        <span className="text-black text-xs font-black tracking-wider">{data.badgeText}</span>
                    </div>
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

// ── Main CMS Component ────────────────────────────────────────
export default function MenuHeroCMS() {
    const [data, setData] = useState<MenuHeroData>(DEFAULT_DATA)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [previewDark, setPreviewDark] = useState(true)
    const [isDirty, setIsDirty] = useState(false)
    const originalRef = useRef<MenuHeroData>(DEFAULT_DATA)

    // ── Fetch ───────────────────────────────────────────────────
    useEffect(() => {
        fetch('/api/admin/menu/hero')
            .then(r => r.json())
            .then(d => {
                setData(d)
                originalRef.current = d
            })
            .catch(() => showToast('Gagal memuat data', 'error'))
            .finally(() => setLoading(false))
    }, [])

    // ── Dirty check ─────────────────────────────────────────────
    useEffect(() => {
        setIsDirty(JSON.stringify(data) !== JSON.stringify(originalRef.current))
    }, [data])

    // ── Helpers ─────────────────────────────────────────────────
    const set = (key: keyof MenuHeroData) => (val: string) => setData(prev => ({ ...prev, [key]: val }))

    function showToast(message: string, type: 'success' | 'error') {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    function handleReset() {
        setData(originalRef.current)
        setIsDirty(false)
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
            setData(updated)
            originalRef.current = updated
            setIsDirty(false)
            showToast('Konten berhasil disimpan!', 'success')
        } catch {
            showToast('Gagal menyimpan konten', 'error')
        } finally {
            setSaving(false)
        }
    }

    // ── Render ──────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                    <p className="text-zinc-500 text-sm">Memuat konten...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-center">
                            <Flame className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white">Menu Hero</h1>
                            <p className="text-xs text-zinc-500">Edit konten section hero halaman menu</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isDirty && (
                            <span className="hidden sm:flex items-center gap-1.5 text-xs text-yellow-400/80 bg-yellow-400/5 border border-yellow-400/20 rounded-full px-3 py-1.5">
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                                Ada perubahan
                            </span>
                        )}
                        <button
                            onClick={handleReset}
                            disabled={!isDirty}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium
                hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-yellow-400 text-black text-sm font-black
                hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-400/20"
                        >
                            {saving ? (
                                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-8">

                    {/* ── Form Panel ─────────────────────────────────── */}
                    <div className="space-y-6">

                        {/* Badge */}
                        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
                            <h2 className="text-sm font-bold text-zinc-300 mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-yellow-400 rounded-full inline-block" />
                                Badge / Label
                            </h2>
                            <Field
                                label="Teks Badge"
                                value={data.badgeText}
                                onChange={set('badgeText')}
                                placeholder="CRAFTED WITH OBSESSION"
                                hint="Teks yang muncul di badge atas heading. Gunakan HURUF KAPITAL."
                                mono
                            />
                        </div>

                        {/* Heading */}
                        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
                            <h2 className="text-sm font-bold text-zinc-300 mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-yellow-400 rounded-full inline-block" />
                                Heading Utama
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="Baris Pertama"
                                    value={data.headingLine1}
                                    onChange={set('headingLine1')}
                                    placeholder="OUR"
                                    hint="Ditampilkan dalam warna putih (dark) / abu gelap (light)"
                                    mono
                                />
                                <Field
                                    label="Baris Kedua"
                                    value={data.headingLine2}
                                    onChange={set('headingLine2')}
                                    placeholder="MENU"
                                    hint="Ditampilkan dalam warna kuning / aksen"
                                    mono
                                />
                            </div>
                            <div className="mt-4 p-3 bg-zinc-800/50 rounded-xl">
                                <p className="text-xs text-zinc-500 mb-2">Preview heading:</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-black text-white">{data.headingLine1 || '—'}</span>
                                    <span className="text-3xl font-black text-yellow-400">{data.headingLine2 || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Subtitle */}
                        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
                            <h2 className="text-sm font-bold text-zinc-300 mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-yellow-400 rounded-full inline-block" />
                                Subtitle / Deskripsi
                            </h2>
                            <Field
                                label="Teks Subtitle"
                                value={data.subtitle}
                                onChange={set('subtitle')}
                                placeholder="Every dish slow-cooked to perfection..."
                                hint="Deskripsi singkat yang muncul di bawah heading. Maks ~150 karakter direkomendasikan."
                                textarea
                            />
                            <div className="mt-2 flex justify-end">
                                <span className={`text-xs ${data.subtitle.length > 150 ? 'text-red-400' : 'text-zinc-600'}`}>
                                    {data.subtitle.length} / 150
                                </span>
                            </div>
                        </div>

                        {/* Image URL */}
                        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
                            <h2 className="text-sm font-bold text-zinc-300 mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-yellow-400 rounded-full inline-block" />
                                Background Image
                            </h2>
                            <Field
                                label="URL Gambar"
                                value={data.imageUrl || ''}
                                onChange={set('imageUrl')}
                                placeholder="/images/MAINDISH/AI1.png"
                                hint="Path gambar dari folder /public. Contoh: /images/MAINDISH/AI1.png"
                                mono
                            />
                            {data.imageUrl && (
                                <div className="mt-4 relative w-full h-32 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2 text-zinc-600">
                                            <ImageIcon className="w-6 h-6" />
                                            <span className="text-xs font-mono">{data.imageUrl}</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-zinc-900/80 rounded-lg px-2 py-1">
                                        <span className="text-xs text-zinc-400">Preview gambar tersedia di website</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Preview Panel ───────────────────────────────── */}
                    <div className="space-y-4">
                        <div className="sticky top-24">
                            {/* Preview toggle */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Live Preview</h2>
                                <button
                                    onClick={() => setPreviewDark(p => !p)}
                                    className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors
                    bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2"
                                >
                                    {previewDark ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    {previewDark ? 'Dark Mode' : 'Light Mode'}
                                </button>
                            </div>

                            {/* Preview frame */}
                            <div className="rounded-2xl overflow-hidden border border-zinc-800/60 shadow-2xl shadow-black/50">
                                <div className="bg-zinc-900/50 border-b border-zinc-800/60 px-4 py-2.5 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                    </div>
                                    <span className="text-xs text-zinc-600 ml-2 font-mono">
                                        yoursite.com/menu — {previewDark ? '🌙 dark' : '☀️ light'}
                                    </span>
                                </div>
                                <LivePreview data={data} isDark={previewDark} />
                            </div>

                            {/* Info cards */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
                                    <p className="text-xs text-zinc-500 mb-1">Karakter Badge</p>
                                    <p className="text-lg font-bold text-white">{data.badgeText.length}</p>
                                    <p className="text-xs text-zinc-600">karakter</p>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
                                    <p className="text-xs text-zinc-500 mb-1">Karakter Subtitle</p>
                                    <p className={`text-lg font-bold ${data.subtitle.length > 150 ? 'text-red-400' : 'text-white'}`}>
                                        {data.subtitle.length}
                                    </p>
                                    <p className="text-xs text-zinc-600">/ 150 recommended</p>
                                </div>
                            </div>

                            {/* Help card */}
                            <div className="mt-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
                                <p className="text-xs font-bold text-yellow-400 mb-2">💡 Tips</p>
                                <ul className="text-xs text-zinc-500 space-y-1">
                                    <li>• Toggle preview untuk melihat dark & light mode</li>
                                    <li>• Badge text sebaiknya HURUF KAPITAL</li>
                                    <li>• Heading akan tampil dalam 2 baris warna berbeda</li>
                                    <li>• Subtitle maks 150 karakter agar tidak terpotong</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    )
}