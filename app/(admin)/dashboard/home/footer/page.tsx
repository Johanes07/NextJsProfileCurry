'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, Loader2, Instagram, Facebook, Youtube, Music2 } from 'lucide-react'

type FooterData = {
    siteName: string
    tagline: string
    email: string
    phone: string
    address: string
    openHours: string
    instagramUrl: string
    facebookUrl: string
    youtubeUrl: string
    tiktokUrl: string
}

// ── Reusable Field ────────────────────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder = '' }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) => (
    <div>
        <label className="block text-xs font-black text-white/40 tracking-widest mb-2">{label}</label>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
        />
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

// ── Main Page ─────────────────────────────────────────────────────────────
export default function FooterCMSPage() {
    const [data, setData] = useState<FooterData>({
        siteName: '', tagline: '', email: '', phone: '',
        address: '', openHours: '', instagramUrl: '',
        facebookUrl: '', youtubeUrl: '', tiktokUrl: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/admin/footer')
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setData({
                    siteName: json.data.siteName ?? '',
                    tagline: json.data.tagline ?? '',
                    email: json.data.email ?? '',
                    phone: json.data.phone ?? '',
                    address: json.data.address ?? '',
                    openHours: json.data.openHours ?? '',
                    instagramUrl: json.data.instagramUrl ?? '',
                    facebookUrl: json.data.facebookUrl ?? '',
                    youtubeUrl: json.data.youtubeUrl ?? '',
                    tiktokUrl: json.data.tiktokUrl ?? '',
                })
                else setError(json.message)
            })
            .catch(() => setError('Gagal memuat data'))
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true); setError(null)
        try {
            const res = await fetch('/api/admin/footer', {
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

    const update = (key: keyof FooterData, value: string) =>
        setData((prev) => ({ ...prev, [key]: value }))

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
                    <h1 className="text-3xl font-black text-white">Footer</h1>
                    <p className="text-white/40 text-sm mt-1">Edit informasi kontak, sosial media, dan branding</p>
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
                {/* Branding */}
                <Section title="BRANDING">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="NAMA SITUS" value={data.siteName} onChange={(v) => update('siteName', v)} placeholder="100Hours Curry" />
                        <Field label="TAGLINE" value={data.tagline} onChange={(v) => update('tagline', v)} placeholder="Crafted with passion..." />
                    </div>
                </Section>

                {/* Kontak */}
                <Section title="INFORMASI KONTAK">
                    <div className="grid grid-cols-3 gap-4">
                        <Field label="ALAMAT" value={data.address} onChange={(v) => update('address', v)} placeholder="Jl. Kuliner No. 1" />
                        <Field label="TELEPON" value={data.phone} onChange={(v) => update('phone', v)} placeholder="+62 21 1234 5678" />
                        <Field label="EMAIL" value={data.email} onChange={(v) => update('email', v)} placeholder="hello@100hourscurry.com" />
                    </div>
                    <div className="mt-4 max-w-sm">
                        <Field label="JAM BUKA" value={data.openHours} onChange={(v) => update('openHours', v)} placeholder="Open Daily: 11:00 AM – 10:00 PM" />
                    </div>
                </Section>

                {/* Social Media */}
                <Section title="SOCIAL MEDIA" hint="Isi URL lengkap atau kosongkan untuk disembunyikan">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-3 text-white/20 text-xs font-black tracking-widest w-40">PLATFORM</th>
                                <th className="text-left px-4 py-3 text-white/20 text-xs font-black tracking-widest">URL</th>
                                <th className="text-left px-4 py-3 text-white/20 text-xs font-black tracking-widest w-32">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { key: 'instagramUrl' as keyof FooterData, label: 'Instagram', Icon: Instagram, color: 'text-pink-400', placeholder: 'https://instagram.com/...' },
                                { key: 'facebookUrl' as keyof FooterData, label: 'Facebook', Icon: Facebook, color: 'text-blue-400', placeholder: 'https://facebook.com/...' },
                                { key: 'youtubeUrl' as keyof FooterData, label: 'YouTube', Icon: Youtube, color: 'text-red-400', placeholder: 'https://youtube.com/...' },
                                { key: 'tiktokUrl' as keyof FooterData, label: 'TikTok', Icon: Music2, color: 'text-white/60', placeholder: 'https://tiktok.com/...' },
                            ].map(({ key, label, Icon, color, placeholder }) => (
                                <tr key={key} className="border-b border-white/5 last:border-0">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <Icon className={`w-4 h-4 ${color}`} />
                                            <span className="text-sm font-black text-white/60">{label}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <input
                                            value={data[key]}
                                            onChange={(e) => update(key, e.target.value)}
                                            placeholder={placeholder}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${data[key]
                                            ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                                            : 'bg-white/5 text-white/20 border border-white/10'
                                            }`}>
                                            {data[key] ? 'Aktif' : 'Kosong'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>

                {/* Full Preview */}
                <Section title="FULL PREVIEW">
                    <div className="bg-black border border-yellow-400/20 rounded-2xl p-8">
                        <div className="grid grid-cols-3 gap-8 mb-8">
                            {/* Brand */}
                            <div className="col-span-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-yellow-400 rounded-lg" />
                                    <div>
                                        <p className="font-black text-white text-lg leading-none">{data.siteName || '—'}</p>
                                        <p className="text-yellow-500 text-xs font-black tracking-widest">CURRY</p>
                                    </div>
                                </div>
                                <p className="text-white/40 text-xs leading-relaxed mb-4">{data.tagline || '—'}</p>
                                <div className="flex gap-2">
                                    {[
                                        { url: data.instagramUrl, Icon: Instagram },
                                        { url: data.facebookUrl, Icon: Facebook },
                                        { url: data.youtubeUrl, Icon: Youtube },
                                        { url: data.tiktokUrl, Icon: Music2 },
                                    ].filter(({ url }) => url).map(({ Icon }, i) => (
                                        <div key={i} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                                            <Icon className="w-3.5 h-3.5 text-white/40" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigate */}
                            <div>
                                <p className="font-black text-yellow-500 mb-4 tracking-wider text-xs">NAVIGATE</p>
                                <div className="space-y-2">
                                    {['Home', 'About Us', 'Our Menu', 'Contact', 'Career'].map((l) => (
                                        <p key={l} className="text-white/30 text-xs">{l}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Find Us */}
                            <div>
                                <p className="font-black text-yellow-500 mb-4 tracking-wider text-xs">FIND US</p>
                                <div className="space-y-2">
                                    {[data.address, data.phone, data.email].map((t) => (
                                        <p key={t} className="text-white/30 text-xs">{t || '—'}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                            <p className="text-white/20 text-xs">© 2024 {data.siteName || '—'}. All rights reserved.</p>
                            <p className="text-white/20 text-xs">Simmered with ❤️ for 100 hours</p>
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    )
}