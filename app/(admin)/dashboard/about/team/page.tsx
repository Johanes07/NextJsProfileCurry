'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, RefreshCw, Loader2, Upload, X, ImageIcon } from 'lucide-react'
import Image from 'next/image'

// ── Types ─────────────────────────────────────────────────────────────────
type SectionMeta = {
    badge: string
    headingLine1: string
    headingLine2: string
    heroImage: string
    heroTagline1: string
    heroTagline2: string
    ctaTitle: string
    ctaDesc: string
    ctaButtonLabel: string
    ctaButtonLink: string
}

// ── Reusable ──────────────────────────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder = '', multiline = false }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean
}) => (
    <div>
        <label className="block text-xs font-black text-white/40 tracking-widest mb-2">{label}</label>
        {multiline ? (
            <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 resize-none" />
        ) : (
            <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
        )}
    </div>
)

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-xs font-black text-white/30 tracking-widest">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    )
}

// ── Image Upload Field ─────────────────────────────────────────────────────
function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
    const [uploading, setUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        setUploading(true)
        const form = new FormData()
        form.append('file', file)
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: form })
            const json = await res.json()
            if (json.url) onChange(json.url)
        } catch { /* silent */ }
        finally { setUploading(false) }
    }

    return (
        <div>
            <label className="block text-xs font-black text-white/40 tracking-widest mb-2">{label}</label>
            <div className="flex gap-3 items-start">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    {value ? (
                        <>
                            <Image src={value} alt="preview" fill className="object-cover" />
                            <button onClick={() => onChange('')}
                                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </>
                    ) : (
                        <ImageIcon className="w-5 h-5 text-white/20" />
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <input value={value} onChange={e => onChange(e.target.value)} placeholder="/images/chef.jpg"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                    <input ref={inputRef} type="file" accept="image/*" className="hidden"
                        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    <button onClick={() => inputRef.current?.click()} disabled={uploading}
                        className="flex items-center gap-2 text-xs font-black text-white/30 hover:text-yellow-400 transition-colors disabled:opacity-50">
                        {uploading
                            ? <><RefreshCw className="w-3 h-3 animate-spin" /> Uploading...</>
                            : <><Upload className="w-3 h-3" /> Upload Gambar</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function OurTeamCMSPage() {
    const [meta, setMeta] = useState<SectionMeta>({
        badge: 'The People Behind The Curry',
        headingLine1: 'MEET THE',
        headingLine2: 'TEAM',
        heroImage: '/images/chef.jpg',
        heroTagline1: 'The People Who Make',
        heroTagline2: 'Every Bowl Perfect',
        ctaTitle: 'JOIN OUR TEAM',
        ctaDesc: "Passionate about food? We're always looking for talented people who share our obsession.",
        ctaButtonLabel: 'Get In Touch',
        ctaButtonLink: '/contact',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/admin/team')
            .then(r => r.json())
            .then(json => {
                if (json.success && json.meta) setMeta(json.meta)
                else setError(json.message)
            })
            .catch(() => setError('Gagal memuat data'))
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true); setError(null)
        try {
            const res = await fetch('/api/admin/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meta }),
            })
            const json = await res.json()
            if (json.success) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
            else setError(json.message)
        } catch { setError('Gagal menyimpan, coba lagi') }
        finally { setSaving(false) }
    }

    const updateMeta = (key: keyof SectionMeta, val: string) =>
        setMeta(prev => ({ ...prev, [key]: val }))

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
                    <h1 className="text-3xl font-black text-white">Our Team</h1>
                    <p className="text-white/40 text-sm mt-1">Edit hero image, heading, dan CTA section</p>
                </div>
                <div className="flex items-center gap-3">
                    {error && (
                        <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-xl">{error}</span>
                    )}
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:scale-100">
                        {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan...</>
                            : saved ? <><Save className="w-4 h-4" /> Tersimpan!</>
                                : <><Save className="w-4 h-4" /> Simpan</>}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Section Heading */}
                <Section title="SECTION HEADING">
                    <div className="grid grid-cols-3 gap-4">
                        <Field label="BADGE TEXT" value={meta.badge} onChange={v => updateMeta('badge', v)} placeholder="The People Behind The Curry" />
                        <Field label="HEADING LINE 1" value={meta.headingLine1} onChange={v => updateMeta('headingLine1', v)} placeholder="MEET THE" />
                        <Field label="HEADING LINE 2 (AKSEN)" value={meta.headingLine2} onChange={v => updateMeta('headingLine2', v)} placeholder="TEAM" />
                    </div>
                </Section>

                {/* Hero Image */}
                <Section title="HERO IMAGE">
                    <ImageUpload label="GAMBAR HERO" value={meta.heroImage} onChange={v => updateMeta('heroImage', v)} />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Field label="TAGLINE BARIS 1" value={meta.heroTagline1} onChange={v => updateMeta('heroTagline1', v)} placeholder="The People Who Make" />
                        <Field label="TAGLINE BARIS 2 (AKSEN)" value={meta.heroTagline2} onChange={v => updateMeta('heroTagline2', v)} placeholder="Every Bowl Perfect" />
                    </div>
                </Section>

                {/* CTA Section */}
                <Section title="CTA BANNER">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Field label="JUDUL" value={meta.ctaTitle} onChange={v => updateMeta('ctaTitle', v)} placeholder="JOIN OUR TEAM" />
                        <Field label="DESKRIPSI" value={meta.ctaDesc} onChange={v => updateMeta('ctaDesc', v)} placeholder="Passionate about food..." multiline />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="LABEL TOMBOL" value={meta.ctaButtonLabel} onChange={v => updateMeta('ctaButtonLabel', v)} placeholder="Get In Touch" />
                        <Field label="LINK TOMBOL" value={meta.ctaButtonLink} onChange={v => updateMeta('ctaButtonLink', v)} placeholder="/contact" />
                    </div>
                </Section>

                {/* Preview */}
                <Section title="PREVIEW">
                    <div className="bg-zinc-950 border border-yellow-400/10 rounded-2xl p-8">
                        {/* Heading */}
                        <div className="text-center mb-8">
                            <span className="inline-block bg-yellow-400/10 text-yellow-500 text-xs font-bold px-3 py-1.5 rounded-full mb-3 border border-yellow-400/20">
                                {meta.badge}
                            </span>
                            <h2 className="text-3xl font-black text-white">
                                {meta.headingLine1}
                                <span className="block text-yellow-500">{meta.headingLine2}</span>
                            </h2>
                        </div>

                        {/* Hero Image */}
                        <div className="relative rounded-2xl overflow-hidden border border-yellow-400/20 mb-6 h-48 bg-white/5">
                            {meta.heroImage && (
                                <Image src={meta.heroImage} alt="hero" fill className="object-cover object-center" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <p className="text-yellow-400 font-bold text-xs mb-1 tracking-widest">OUR CREW</p>
                                <p className="text-lg font-black text-white leading-tight">{meta.heroTagline1}</p>
                                <p className="text-lg font-black text-yellow-400 leading-tight">{meta.heroTagline2}</p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-yellow-400 rounded-2xl p-6 text-center">
                            <h3 className="text-xl font-black text-black mb-2">{meta.ctaTitle}</h3>
                            <p className="text-black/60 text-xs mb-4 max-w-xs mx-auto">{meta.ctaDesc}</p>
                            <span className="inline-block bg-black text-yellow-400 px-6 py-2.5 rounded-xl font-black text-sm">
                                {meta.ctaButtonLabel}
                            </span>
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    )
}