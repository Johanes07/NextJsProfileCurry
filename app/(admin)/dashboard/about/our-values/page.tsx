'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, Loader2, Plus, Trash2, GripVertical, Timer, Leaf, Heart, FlaskConical, Star, Zap, Shield, Globe, Award, Coffee } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────
type ValueItem = {
    id: string
    icon: string
    title: string
    desc: string
}

type OurValuesData = {
    badge: string
    headingLine1: string
    headingLine2: string
    values: ValueItem[]
}

// ── Available Icons ───────────────────────────────────────────────────────
const ICON_OPTIONS = [
    { name: 'Timer', Icon: Timer },
    { name: 'Leaf', Icon: Leaf },
    { name: 'Heart', Icon: Heart },
    { name: 'FlaskConical', Icon: FlaskConical },
    { name: 'Star', Icon: Star },
    { name: 'Zap', Icon: Zap },
    { name: 'Shield', Icon: Shield },
    { name: 'Globe', Icon: Globe },
    { name: 'Award', Icon: Award },
    { name: 'Coffee', Icon: Coffee },
]

const getIcon = (name: string) => {
    const found = ICON_OPTIONS.find((i) => i.name === name)
    return found ? found.Icon : Timer
}

// ── Reusable Components ───────────────────────────────────────────────────
const Field = ({
    label, value, onChange, placeholder = '', multiline = false,
}: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean
}) => (
    <div>
        <label className="block text-xs font-black text-white/40 tracking-widest mb-2">{label}</label>
        {multiline ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
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

// ── Value Card Editor ─────────────────────────────────────────────────────
function ValueCardEditor({
    item, index, total, onChange, onDelete, onMove,
}: {
    item: ValueItem
    index: number
    total: number
    onChange: (updated: ValueItem) => void
    onDelete: () => void
    onMove: (dir: 'up' | 'down') => void
}) {
    const Icon = getIcon(item.icon)

    return (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 group">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-white/20" />
                    <div className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="text-xs font-black text-white/30 tracking-widest">VALUE #{index + 1}</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onMove('up')}
                        disabled={index === 0}
                        className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        <span className="text-xs">↑</span>
                    </button>
                    <button
                        onClick={() => onMove('down')}
                        disabled={index === total - 1}
                        className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        <span className="text-xs">↓</span>
                    </button>
                    <button
                        onClick={onDelete}
                        className="w-7 h-7 bg-red-400/10 rounded-lg flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-400/20 transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Icon Picker */}
            <div className="mb-4">
                <label className="block text-xs font-black text-white/40 tracking-widest mb-2">ICON</label>
                <div className="flex flex-wrap gap-2">
                    {ICON_OPTIONS.map(({ name, Icon: OptionIcon }) => (
                        <button
                            key={name}
                            onClick={() => onChange({ ...item, icon: name })}
                            title={name}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${item.icon === name
                                ? 'bg-yellow-400/20 border border-yellow-400/50 text-yellow-400'
                                : 'bg-white/5 border border-white/10 text-white/30 hover:bg-white/10 hover:text-white/60'
                                }`}
                        >
                            <OptionIcon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Field
                    label="TITLE"
                    value={item.title}
                    onChange={(v) => onChange({ ...item, title: v })}
                    placeholder="No Shortcuts"
                />
                <Field
                    label="DESCRIPTION"
                    value={item.desc}
                    onChange={(v) => onChange({ ...item, desc: v })}
                    placeholder="Describe this value..."
                    multiline
                />
            </div>
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function OurValuesCMSPage() {
    const [data, setData] = useState<OurValuesData>({
        badge: 'What We Stand For',
        headingLine1: 'OUR',
        headingLine2: 'VALUES',
        values: [
            { id: '1', icon: 'Timer', title: 'No Shortcuts', desc: 'We cook every batch for exactly 100 hours. Not 99, not 101. The process is sacred and non-negotiable.' },
            { id: '2', icon: 'Leaf', title: 'Finest Ingredients', desc: 'We source 27 hand-selected spices from trusted farms. Quality ingredients are the foundation of great curry.' },
            { id: '3', icon: 'Heart', title: 'Made with Love', desc: 'Every bowl is prepared with genuine care. We treat each serving as if cooking for our own family.' },
            { id: '4', icon: 'FlaskConical', title: 'Obsessive Quality', desc: 'Every batch is tasted and adjusted by our head chef. Consistency is our promise to every customer.' },
        ],
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/admin/our-values')
            .then((r) => r.json())
            .then((json) => {
                if (json.success && json.data) {
                    setData({
                        badge: json.data.badge ?? 'What We Stand For',
                        headingLine1: json.data.headingLine1 ?? 'OUR',
                        headingLine2: json.data.headingLine2 ?? 'VALUES',
                        values: json.data.values ?? [],
                    })
                } else setError(json.message)
            })
            .catch(() => setError('Gagal memuat data'))
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true); setError(null)
        try {
            const res = await fetch('/api/admin/our-values', {
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

    const updateMeta = (key: keyof Omit<OurValuesData, 'values'>, val: string) =>
        setData((prev) => ({ ...prev, [key]: val }))

    const updateValue = (id: string, updated: ValueItem) =>
        setData((prev) => ({ ...prev, values: prev.values.map((v) => (v.id === id ? updated : v)) }))

    const deleteValue = (id: string) =>
        setData((prev) => ({ ...prev, values: prev.values.filter((v) => v.id !== id) }))

    const moveValue = (index: number, dir: 'up' | 'down') => {
        setData((prev) => {
            const arr = [...prev.values]
            const target = dir === 'up' ? index - 1 : index + 1
            if (target < 0 || target >= arr.length) return prev;
            [arr[index], arr[target]] = [arr[target], arr[index]]
            return { ...prev, values: arr }
        })
    }

    const addValue = () => {
        setData((prev) => ({
            ...prev,
            values: [
                ...prev.values,
                { id: Date.now().toString(), icon: 'Star', title: 'New Value', desc: 'Describe this value...' },
            ],
        }))
    }

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
                    <h1 className="text-3xl font-black text-white">Our Values</h1>
                    <p className="text-white/40 text-sm mt-1">Edit heading, badge, dan kartu nilai-nilai kami</p>
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
                {/* Section Heading */}
                <Section title="SECTION HEADING">
                    <div className="grid grid-cols-3 gap-4">
                        <Field label="BADGE TEXT" value={data.badge} onChange={(v) => updateMeta('badge', v)} placeholder="What We Stand For" />
                        <Field label="HEADING LINE 1" value={data.headingLine1} onChange={(v) => updateMeta('headingLine1', v)} placeholder="OUR" />
                        <Field label="HEADING LINE 2 (AKSEN)" value={data.headingLine2} onChange={(v) => updateMeta('headingLine2', v)} placeholder="VALUES" />
                    </div>
                </Section>

                {/* Value Cards */}
                <Section title="VALUE CARDS" hint={`${data.values.length} ITEM`}>
                    <div className="space-y-3 mb-4">
                        {data.values.map((item, index) => (
                            <ValueCardEditor
                                key={item.id}
                                item={item}
                                index={index}
                                total={data.values.length}
                                onChange={(updated) => updateValue(item.id, updated)}
                                onDelete={() => deleteValue(item.id)}
                                onMove={(dir) => moveValue(index, dir)}
                            />
                        ))}
                    </div>
                    <button
                        onClick={addValue}
                        className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-yellow-400/40 hover:bg-yellow-400/5 text-white/30 hover:text-yellow-400 rounded-2xl py-4 text-sm font-black tracking-widest transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        TAMBAH VALUE
                    </button>
                </Section>

                {/* Preview */}
                <Section title="PREVIEW">
                    <div className="bg-black border border-yellow-400/10 rounded-2xl py-12 px-8">
                        {/* Heading */}
                        <div className="text-center mb-10">
                            <span className="inline-block bg-yellow-400/10 text-yellow-500 text-xs font-bold px-4 py-2 rounded-full mb-4 border border-yellow-400/20">
                                {data.badge || 'What We Stand For'}
                            </span>
                            <h2 className="text-3xl font-black text-white">
                                {data.headingLine1 || 'OUR'}
                                <span className="text-yellow-500"> {data.headingLine2 || 'VALUES'}</span>
                            </h2>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {data.values.map((item) => {
                                const Icon = getIcon(item.icon)
                                return (
                                    <div key={item.id} className="bg-zinc-950 border border-white/5 rounded-2xl p-6">
                                        <div className="w-11 h-11 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-4">
                                            <Icon className="w-5 h-5 text-yellow-500" />
                                        </div>
                                        <h3 className="text-sm font-black text-white mb-2">{item.title || '—'}</h3>
                                        <p className="text-xs text-white/40 leading-relaxed">{item.desc || '—'}</p>
                                    </div>
                                )
                            })}
                            {data.values.length === 0 && (
                                <div className="col-span-4 text-center py-8 text-white/20 text-sm">
                                    Belum ada value card. Klik tombol "Tambah Value" di atas.
                                </div>
                            )}
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    )
}