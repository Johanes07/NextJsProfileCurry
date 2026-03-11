'use client'

import { useEffect, useState, useRef } from 'react'
import { MapPin, Phone, Mail, Clock, Save, Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
interface ContactFormData {
    id?: string
    // Heading
    badge: string
    headingLine1: string
    headingLine2: string
    // Info cards
    locationLines: string[]
    hoursLines: string[]
    phoneLines: string[]
    emailLines: string[]
}

const DEFAULT_DATA: ContactFormData = {
    badge: 'Our Information',
    headingLine1: 'VISIT US',
    headingLine2: 'ANYTIME',
    locationLines: ['Jl. Kuliner No. 1', 'Jakarta Selatan, 12345'],
    hoursLines: ['Mon – Fri: 11:00 AM – 10:00 PM', 'Sat – Sun: 10:00 AM – 11:00 PM'],
    phoneLines: ['+62 21 1234 5678', '+62 812 3456 7890'],
    emailLines: ['hello@100hourscurry.com', 'reservation@100hourscurry.com'],
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl
      transition-all duration-300 animate-in slide-in-from-bottom-4
      ${type === 'success' ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' : 'bg-red-950 border border-red-500/40 text-red-300'}`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
            <span className="text-sm font-medium">{message}</span>
        </div>
    )
}

// ── Single Field ──────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, hint, mono = false }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; hint?: string; mono?: boolean
}) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
            <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className={`w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600
          focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10 transition-all duration-200
          ${mono ? 'font-mono text-sm tracking-wider' : 'text-sm'}`} />
            {hint && <p className="text-xs text-zinc-600">{hint}</p>}
        </div>
    )
}

// ── Multi-line editor (array of strings) ──────────────────────
function LinesEditor({ label, icon: Icon, lines, onChange, color = 'yellow' }: {
    label: string
    icon: React.ElementType
    lines: string[]
    onChange: (lines: string[]) => void
    color?: string
}) {
    function update(i: number, val: string) {
        const next = [...lines]; next[i] = val; onChange(next)
    }
    function remove(i: number) {
        onChange(lines.filter((_, idx) => idx !== i))
    }
    function add() {
        onChange([...lines, ''])
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-zinc-300 mb-5 flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-4 h-4 text-yellow-400" />
                </div>
                {label}
            </h2>
            <div className="space-y-3">
                {lines.map((line, i) => (
                    <div key={i} className="flex gap-2">
                        <input
                            type="text"
                            value={line}
                            onChange={e => update(i, e.target.value)}
                            placeholder={`Baris ${i + 1}...`}
                            className="flex-1 bg-zinc-800 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-white text-sm
                placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10 transition-all"
                        />
                        <button
                            onClick={() => remove(i)}
                            disabled={lines.length <= 1}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-700 text-zinc-500
                hover:border-red-500/50 hover:text-red-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={add}
                    className="flex items-center gap-2 text-xs text-zinc-500 hover:text-yellow-400 transition-colors mt-1"
                >
                    <Plus className="w-3.5 h-3.5" /> Tambah baris
                </button>
            </div>
        </div>
    )
}

// ── Live Preview ──────────────────────────────────────────────
function LivePreview({ data, isDark }: { data: ContactFormData; isDark: boolean }) {
    const infoCards = [
        { icon: MapPin, title: 'Location', lines: data.locationLines },
        { icon: Clock, title: 'Opening Hours', lines: data.hoursLines },
        { icon: Phone, title: 'Phone', lines: data.phoneLines },
        { icon: Mail, title: 'Email', lines: data.emailLines },
    ]

    return (
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-zinc-950' : 'bg-white border border-gray-200'}`}>
            <span className="inline-block bg-yellow-400/10 text-yellow-500 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-yellow-400/20">
                {data.badge}
            </span>
            <h2 className={`text-3xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.headingLine1}
                <span className="block text-yellow-500">{data.headingLine2}</span>
            </h2>
            <div className="space-y-4">
                {infoCards.map(({ icon: Icon, title, lines }) => (
                    <div key={title} className="flex gap-4 group">
                        <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div>
                            <p className={`font-black text-sm mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
                            {lines.map((line, i) => (
                                <p key={i} className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{line || '—'}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Main CMS ──────────────────────────────────────────────────
export default function ContactFormCMS() {
    const [data, setData] = useState<ContactFormData>(DEFAULT_DATA)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [previewDark, setPreviewDark] = useState(true)
    const [isDirty, setIsDirty] = useState(false)
    const originalRef = useRef<ContactFormData>(DEFAULT_DATA)

    useEffect(() => {
        fetch('/api/admin/contact/form')
            .then(r => r.json())
            .then(d => { setData(d); originalRef.current = d })
            .catch(() => showToast('Gagal memuat data', 'error'))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        setIsDirty(JSON.stringify(data) !== JSON.stringify(originalRef.current))
    }, [data])

    function showToast(message: string, type: 'success' | 'error') {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    function handleReset() { setData(originalRef.current); setIsDirty(false) }

    const set = (key: keyof ContactFormData) => (val: string) =>
        setData(prev => ({ ...prev, [key]: val }))

    const setLines = (key: keyof ContactFormData) => (lines: string[]) =>
        setData(prev => ({ ...prev, [key]: lines }))

    async function handleSave() {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/contact/form', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setData(updated); originalRef.current = updated
            setIsDirty(false)
            showToast('Konten berhasil disimpan!', 'success')
        } catch {
            showToast('Gagal menyimpan konten', 'error')
        } finally {
            setSaving(false)
        }
    }

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
                            <Mail className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white">Contact Info & Form</h1>
                            <p className="text-xs text-zinc-500">Edit konten info kontak di halaman contact</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {isDirty && (
                            <span className="hidden sm:flex items-center gap-1.5 text-xs text-yellow-400/80 bg-yellow-400/5 border border-yellow-400/20 rounded-full px-3 py-1.5">
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                                Ada perubahan
                            </span>
                        )}
                        <button onClick={handleReset} disabled={!isDirty}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium
                hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            <RefreshCw className="w-3.5 h-3.5" /> Reset
                        </button>
                        <button onClick={handleSave} disabled={saving || !isDirty}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-yellow-400 text-black text-sm font-black
                hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-400/20">
                            {saving
                                ? <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                : <Save className="w-3.5 h-3.5" />}
                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">

                    {/* Form Panel */}
                    <div className="space-y-6">

                        {/* Heading */}
                        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
                            <h2 className="text-sm font-bold text-zinc-300 mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-yellow-400 rounded-full inline-block" />
                                Section Heading
                            </h2>
                            <div className="space-y-4">
                                <Field label="Teks Badge" value={data.badge} onChange={set('badge')}
                                    placeholder="Our Information" hint="Label kecil di atas heading." />
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Baris Pertama" value={data.headingLine1} onChange={set('headingLine1')}
                                        placeholder="VISIT US" hint="Warna putih / abu gelap" mono />
                                    <Field label="Baris Kedua" value={data.headingLine2} onChange={set('headingLine2')}
                                        placeholder="ANYTIME" hint="Warna kuning / aksen" mono />
                                </div>
                                <div className="p-3 bg-zinc-800/50 rounded-xl">
                                    <p className="text-xs text-zinc-500 mb-1.5">Preview heading:</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-2xl font-black text-white">{data.headingLine1 || '—'}</span>
                                        <span className="text-2xl font-black text-yellow-400">{data.headingLine2 || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <LinesEditor label="Location" icon={MapPin}
                            lines={data.locationLines} onChange={setLines('locationLines')} />
                        <LinesEditor label="Opening Hours" icon={Clock}
                            lines={data.hoursLines} onChange={setLines('hoursLines')} />
                        <LinesEditor label="Phone" icon={Phone}
                            lines={data.phoneLines} onChange={setLines('phoneLines')} />
                        <LinesEditor label="Email" icon={Mail}
                            lines={data.emailLines} onChange={setLines('emailLines')} />
                    </div>

                    {/* Preview Panel */}
                    <div className="space-y-4">
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Live Preview</h2>
                                <button onClick={() => setPreviewDark(p => !p)}
                                    className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors
                    bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2">
                                    {previewDark ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    {previewDark ? 'Dark Mode' : 'Light Mode'}
                                </button>
                            </div>

                            <div className="rounded-2xl overflow-hidden border border-zinc-800/60 shadow-2xl shadow-black/50">
                                <div className="bg-zinc-900/50 border-b border-zinc-800/60 px-4 py-2.5 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                    </div>
                                    <span className="text-xs text-zinc-600 ml-2 font-mono">
                                        yoursite.com/contact — {previewDark ? '🌙 dark' : '☀️ light'}
                                    </span>
                                </div>
                                <LivePreview data={data} isDark={previewDark} />
                            </div>

                            <div className="mt-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
                                <p className="text-xs font-bold text-yellow-400 mb-2">💡 Tips</p>
                                <ul className="text-xs text-zinc-500 space-y-1">
                                    <li>• Setiap info card bisa punya lebih dari 1 baris</li>
                                    <li>• Klik "+ Tambah baris" untuk menambah teks</li>
                                    <li>• Heading sebaiknya HURUF KAPITAL</li>
                                    <li>• Toggle preview untuk melihat dark & light mode</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    )
}