'use client'

import { useEffect, useState, useRef } from 'react'
import { MapPin, Phone, Mail, Clock, Save, Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle, Plus, Trash2, Loader2 } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
interface ContactFormData {
    id?: string
    badge: string
    headingLine1: string
    headingLine2: string
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

function Field({ label, value, onChange, placeholder, hint, mono = false }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; hint?: string; mono?: boolean
}) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={inputCls + (mono ? ' font-mono tracking-wider' : '')}
            />
            {hint && <p className="text-xs text-white/20 mt-1.5">{hint}</p>}
        </div>
    )
}

// ── Multi-line editor ─────────────────────────────────────────
function LinesEditor({ label, icon: Icon, lines, onChange }: {
    label: string
    icon: React.ElementType
    lines: string[]
    onChange: (lines: string[]) => void
}) {
    function update(i: number, val: string) {
        const next = [...lines]; next[i] = val; onChange(next)
    }
    function remove(i: number) { onChange(lines.filter((_, idx) => idx !== i)) }
    function add() { onChange([...lines, '']) }

    return (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <p className="text-white/40 text-xs font-black tracking-widest mb-4 flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-yellow-400" />
                {label.toUpperCase()}
            </p>
            <div className="space-y-3">
                {lines.map((line, i) => (
                    <div key={i} className="flex gap-2">
                        <input
                            type="text"
                            value={line}
                            onChange={e => update(i, e.target.value)}
                            placeholder={`Baris ${i + 1}...`}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm
                                placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 transition-all"
                        />
                        <button
                            onClick={() => remove(i)}
                            disabled={lines.length <= 1}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/30
                                hover:border-red-500/40 hover:text-red-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={add}
                    className="flex items-center gap-2 text-xs font-bold text-white/30 hover:text-yellow-400 transition-colors mt-1"
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
        <div className={`p-6 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
            <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4 border
                ${isDark
                    ? 'bg-yellow-400/10 text-yellow-500 border-yellow-400/20'
                    : 'bg-yellow-400/10 text-yellow-600 border-yellow-400/20'}`}>
                {data.badge}
            </span>
            <h2 className={`text-3xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.headingLine1}
                <span className="block text-yellow-500">{data.headingLine2}</span>
            </h2>
            <div className="space-y-4">
                {infoCards.map(({ icon: Icon, title, lines }) => (
                    <div key={title} className="flex gap-4">
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
                    <h1 className="text-3xl font-black text-white">Contact Info & Form</h1>
                    <p className="text-white/40 text-sm mt-1">Edit konten info kontak di halaman contact</p>
                </div>
                <div className="flex items-center gap-3">
                    {isDirty && (
                        <span className="hidden sm:flex items-center gap-1.5 text-xs text-yellow-400/80 bg-yellow-400/5 border border-yellow-400/20 rounded-full px-3 py-1.5">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                            Ada perubahan
                        </span>
                    )}
                    <button
                        onClick={() => { setData(originalRef.current); setIsDirty(false) }}
                        disabled={!isDirty}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-black hover:bg-white/10 hover:text-white/60 disabled:opacity-30 transition-all"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 text-black text-sm font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-40 disabled:scale-100"
                    >
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
                        <Field label="TEKS BADGE" value={data.badge} onChange={set('badge')}
                            placeholder="Our Information" hint="Label kecil di atas heading." />
                    </div>

                    {/* Heading */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                        <p className="text-white/40 text-xs font-black tracking-widest mb-4">HEADING UTAMA</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Field label="BARIS PERTAMA" value={data.headingLine1} onChange={set('headingLine1')}
                                placeholder="VISIT US" mono hint="Warna putih" />
                            <Field label="BARIS KEDUA" value={data.headingLine2} onChange={set('headingLine2')}
                                placeholder="ANYTIME" mono hint="Warna kuning / aksen" />
                        </div>
                        <div className="bg-white/5 rounded-xl px-4 py-3 flex items-baseline gap-3">
                            <span className="text-2xl font-black text-white">{data.headingLine1 || '—'}</span>
                            <span className="text-2xl font-black text-yellow-400">{data.headingLine2 || '—'}</span>
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

                {/* ── Preview Panel ───────────────────────────────── */}
                <div className="space-y-4">
                    <div className="sticky top-8">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-white/40 text-xs font-black tracking-widest">LIVE PREVIEW</p>
                            <button
                                onClick={() => setPreviewDark(p => !p)}
                                className="flex items-center gap-2 text-xs font-black text-white/40 bg-white/5 border border-white/10 rounded-xl px-3 py-2 hover:bg-white/10 hover:text-white/60 transition-all"
                            >
                                {previewDark ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                {previewDark ? 'Dark' : 'Light'}
                            </button>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-white/10">
                            <div className="bg-white/5 border-b border-white/5 px-4 py-2.5 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                </div>
                                <span className="text-xs text-white/20 ml-2 font-mono">
                                    /contact — {previewDark ? '🌙 dark' : '☀️ light'}
                                </span>
                            </div>
                            <LivePreview data={data} isDark={previewDark} />
                        </div>

                        <div className="mt-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
                            <p className="text-xs font-black text-yellow-400 mb-2">💡 TIPS</p>
                            <ul className="text-xs text-white/30 space-y-1">
                                <li>• Setiap info card bisa punya lebih dari 1 baris</li>
                                <li>• Klik "+ Tambah baris" untuk menambah teks</li>
                                <li>• Heading sebaiknya HURUF KAPITAL</li>
                                <li>• Toggle preview untuk dark & light mode</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    )
}