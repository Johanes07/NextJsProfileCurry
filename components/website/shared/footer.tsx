import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Music2 } from 'lucide-react'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Heart } from 'lucide-react'

// ── Server Component ───────────────────────────────────────────────────────
export async function Footer() {
    const settings = await prisma.siteSettings.findFirst().catch(() => null)

    const siteName = settings?.siteName ?? '100HOURS'
    const tagline = settings?.tagline ?? 'Crafted with passion. Simmered for 100 hours. Every bowl tells a story.'
    const address = settings?.address ?? 'Jl. Kuliner No. 1, Jakarta Selatan'
    const phone = settings?.phone ?? '+62 21 1234 5678'
    const email = settings?.email ?? 'hello@100hourscurry.com'
    const instagramUrl = settings?.instagramUrl ?? null
    const facebookUrl = settings?.facebookUrl ?? null
    const youtubeUrl = settings?.youtubeUrl ?? null
    const tiktokUrl = settings?.tiktokUrl ?? null

    const socialLinks = [
        { url: instagramUrl, Icon: Instagram },
        { url: facebookUrl, Icon: Facebook },
        { url: youtubeUrl, Icon: Youtube },
        { url: tiktokUrl, Icon: Music2 },
    ].filter(({ url }) => url && url !== '#')

    return (
        <footer className="border-t border-yellow-400/20 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* ── Brand ── */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 overflow-hidden">
                                <Image src="/images/LOGOCURRY1.png" alt={siteName} width={36} height={36} className="object-contain" />
                            </div>
                            <div>
                                <p className="font-black text-2xl text-white">{siteName}</p>
                                <p className="text-yellow-500 text-sm font-black tracking-widest">CURRY</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">{tagline}</p>

                        {/* Social icons — hanya tampil kalau URL diisi */}
                        {socialLinks.length > 0 && (
                            <div className="flex gap-3">
                                {socialLinks.map(({ url, Icon }, i) => (
                                    <a
                                        key={i}
                                        href={url!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-110"
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
                                    className="block text-sm text-gray-400 hover:text-yellow-500 transition-colors"
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
                                { Icon: MapPin, text: address },
                                { Icon: Phone, text: phone },
                                { Icon: Mail, text: email },
                            ].map(({ Icon, text }) => (
                                <div key={text} className="flex gap-3 text-sm text-gray-400">
                                    <Icon className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">© 2026 {siteName}. All rights reserved.</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        Simmered with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for 100 hours
                    </p>
                </div>
            </div>
        </footer>
    )
}