import Link from 'next/link'
import { ChefHat, MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react'
import Image from 'next/image'

export function Footer() {
    return (
        <footer className="bg-black text-white border-t border-yellow-400/20">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
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
                                <p className="font-black text-2xl text-white">100HOURS</p>
                                <p className="text-yellow-400 text-sm font-black tracking-widest">CURRY</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                            Crafted with passion. Simmered for 100 hours. Every bowl tells a story of dedication and authentic flavor.
                        </p>
                        <div className="flex gap-3">
                            {[Instagram, Facebook, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-110 text-white">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="font-black text-yellow-400 mb-6 tracking-wider">NAVIGATE</p>
                        <div className="space-y-3">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/about', label: 'About Us' },
                                { href: '/services', label: 'Our Menu' },
                                { href: '/contact', label: 'Contact' },
                                { href: '/career', label: 'Career' },
                            ].map((link) => (
                                <Link key={link.href} href={link.href} className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="font-black text-yellow-400 mb-6 tracking-wider">FIND US</p>
                        <div className="space-y-4">
                            <div className="flex gap-3 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                <span>Jl. Kuliner No. 1, Jakarta Selatan</span>
                            </div>
                            <div className="flex gap-3 text-sm text-gray-400">
                                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                                <span>+62 21 1234 5678</span>
                            </div>
                            <div className="flex gap-3 text-sm text-gray-400">
                                <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                                <span>hello@100hourscurry.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2024 100 Hours Curry. All rights reserved.</p>
                    <p className="text-gray-500 text-sm">Simmered with ❤️ for 100 hours</p>
                </div>
            </div>
        </footer>
    )
}