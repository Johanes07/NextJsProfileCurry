'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, Loader2, FlameKindling, Leaf, Star, Bike, MapPin, Clock, Phone } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type Feature = {
    id: string
    iconName: string
    title: string
    desc: string
}

type CTAData = {
    badge: string
    headline1: string
    headline2: string
    description: string
    address: string
    hours: string
    phone: string
    buttonLabel: string
    features: Feature[]
}

// ── Icon map ──────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
    { name: 'FlameKindling', Icon: FlameKindling, label: 'Flame' },
    { name: 'Leaf', Icon: Leaf, label: 'Leaf' },
    { name: 'Star', Icon: Star, label: 'Star' },
    { name: 'Bike', Icon: Bike, label: 'Bike' },
    { name: 'MapPin', Icon: MapPin, label: 'Location' },
    { name: 'Clock', Icon: Clock, label: 'Clock' },
    { name: 'Phone', Icon: Phone, label: 'Phone' },
]

function getIcon(name: string) {
    return ICON_OPTIONS.find((i) => i.name === name)?.Icon ?? Star
}

// ── Reusable Field ────────────────────────────────────────────────────────
const Field = ({
    label, value, onChange, textarea = false, placeholder = '',
}: {
    label: string
    value: string
    onChange: (v: string) => void
    textarea?: boolean
    placeholder?: string
}) => (
    <div>
        <label className="block text-xs font-black text-white/40 tracking-widest mb-2">{label}</label>
        {textarea ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 resize-none"
            />
        ) : (
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
            />
        )}
    </div>
)

// ── Section Wrapper ───────────────────────────────────────────────────────
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

// ── Main Page ─────────────────────────────────────────────────────────────
export default function CTACMSPage() {
    const [data, setData] = useState<CTAData>({
        badge: '', headline1: '', headline2: '', description: '',
        address: '', hours: '', phone: '', buttonLabel: '',
        features: [
            { id: '1', iconName: 'FlameKindling', title: '', desc: '' },
            { id: '2', iconName: 'Leaf', title: '', desc: '' },
            { id: '3', iconName: 'Star', title: '', desc: '' },
            { id: '4', iconName: 'Bike', title: '', desc: '' },
        ],
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // ── Fetch on mount ──────────────────────────────────────────────────
    useEffect(() => {
        fetch('/api/admin/cta')
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setData(json.data)
                else setError(json.message)
            })
            .catch(() => setError('Gagal memuat data'))
            .finally(() => setLoading(false))
    }, [])

    // ── Save ────────────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true)
        setError(null)
        try {
            const res = await fetch('/api/admin/cta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const json = await res.json()
            if (json.success) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
            else setError(json.message)
        } catch { setError('Gagal menyimpan, coba lagi') }
        finally { setSaving(false) }
    }

    function update(key: keyof CTAData, value: string) {
        setData((prev) => ({ ...prev, [key]: value }))
    }

    function updateFeature(id: string, key: keyof Feature, value: string) {
        setData((prev) => ({
            ...prev,
            features: prev.features.map((f) => f.id === id ? { ...f, [key]: value } : f),
        }))
    }

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
        </div>
    )

    return (
        <div className="p-8 bg-black min-h-screen">
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">CTA Section</h1>
                    <p className="text-white/40 text-sm mt-1">Edit konten blok "Visit Us" di homepage</p>
                </div>
                <div className="flex items-center gap-3">
                    {error && (
                        <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-xl">
                            {error}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:scale-100"
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
                {/* ── Badge & Headline ── */}
                <Section title="BADGE & HEADLINE">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <Field label="BADGE TEXT" value={data.badge} onChange={(v) => update('badge', v)} placeholder="COME FIND US" />
                        <Field label="HEADLINE BARIS 1" value={data.headline1} onChange={(v) => update('headline1', v)} placeholder="ONE BOWL." />
                        <Field label="HEADLINE BARIS 2" value={data.headline2} onChange={(v) => update('headline2', v)} placeholder="FOREVER." />
                    </div>
                    <Field label="DESKRIPSI" value={data.description} onChange={(v) => update('description', v)} textarea placeholder="Tulis deskripsi singkat..." />

                    {/* Mini preview headline */}
                    <div className="mt-4 bg-black/40 rounded-2xl p-4 text-center border border-white/5">
                        <span className="text-yellow-400 text-xs font-bold border border-yellow-400/30 rounded-full px-3 py-1">
                            {data.badge || 'Badge Text'}
                        </span>
                        <p className="text-white font-black text-2xl leading-tight mt-3">{data.headline1 || '—'}</p>
                        <p className="text-white font-black text-2xl leading-tight">{data.headline2 || '—'}</p>
                        <p className="text-white/40 text-xs mt-2 max-w-sm mx-auto">{data.description || 'Deskripsi...'}</p>
                    </div>
                </Section>

                {/* ── Contact Info ── */}
                <Section title="INFORMASI KONTAK">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <Field label="ALAMAT" value={data.address} onChange={(v) => update('address', v)} placeholder="Jl. Kuliner No. 1" />
                        <Field label="JAM BUKA" value={data.hours} onChange={(v) => update('hours', v)} placeholder="11:00 AM – 10:00 PM" />
                        <Field label="NOMOR TELEPON" value={data.phone} onChange={(v) => update('phone', v)} placeholder="+62 21 1234 5678" />
                    </div>
                    <div className="max-w-xs">
                        <Field label="LABEL TOMBOL" value={data.buttonLabel} onChange={(v) => update('buttonLabel', v)} placeholder="Get Directions" />
                    </div>
                </Section>

                {/* ── Feature Cards ── */}
                <Section title="FEATURE CARDS (4 KOTAK)" hint="Klik icon untuk ganti">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3 text-white/20 text-xs font-black tracking-widest w-20">NO</th>
                                <th className="text-left px-4 py-3 text-white/20 text-xs font-black tracking-widest w-56">ICON</th>
                                <th className="text-left px-4 py-3 text-white/20 text-xs font-black tracking-widest">JUDUL</th>
                                <th className="text-left px-4 py-3 text-white/20 text-xs font-black tracking-widest">DESKRIPSI</th>
                                <th className="text-left px-4 py-3 text-white/20 text-xs font-black tracking-widest w-36">PREVIEW</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.features.map((f, i) => {
                                const ActiveIcon = getIcon(f.iconName)
                                return (
                                    <tr key={f.id} className="border-b border-white/5 last:border-0">
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-black text-white/20">CARD {i + 1}</span>
                                        </td>
                                        {/* Icon Picker */}
                                        <td className="px-4 py-4">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {ICON_OPTIONS.map(({ name, Icon, label }) => (
                                                    <button
                                                        key={name}
                                                        onClick={() => updateFeature(f.id, 'iconName', name)}
                                                        title={label}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${f.iconName === name
                                                            ? 'bg-yellow-400 text-black'
                                                            : 'bg-white/5 text-white/40 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        {/* Title */}
                                        <td className="px-4 py-4">
                                            <input
                                                value={f.title}
                                                onChange={(e) => updateFeature(f.id, 'title', e.target.value)}
                                                placeholder="Judul card"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                            />
                                        </td>
                                        {/* Desc */}
                                        <td className="px-4 py-4">
                                            <input
                                                value={f.desc}
                                                onChange={(e) => updateFeature(f.id, 'desc', e.target.value)}
                                                placeholder="Deskripsi singkat"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                            />
                                        </td>
                                        {/* Preview */}
                                        <td className="px-4 py-4">
                                            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 min-w-[110px]">
                                                <ActiveIcon className="w-4 h-4 text-yellow-400 mb-1" strokeWidth={2.5} />
                                                <p className="text-white font-black text-xs leading-tight">{f.title || '—'}</p>
                                                <p className="text-white/30 text-xs mt-0.5 leading-tight">{f.desc || 'desc'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Section>

                {/* ── Full Preview ── */}
                <Section title="FULL PREVIEW">
                    <div className="bg-yellow-400 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-yellow-300/50 rounded-full blur-3xl" />
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-yellow-500/50 rounded-full blur-3xl" />
                        <div className="relative z-10 grid grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="inline-block bg-black/10 text-black text-xs font-black px-3 py-1.5 rounded-full mb-3 tracking-wider">
                                    {data.badge || 'Badge'}
                                </span>
                                <h2 className="text-3xl font-black text-black leading-none mb-2">
                                    {data.headline1 || '—'}
                                    <span className="block">{data.headline2 || '—'}</span>
                                </h2>
                                <p className="text-black/60 text-xs leading-relaxed mb-3">{data.description || '—'}</p>
                                <div className="space-y-1.5 mb-4">
                                    {[
                                        { Icon: MapPin, text: data.address },
                                        { Icon: Clock, text: data.hours },
                                        { Icon: Phone, text: data.phone },
                                    ].map(({ Icon, text }) => (
                                        <div key={text} className="flex items-center gap-2 text-black/70 text-xs">
                                            <Icon className="w-3 h-3 shrink-0" />
                                            <span>{text || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="bg-black text-yellow-400 px-4 py-2 rounded-xl font-black text-xs">
                                    {data.buttonLabel || 'Button'} →
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {data.features.map((f) => {
                                    const Icon = getIcon(f.iconName)
                                    return (
                                        <div key={f.id} className="bg-black/10 rounded-xl p-3">
                                            <div className="w-7 h-7 bg-black/10 rounded-lg flex items-center justify-center mb-2">
                                                <Icon className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                                            </div>
                                            <p className="font-black text-black text-xs mb-0.5">{f.title || '—'}</p>
                                            <p className="text-black/50 text-xs">{f.desc || '—'}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    )
}