'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Globe, Sun, Moon } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
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
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const { resolvedTheme, setTheme } = useTheme()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const gtCookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='))
        if (gtCookie) {
            const val = gtCookie.split('=')[1]
            setLang(val && val.includes('/id') ? 'id' : 'en')
        }
    }, [])

    useEffect(() => {
        return () => { if (retryRef.current) clearTimeout(retryRef.current) }
    }, [])

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href)

    const isDark = mounted ? resolvedTheme === 'dark' : true

    const switchToID = (attempt = 0) => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
        if (!select) {
            if (attempt < 15) retryRef.current = setTimeout(() => switchToID(attempt + 1), 300)
            return
        }
        if (retryRef.current) clearTimeout(retryRef.current)
        select.value = 'id'
        select.dispatchEvent(new Event('change', { bubbles: true }))
        select.dispatchEvent(new Event('input', { bubbles: true }))
    }

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

    const hasLightBg = !isDark || pathname.startsWith('/career/apply')

    const navBg = hasLightBg
        ? isDark
            ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-yellow-500/10'
            : scrolled
                ? 'bg-white shadow-md shadow-gray-200'
                : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
        : scrolled
            ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-yellow-500/10'
            : 'bg-transparent'

    return (
        <>
            <div id="google_translate_element" className="hidden" />
            <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
            <Script id="google-translate-init" strategy="afterInteractive">{`
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'en,id', autoDisplay: false }, 'google_translate_element');
                }
            `}</Script>

            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                <Image src="/images/LOGOCURRY1.png" alt="100 Hours Curry" width={36} height={36} className="object-contain" />
                            </div>
                            <div suppressHydrationWarning>
                                <p className={`font-black text-lg leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>100HOURS</p>
                                <p className="text-xs font-bold text-yellow-500 leading-none tracking-widest">CURRY</p>
                            </div>
                        </Link>

                        {/* Nav links */}
                        <div className="hidden md:flex items-center gap-1" suppressHydrationWarning>
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href}
                                    className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive(link.href)
                                        ? 'text-yellow-500 bg-yellow-400/10'
                                        : isDark
                                            ? 'text-white/70 hover:text-yellow-400 hover:bg-white/5'
                                            : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                                        }`}>
                                    {link.label}
                                    {isActive(link.href) && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full" />}
                                </Link>
                            ))}
                        </div>

                        {/* Right controls */}
                        <div className="hidden md:flex items-center gap-2" suppressHydrationWarning>

                            {/* Theme toggle */}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                    className={`p-2 rounded-full transition-all duration-200 ${isDark
                                        ? 'bg-white/5 border border-white/10 text-yellow-400 hover:bg-white/10'
                                        : 'bg-gray-900 border border-gray-800 text-yellow-400 hover:bg-gray-700'
                                        }`}
                                    aria-label="Toggle theme">
                                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </button>
                            )}

                            {/* Language toggle */}
                            <div
                                className={`flex items-center gap-1 border rounded-full p-1 notranslate ${isDark
                                    ? 'bg-white/5 border-white/10'
                                    : 'bg-gray-900 border-gray-800'
                                    }`}
                                translate="no">
                                <Globe className={`w-4 h-4 ml-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                                <button
                                    onClick={() => switchLang('en')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 ${lang === 'en'
                                        ? 'bg-yellow-400 text-black'
                                        : isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-white'
                                        }`}>
                                    EN
                                </button>
                                <button
                                    onClick={() => switchLang('id')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 ${lang === 'id'
                                        ? 'bg-yellow-400 text-black'
                                        : isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-white'
                                        }`}>
                                    ID
                                </button>
                            </div>
                        </div>

                        {/* Mobile hamburger */}
                        <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 rounded-xl transition-all ${isDark ? 'bg-yellow-400/10 text-yellow-400' : 'bg-gray-900 text-yellow-400'}`}>
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile menu */}
                    {isOpen && (
                        <div className={`md:hidden mt-4 p-4 rounded-2xl shadow-xl border border-yellow-400/20 ${isDark ? 'bg-black/95' : 'bg-white'}`}>
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(link.href)
                                        ? 'text-yellow-500 bg-yellow-400/10'
                                        : isDark
                                            ? 'text-white/70 hover:text-yellow-400 hover:bg-white/5'
                                            : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                                        }`}>
                                    {link.label}
                                    {isActive(link.href) && <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />}
                                </Link>
                            ))}
                            <div className="mt-3 flex items-center justify-between px-4">
                                {mounted && (
                                    <button
                                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDark
                                            ? 'bg-white/5 border border-white/10 text-yellow-400'
                                            : 'bg-gray-900 border border-gray-800 text-yellow-400'
                                            }`}>
                                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                        {isDark ? 'Light Mode' : 'Dark Mode'}
                                    </button>
                                )}
                                <div className="flex items-center gap-2 notranslate" translate="no">
                                    <Globe className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                                    <div className={`flex gap-1 border rounded-full p-1 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-900 border-gray-800'}`}>
                                        <button onClick={() => switchLang('en')} className={`px-3 py-1 rounded-full text-xs font-black transition-all ${lang === 'en' ? 'bg-yellow-400 text-black' : isDark ? 'text-white/50' : 'text-gray-400 hover:text-white'}`}>EN</button>
                                        <button onClick={() => switchLang('id')} className={`px-3 py-1 rounded-full text-xs font-black transition-all ${lang === 'id' ? 'bg-yellow-400 text-black' : isDark ? 'text-white/50' : 'text-gray-400 hover:text-white'}`}>ID</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    )
}