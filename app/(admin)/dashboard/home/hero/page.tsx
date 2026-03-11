'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, Loader2 } from 'lucide-react'

type HeroData = {
    badgeText: string
    headingLine1: string
    headingLine2: string
    headingLine3: string
    subtitle: string
    estYear: string
    stat1Value: string
    stat1Label: string
    stat1Suffix: string
    stat2Value: string
    stat2Label: string
    stat2Suffix: string
    stat3Value: string
    stat3Label: string
    stat3Suffix: string
}

// ✅ Dipindah ke luar komponen
const Field = ({
    label, field, textarea = false, placeholder = '', data, setData
}: {
    label: string
    field: keyof HeroData
    textarea?: boolean
    placeholder?: string
    data: HeroData
    setData: React.Dispatch<React.SetStateAction<HeroData>>
}) => (
    <div>
        <label className="block text-xs font-black text-white/40 tracking-widest mb-2">{label}</label>
        {textarea ? (
            <textarea
                value={data[field]}
                onChange={e => setData(prev => ({ ...prev, [field]: e.target.value }))}
                rows={3}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 resize-none"
            />
        ) : (
            <input
                value={data[field]}
                onChange={e => setData(prev => ({ ...prev, [field]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
            />
        )}
    </div>
)

export default function HeroCMSPage() {
    const [data, setData] = useState<HeroData>({
        badgeText: '', headingLine1: '', headingLine2: '', headingLine3: '',
        subtitle: '', estYear: '',
        stat1Value: '', stat1Label: '', stat1Suffix: '',
        stat2Value: '', stat2Label: '', stat2Suffix: '',
        stat3Value: '', stat3Label: '', stat3Suffix: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        fetch('/api/admin/hero')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        await fetch('/api/admin/hero', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const f = { data, setData } // shorthand biar tidak verbose

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
        </div>
    )

    return (
        <div className="p-8 bg-black min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Hero Section</h1>
                    <p className="text-white/40 text-sm mt-1">Edit konten halaman utama website</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:scale-100">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Tersimpan!' : saving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>

            <div className="space-y-4">
                {/* Badge & Year */}
                <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <h2 className="text-xs font-black text-white/30 tracking-widest">BADGE & TAHUN</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Field {...f} label="BADGE TEXT" field="badgeText" placeholder="contoh: Authentic Japanese Curry" />
                            <Field {...f} label="EST. TAHUN" field="estYear" placeholder="contoh: 2018" />
                        </div>
                    </div>
                </div>

                {/* Heading */}
                <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xs font-black text-white/30 tracking-widest">HEADING</h2>
                        <span className="text-xs text-white/20 font-bold">Baris ke-2 otomatis berwarna kuning</span>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-4">
                            <Field {...f} label="BARIS 1" field="headingLine1" placeholder="contoh: Taste The" />
                            <Field {...f} label="BARIS 2 (KUNING)" field="headingLine2" placeholder="contoh: Black Curry" />
                            <Field {...f} label="BARIS 3" field="headingLine3" placeholder="contoh: Experience" />
                        </div>
                        <div className="mt-4 bg-black/40 rounded-2xl p-4 text-center">
                            <p className="text-white font-black text-xl leading-tight">{data.headingLine1 || <span className="text-white/10">Baris 1</span>}</p>
                            <p className="text-yellow-400 font-black text-xl leading-tight">{data.headingLine2 || <span className="text-yellow-400/10">Baris 2</span>}</p>
                            <p className="text-white font-black text-xl leading-tight">{data.headingLine3 || <span className="text-white/10">Baris 3</span>}</p>
                        </div>
                    </div>
                </div>

                {/* Subtitle */}
                <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <h2 className="text-xs font-black text-white/30 tracking-widest">SUBTITLE</h2>
                    </div>
                    <div className="p-6">
                        <Field {...f} label="TEKS SUBTITLE" field="subtitle" textarea placeholder="contoh: Nikmati cita rasa kari hitam otentik Jepang..." />
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <h2 className="text-xs font-black text-white/30 tracking-widest">STATISTIK (3 KOTAK)</h2>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-3 text-white/20 text-xs font-black tracking-widest w-24"></th>
                                <th className="text-left px-6 py-3 text-white/20 text-xs font-black tracking-widest">NILAI</th>
                                <th className="text-left px-6 py-3 text-white/20 text-xs font-black tracking-widest">SUFFIX</th>
                                <th className="text-left px-6 py-3 text-white/20 text-xs font-black tracking-widest">LABEL</th>
                                <th className="text-left px-6 py-3 text-white/20 text-xs font-black tracking-widest">PREVIEW</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { v: 'stat1Value', l: 'stat1Label', s: 'stat1Suffix', n: 'STAT 1' },
                                { v: 'stat2Value', l: 'stat2Label', s: 'stat2Suffix', n: 'STAT 2' },
                                { v: 'stat3Value', l: 'stat3Label', s: 'stat3Suffix', n: 'STAT 3' },
                            ].map(({ v, l, s, n }) => (
                                <tr key={n} className="border-b border-white/5 last:border-0">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-white/20">{n}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            value={data[v as keyof HeroData]}
                                            onChange={e => setData(prev => ({ ...prev, [v]: e.target.value }))}
                                            placeholder="100"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            value={data[s as keyof HeroData]}
                                            onChange={e => setData(prev => ({ ...prev, [s]: e.target.value }))}
                                            placeholder="+"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            value={data[l as keyof HeroData]}
                                            onChange={e => setData(prev => ({ ...prev, [l]: e.target.value }))}
                                            placeholder="Menu Items"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-[90px] inline-block">
                                            <p className="text-yellow-400 font-black text-base leading-tight">
                                                {data[v as keyof HeroData] || '—'}
                                                <span className="text-sm">{data[s as keyof HeroData]}</span>
                                            </p>
                                            <p className="text-white/30 text-xs">{data[l as keyof HeroData] || 'label'}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Full Preview */}
                <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <h2 className="text-xs font-black text-white/30 tracking-widest">FULL PREVIEW</h2>
                    </div>
                    <div className="p-6">
                        <div className="bg-black rounded-2xl p-8 text-center border border-white/5">
                            <span className="text-yellow-400 text-xs font-bold border border-yellow-400/30 rounded-full px-3 py-1">
                                {data.badgeText || 'Badge Text'}
                            </span>
                            <div className="mt-4">
                                <p className="text-white font-black text-3xl leading-tight">{data.headingLine1 || '—'}</p>
                                <p className="text-yellow-400 font-black text-3xl leading-tight">{data.headingLine2 || '—'}</p>
                                <p className="text-white font-black text-3xl leading-tight">{data.headingLine3 || '—'}</p>
                            </div>
                            <p className="text-white/30 text-xs mt-1">EST. {data.estYear || '—'}</p>
                            <p className="text-white/40 text-sm mt-3 max-w-sm mx-auto">{data.subtitle || 'Subtitle...'}</p>
                            <div className="flex justify-center gap-3 mt-6">
                                {[
                                    { v: data.stat1Value, s: data.stat1Suffix, l: data.stat1Label },
                                    { v: data.stat2Value, s: data.stat2Suffix, l: data.stat2Label },
                                    { v: data.stat3Value, s: data.stat3Suffix, l: data.stat3Label },
                                ].map(({ v, s, l }, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 min-w-[90px]">
                                        <p className="text-yellow-400 font-black text-xl">{v || '—'}<span className="text-sm">{s}</span></p>
                                        <p className="text-white/30 text-xs">{l || 'label'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}