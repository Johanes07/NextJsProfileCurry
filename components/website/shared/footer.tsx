'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Footer() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const isDark = mounted ? resolvedTheme === 'dark' : true

    return (
        <footer className={`border-t border-yellow-400/20 transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 overflow-hidden">
                                <Image src="/images/LOGOCURRY1.png" alt="100 Hours Curry" width={36} height={36} className="object-contain" />
                            </div>
                            <div>
                                <p className={`font-black text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>100HOURS</p>
                                <p className="text-yellow-500 text-sm font-black tracking-widest">CURRY</p>
                            </div>
                        </div>
                        <p className={`leading-relaxed mb-6 max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Crafted with passion. Simmered for 100 hours. Every bowl tells a story of dedication and authentic flavor.
                        </p>
                        <div className="flex gap-3">
                            {[Instagram, Facebook, Youtube].map((Icon, i) => (
                                <a key={i} href="#"
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-110 ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="font-black text-yellow-500 mb-6 tracking-wider">NAVIGATE</p>
                        <div className="space-y-3">
                            {[{ href: '/', label: 'Home' }, { href: '/about', label: 'About Us' }, { href: '/services', label: 'Our Menu' }, { href: '/contact', label: 'Contact' }, { href: '/career', label: 'Career' }].map(link => (
                                <Link key={link.href} href={link.href} className={`block text-sm transition-colors hover:text-yellow-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="font-black text-yellow-500 mb-6 tracking-wider">FIND US</p>
                        <div className="space-y-4">
                            {[
                                { Icon: MapPin, text: 'Jl. Kuliner No. 1, Jakarta Selatan' },
                                { Icon: Phone, text: '+62 21 1234 5678' },
                                { Icon: Mail, text: 'hello@100hourscurry.com' },
                            ].map(({ Icon, text }) => (
                                <div key={text} className={`flex gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <Icon className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>© 2024 100 Hours Curry. All rights reserved.</p>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Simmered with ❤️ for 100 hours</p>
                </div>
            </div>
        </footer>
    )
}