'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, RefreshCw } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const ContactMap = dynamic(() => import('./map').then(m => m.ContactMap), { ssr: false })

// ── Types ─────────────────────────────────────────────────────
interface ContactFormData {
    badge: string
    headingLine1: string
    headingLine2: string
    locationLines: string[]
    hoursLines: string[]
    phoneLines: string[]
    emailLines: string[]
}

const DEFAULT: ContactFormData = {
    badge: 'Our Information',
    headingLine1: 'VISIT US',
    headingLine2: 'ANYTIME',
    locationLines: ['Jl. Kuliner No. 1', 'Jakarta Selatan, 12345'],
    hoursLines: ['Mon – Fri: 11:00 AM – 10:00 PM', 'Sat – Sun: 10:00 AM – 11:00 PM'],
    phoneLines: ['+62 21 1234 5678', '+62 812 3456 7890'],
    emailLines: ['hello@100hourscurry.com', 'reservation@100hourscurry.com'],
}

const SUBJECTS = [
    'Big Order',
    'Franchise',
    'Partnership',
    'Feedback & Suggestions',
    'Others',
]

// ── Math Captcha helper ───────────────────────────────────────
function generateCaptcha() {
    const a = Math.floor(Math.random() * 9) + 1
    const b = Math.floor(Math.random() * 9) + 1
    return { a, b, answer: a + b }
}

export function ContactForm() {
    const [submitted, setSubmitted] = useState(false)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '', phone: '', email: '', subject: '',
        country: '', city: '', message: '',
        honeypot: '',
    })

    const [subjectOpen, setSubjectOpen] = useState(false)
    const subjectRef = useRef<HTMLDivElement>(null)

    const [captcha, setCaptcha] = useState({ a: 1, b: 1, answer: 2 }) // safe SSR default
    const [captchaInput, setCaptchaInput] = useState('')
    const [captchaError, setCaptchaError] = useState(false)

    const [content, setContent] = useState<ContactFormData>(DEFAULT)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const startTime = useRef(Date.now())

    useEffect(() => {
        setMounted(true)
        setCaptcha(generateCaptcha()) // generate after mount, never on SSR
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (subjectRef.current && !subjectRef.current.contains(e.target as Node)) {
                setSubjectOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        fetch('/api/admin/contact/form', { cache: 'no-store' })
            .then(r => r.json())
            .then((d: Partial<ContactFormData>) => {
                setContent({
                    badge: d.badge || DEFAULT.badge,
                    headingLine1: d.headingLine1 || DEFAULT.headingLine1,
                    headingLine2: d.headingLine2 || DEFAULT.headingLine2,
                    locationLines: d.locationLines?.length ? d.locationLines : DEFAULT.locationLines,
                    hoursLines: d.hoursLines?.length ? d.hoursLines : DEFAULT.hoursLines,
                    phoneLines: d.phoneLines?.length ? d.phoneLines : DEFAULT.phoneLines,
                    emailLines: d.emailLines?.length ? d.emailLines : DEFAULT.emailLines,
                })
            })
            .catch(() => { })
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true

    const inputClass = `w-full border rounded-2xl px-5 py-4 focus:outline-none text-sm transition-all duration-300 ${isDark
        ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-yellow-400/50 focus:bg-yellow-400/5'
        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-400/60 focus:bg-yellow-50'}`

    const labelClass = `block text-xs font-bold tracking-widest mb-2 ${isDark ? 'text-white/50' : 'text-gray-400'}`

    const infoCards = [
        { icon: MapPin, title: 'Location', lines: content.locationLines },
        { icon: Clock, title: 'Opening Hours', lines: content.hoursLines },
        { icon: Phone, title: 'Phone', lines: content.phoneLines },
        { icon: Mail, title: 'Email', lines: content.emailLines },
    ]

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setCaptchaError(false)

        if (form.honeypot) return

        if (Date.now() - startTime.current < 3000) {
            setError('Please wait a moment before submitting.')
            return
        }

        if (parseInt(captchaInput) !== captcha.answer) {
            setCaptchaError(true)
            setCaptcha(generateCaptcha())
            setCaptchaInput('')
            return
        }

        setSending(true)
        try {
            const res = await fetch('/api/admin/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    email: form.email,
                    subject: form.subject,
                    country: form.country,
                    city: form.city,
                    message: form.message,
                }),
            })
            if (!res.ok) throw new Error()
            setSubmitted(true)
        } catch {
            setError('Failed to send message. Please try again.')
        } finally {
            setSending(false)
        }
    }

    function handleReset() {
        setSubmitted(false)
        setForm({ name: '', phone: '', email: '', subject: '', country: '', city: '', message: '', honeypot: '' })
        setCaptcha(generateCaptcha())
        setCaptchaInput('')
        setCaptchaError(false)
        startTime.current = Date.now()
    }

    return (
        <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16">

                    {/* Left — Info */}
                    <div>
                        <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-8 border border-yellow-400/20">
                            {content.badge}
                        </span>
                        <h2 className={`text-4xl md:text-5xl font-black mb-10 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {content.headingLine1}
                            <span className="block text-yellow-500">{content.headingLine2}</span>
                        </h2>
                        <div className="space-y-6 mb-12">
                            {infoCards.map(({ icon: Icon, title, lines }) => (
                                <div key={title} className="flex gap-5 group">
                                    <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-yellow-400 transition-all duration-300">
                                        <Icon className="w-5 h-5 text-yellow-500 group-hover:text-black transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <p className={`font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
                                        {lines.map((line, i) => (
                                            <p key={i} className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ContactMap />
                    </div>

                    {/* Right — Form */}
                    <div>
                        <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-8 border border-yellow-400/20">
                            Send a Message
                        </span>

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-yellow-400/10 border border-yellow-400/20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-yellow-500" />
                                </div>
                                <h3 className={`text-3xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h3>
                                <p className={`max-w-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                                    Thanks for reaching out. We will get back to you within 24 hours.
                                </p>
                                <button onClick={handleReset} className="mt-8 text-yellow-500 font-bold text-sm hover:underline">
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Honeypot */}
                                <input
                                    type="text" value={form.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true"
                                    onChange={e => setForm({ ...form, honeypot: e.target.value })}
                                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }}
                                />

                                {/* Name */}
                                <div>
                                    <label className={labelClass}>NAME</label>
                                    <input type="text" placeholder="John Doe" value={form.name} required
                                        onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
                                </div>

                                {/* Phone + Email */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>PHONE NUMBER</label>
                                        <input type="tel" placeholder="+62 812..." value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>EMAIL</label>
                                        <input type="email" placeholder="john@email.com" value={form.email} required
                                            onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
                                    </div>
                                </div>

                                {/* Subject — Custom Dropdown */}
                                <div>
                                    <label className={labelClass}>SELECT SUBJECT</label>
                                    <div className="relative" ref={subjectRef}>
                                        <button
                                            type="button"
                                            onClick={() => setSubjectOpen(p => !p)}
                                            className={`${inputClass} flex items-center justify-between text-left ${!form.subject ? (isDark ? 'text-white/30' : 'text-gray-400') : ''}`}
                                        >
                                            <span>{form.subject || 'Select Subject'}</span>
                                            <svg className={`w-4 h-4 transition-transform duration-200 shrink-0 ${subjectOpen ? 'rotate-180' : ''} ${isDark ? 'text-white/30' : 'text-gray-400'}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {subjectOpen && (
                                            <div className={`absolute z-20 w-full mt-2 rounded-2xl border shadow-xl overflow-hidden
                                                ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}>
                                                {SUBJECTS.map(s => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => { setForm({ ...form, subject: s }); setSubjectOpen(false) }}
                                                        className={`w-full text-left px-5 py-3 text-sm transition-all
                                                            ${form.subject === s
                                                                ? 'bg-yellow-400 text-black font-black'
                                                                : isDark
                                                                    ? 'text-white/70 hover:bg-white/5 hover:text-white'
                                                                    : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* Hidden input untuk form validation */}
                                    <input type="text" required value={form.subject} onChange={() => { }}
                                        className="sr-only" tabIndex={-1} aria-hidden="true" />
                                </div>

                                {/* Country + City */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>YOUR COUNTRY</label>
                                        <input type="text" placeholder="Indonesia" value={form.country}
                                            onChange={e => setForm({ ...form, country: e.target.value })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>YOUR CITY / LOCATION</label>
                                        <input type="text" placeholder="Jakarta" value={form.city}
                                            onChange={e => setForm({ ...form, city: e.target.value })} className={inputClass} />
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className={labelClass}>MESSAGE</label>
                                    <textarea rows={4} placeholder="Tell us how we can help..." value={form.message} required
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        className={`${inputClass} resize-none`} />
                                </div>

                                {/* Math Captcha */}
                                <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-black text-lg tabular-nums select-none
                                            ${isDark ? 'bg-yellow-400/10 border border-yellow-400/20 text-yellow-400' : 'bg-yellow-400/20 text-yellow-600'}`}>
                                            {captcha.a} + {captcha.b} = ?
                                        </div>
                                        <input
                                            type="number" value={captchaInput} placeholder="?"
                                            onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(false) }}
                                            required
                                            className={`w-20 border rounded-xl px-3 py-2.5 text-sm text-center font-black focus:outline-none transition-all
                                                ${captchaError
                                                    ? 'border-red-400/60 bg-red-400/10 text-red-400'
                                                    : isDark
                                                        ? 'bg-white/5 border-white/10 text-white focus:border-yellow-400/50'
                                                        : 'bg-white border-gray-300 text-gray-900 focus:border-yellow-400'
                                                }`}
                                        />
                                        <button type="button"
                                            onClick={() => { setCaptcha(generateCaptcha()); setCaptchaInput(''); setCaptchaError(false) }}
                                            className={`p-2 rounded-xl transition-all ${isDark ? 'text-white/30 hover:text-yellow-400 hover:bg-yellow-400/10' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                                            title="Refresh question">
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                        <p className={`text-xs flex-1 ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
                                            Solve to prove you're human
                                        </p>
                                    </div>
                                    {captchaError && (
                                        <p className="text-red-400 text-xs mt-2">Wrong answer — try again.</p>
                                    )}
                                </div>

                                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                                <button type="submit" disabled={sending}
                                    className="w-full flex items-center justify-center gap-3 bg-yellow-400 text-black py-4 rounded-2xl font-black text-lg
                                        hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-400/20
                                        disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300">
                                    {sending
                                        ? <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Sending...</>
                                        : <><Send className="w-5 h-5" /> Send Message</>
                                    }
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}