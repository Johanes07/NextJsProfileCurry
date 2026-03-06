'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChefHat } from 'lucide-react'
import Image from 'next/image'

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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-yellow-500/10' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                            <Image
                                src="/images/LOGOCURRY1.png"
                                alt="100 Hours Curry"
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <p className="font-black text-lg leading-none text-white">100HOURS</p>
                            <p className="text-xs font-bold text-yellow-400 leading-none tracking-widest">CURRY</p>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-yellow-400 hover:bg-white/5 transition-all duration-200">
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <Link href="/contact" className="bg-yellow-400 text-black px-6 py-2.5 rounded-full text-sm font-black shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-105 transition-all duration-300">
                            Order Now
                        </Link>
                    </div>

                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-xl bg-yellow-400/10 text-yellow-400">
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {isOpen && (
                    <div className="md:hidden mt-4 p-4 bg-black/95 rounded-2xl shadow-xl border border-yellow-400/20">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-yellow-400 hover:bg-white/5 transition-all">
                                {link.label}
                            </Link>
                        ))}
                        <Link href="/contact" className="mt-2 block text-center bg-yellow-400 text-black px-6 py-3 rounded-xl text-sm font-black">
                            Order Now
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}