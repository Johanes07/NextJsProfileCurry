'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Music2, Heart } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

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

const defaultData: FooterData = {
    siteName: '100HOURS',
    tagline: 'Crafted with passion. Simmered for 100 hours. Every bowl tells a story of dedication and authentic flavor.',
    email: 'hello@100hourscurry.com',
    phone: '+62 21 1234 5678',
    address: 'Jl. Kuliner No. 1, Jakarta Selatan',
    openHours: 'Open Daily: 11:00 AM – 10:00 PM',
    instagramUrl: '',
    facebookUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
}

export function Footer() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [data, setData] = useState<FooterData>(defaultData)

    useEffect(() => {
        setMounted(true)
        fetch('/api/admin/footer')
            .then((r) => r.json())
            .then((json) => { if (json.success) setData(json.data) })
            .catch(() => { })
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true

    const socialLinks = [
        { url: data.instagramUrl, Icon: Instagram },
        { url: data.facebookUrl, Icon: Facebook },
        { url: data.youtubeUrl, Icon: Youtube },
        { url: data.tiktokUrl, Icon: Music2 },
    ].filter(({ url }) => url && url !== '#')

    return (
        <footer className={`border-t border-yellow-400/20 transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* ── Brand ── */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 overflow-hidden">
                                <Image src="/images/LOGOCURRY1.png" alt={data.siteName} width={36} height={36} className="object-contain" />
                            </div>
                            <div>
                                <p className={`font-black text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{data.siteName}</p>
                                <p className="text-yellow-500 text-sm font-black tracking-widest">CURRY</p>
                            </div>
                        </div>
                        <p className={`leading-relaxed mb-6 max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {data.tagline}
                        </p>

                        {socialLinks.length > 0 && (
                            <div className="flex gap-3">
                                {socialLinks.map(({ url, Icon }, i) => (
                                    <a
                                        key={i}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:scale-110 ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-600'}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Navigate ── */}
                    <div>
                        <p className="font-black text-yellow-500 mb-6 tracking-wider">NAVIGATE</p>
                        <div className="space-y-3">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/about', label: 'About Us' },
                                { href: '/menu', label: 'Our Menu' },
                                { href: '/contact', label: 'Contact' },
                                { href: '/career', label: 'Career' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block text-sm transition-colors hover:text-yellow-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ── Find Us ── */}
                    <div>
                        <p className="font-black text-yellow-500 mb-6 tracking-wider">FIND US</p>
                        <div className="space-y-4">
                            {[
                                { Icon: MapPin, text: data.address },
                                { Icon: Phone, text: data.phone },
                                { Icon: Mail, text: data.email },
                            ].map(({ Icon, text }) => (
                                <div key={text} className={`flex gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <Icon className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        © 2026 {data.siteName}. All rights reserved.
                    </p>
                    <p className={`text-sm flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Simmered with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for 100 hours
                    </p>
                </div>
            </div>
        </footer>
    )
}