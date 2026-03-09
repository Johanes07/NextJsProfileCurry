'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Globe } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Menu' },
    { href: '/contact', label: 'Contact' },
    { href: '/career', label: 'Career' },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [lang, setLang] = useState<'en' | 'id'>('en')
    const pathname = usePathname()
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Detect current lang from GT cookie on mount so button state stays in sync after reload
    useEffect(() => {
        const gtCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('googtrans='))
        if (gtCookie) {
            const val = gtCookie.split('=')[1] // e.g. "/en/id"
            setLang(val && val.includes('/id') ? 'id' : 'en')
        }
    }, [])

    useEffect(() => {
        return () => {
            if (retryRef.current) clearTimeout(retryRef.current)
        }
    }, [])

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href)

    /** Switch to Indonesian via GT select element — retries until widget is ready */
    const switchToID = (attempt = 0) => {
        const MAX_RETRIES = 15
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null

        if (!select) {
            if (attempt < MAX_RETRIES) {
                retryRef.current = setTimeout(() => switchToID(attempt + 1), 300)
            }
            return
        }

        if (retryRef.current) clearTimeout(retryRef.current)
        select.value = 'id'
        select.dispatchEvent(new Event('change', { bubbles: true }))
        select.dispatchEvent(new Event('input', { bubbles: true }))
    }

    /**
     * Restore English by clearing the googtrans cookie then reloading.
     * This is the only reliable cross-browser method — GT has no public API
     * to programmatically "show original" without a page refresh.
     */
    const switchToEN = () => {
        const clearCookie = (domain: string) => {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`
        }
        clearCookie(location.hostname)
        clearCookie('.' + location.hostname)
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        window.location.reload()
    }

    const switchLang = (target: 'en' | 'id') => {
        if (target === lang) return
        setLang(target)
        if (target === 'id') switchToID()
        else switchToEN()
    }

    return (
        <>
            {/* Hidden Google Translate widget */}
            <div id="google_translate_element" className="hidden" />
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
            <Script id="google-translate-init" strategy="afterInteractive">{`
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({
                        pageLanguage: 'en',
                        includedLanguages: 'en,id',
                        autoDisplay: false,
                    }, 'google_translate_element');
                }
            `}</Script>

            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-yellow-500/10' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                <Image src="/images/LOGOCURRY1.png" alt="100 Hours Curry" width={36} height={36} className="object-contain" />
                            </div>
                            <div>
                                <p className="font-black text-lg leading-none text-white">100HOURS</p>
                                <p className="text-xs font-bold text-yellow-400 leading-none tracking-widest">CURRY</p>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href}
                                    className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive(link.href)
                                        ? 'text-yellow-400 bg-yellow-400/10'
                                        : 'text-white/70 hover:text-yellow-400 hover:bg-white/5'
                                        }`}>
                                    {link.label}
                                    {isActive(link.href) && (
                                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Language Toggle */}
                        <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 notranslate" translate="no">
                            <Globe className="w-4 h-4 text-white/40 ml-2" />
                            <button
                                onClick={() => switchLang('en')}
                                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 ${lang === 'en' ? 'bg-yellow-400 text-black' : 'text-white/50 hover:text-white'}`}>
                                EN
                            </button>
                            <button
                                onClick={() => switchLang('id')}
                                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 ${lang === 'id' ? 'bg-yellow-400 text-black' : 'text-white/50 hover:text-white'}`}>
                                ID
                            </button>
                        </div>

                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-xl bg-yellow-400/10 text-yellow-400">
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {isOpen && (
                        <div className="md:hidden mt-4 p-4 bg-black/95 rounded-2xl shadow-xl border border-yellow-400/20">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(link.href)
                                        ? 'text-yellow-400 bg-yellow-400/10'
                                        : 'text-white/70 hover:text-yellow-400 hover:bg-white/5'
                                        }`}>
                                    {link.label}
                                    {isActive(link.href) && (
                                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                    )}
                                </Link>
                            ))}
                            {/* Language toggle mobile */}
                            <div className="mt-3 flex items-center gap-2 px-4 notranslate" translate="no">
                                <Globe className="w-4 h-4 text-white/40" />
                                <div className="flex gap-1 bg-white/5 border border-white/10 rounded-full p-1">
                                    <button onClick={() => switchLang('en')}
                                        className={`px-3 py-1 rounded-full text-xs font-black transition-all ${lang === 'en' ? 'bg-yellow-400 text-black' : 'text-white/50'}`}>
                                        EN
                                    </button>
                                    <button onClick={() => switchLang('id')}
                                        className={`px-3 py-1 rounded-full text-xs font-black transition-all ${lang === 'id' ? 'bg-yellow-400 text-black' : 'text-white/50'}`}>
                                        ID
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    )
}