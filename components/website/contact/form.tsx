'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const ContactMap = dynamic(() => import('./map').then(m => m.ContactMap), { ssr: false })

export function ContactForm() {
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const isDark = mounted ? resolvedTheme === 'dark' : true

    const inputClass = `w-full border rounded-2xl px-5 py-4 focus:outline-none text-sm transition-all duration-300 ${isDark
        ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-yellow-400/50 focus:bg-yellow-400/5'
        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-400/60 focus:bg-yellow-50'}`

    return (
        <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16">

                    {/* Left — Info */}
                    <div>
                        <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-8 border border-yellow-400/20">Our Information</span>
                        <h2 className={`text-4xl md:text-5xl font-black mb-10 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            VISIT US<span className="block text-yellow-500">ANYTIME</span>
                        </h2>

                        <div className="space-y-6 mb-12">
                            {[
                                { icon: MapPin, title: 'Location', lines: ['Jl. Kuliner No. 1', 'Jakarta Selatan, 12345'] },
                                { icon: Clock, title: 'Opening Hours', lines: ['Mon – Fri: 11:00 AM – 10:00 PM', 'Sat – Sun: 10:00 AM – 11:00 PM'] },
                                { icon: Phone, title: 'Phone', lines: ['+62 21 1234 5678', '+62 812 3456 7890'] },
                                { icon: Mail, title: 'Email', lines: ['hello@100hourscurry.com', 'reservation@100hourscurry.com'] },
                            ].map(({ icon: Icon, title, lines }) => (
                                <div key={title} className="flex gap-5 group">
                                    <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-yellow-400 transition-all duration-300">
                                        <Icon className="w-5 h-5 text-yellow-500 group-hover:text-black transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <p className={`font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
                                        {lines.map(line => <p key={line} className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{line}</p>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ContactMap />
                    </div>

                    {/* Right — Form */}
                    <div>
                        <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-8 border border-yellow-400/20">Send a Message</span>

                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-yellow-400/10 border border-yellow-400/20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-yellow-500" />
                                </div>
                                <h3 className={`text-3xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h3>
                                <p className={`max-w-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Thanks for reaching out. We will get back to you within 24 hours.</p>
                                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                                    className="mt-8 text-yellow-500 font-bold text-sm hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-5">
                                {[
                                    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                                    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'john@email.com' },
                                    { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Table reservation, inquiry...' },
                                ].map(({ key, label, type, placeholder }) => (
                                    <div key={key}>
                                        <label className={`block text-xs font-bold tracking-widest mb-2 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>{label.toUpperCase()}</label>
                                        <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                                            onChange={e => setForm({ ...form, [key]: e.target.value })} required className={inputClass} />
                                    </div>
                                ))}
                                <div>
                                    <label className={`block text-xs font-bold tracking-widest mb-2 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>MESSAGE</label>
                                    <textarea rows={5} placeholder="Tell us how we can help..." value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })} required className={`${inputClass} resize-none`} />
                                </div>
                                <button type="submit" className="w-full flex items-center justify-center gap-3 bg-yellow-400 text-black py-4 rounded-2xl font-black text-lg hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-300">
                                    Send Message <Send className="w-5 h-5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}