'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
    LayoutDashboard,
    UtensilsCrossed,
    Megaphone,
    Instagram,
    Briefcase,
    MessageSquare,
    Settings,
    LogOut,
    ChevronRight,
    Users,
    BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
        label: 'Website',
        items: [
            { href: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
            { href: '/dashboard/promo', label: 'Promo', icon: Megaphone },
            { href: '/dashboard/sosmed', label: 'Instagram Feed', icon: Instagram },
            { href: '/dashboard/career', label: 'Career', icon: Briefcase },
            { href: '/dashboard/team', label: 'Tim', icon: Users },
            { href: '/dashboard/about', label: 'About', icon: BookOpen },
        ],
    },
    {
        label: 'Lainnya',
        items: [
            { href: '/dashboard/messages', label: 'Pesan Masuk', icon: MessageSquare },
            { href: '/dashboard/settings', label: 'Site Settings', icon: Settings },
        ],
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-zinc-950 border-r border-yellow-400/10 text-white flex flex-col h-full shrink-0">
            {/* Logo */}
            <div className="p-6 border-b border-yellow-400/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-yellow-400/20">
                        <Image
                            src="/images/LOGOCURRY1.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <p className="font-black text-sm text-white">100HOURS</p>
                        <p className="text-xs font-bold text-yellow-400 tracking-widest">ADMIN PANEL</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto space-y-6">
                {menuItems.map((section, i) => {
                    if ('href' in section && section.href) {
                        // Single item (Dashboard)
                        const Icon = section.icon as React.ElementType
                        const isActive = pathname === section.href
                        return (
                            <Link
                                key={section.href}
                                href={section.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all',
                                    isActive
                                        ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="flex-1">{section.label}</span>
                                {isActive && <ChevronRight className="w-3 h-3" />}
                            </Link>
                        )
                    }

                    // Group
                    return (
                        <div key={i}>
                            <p className="text-white/20 text-xs font-black tracking-widest px-3 mb-2">
                                {section.label.toUpperCase()}
                            </p>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all',
                                                isActive
                                                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="flex-1">{item.label}</span>
                                            {isActive && <ChevronRight className="w-3 h-3" />}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-yellow-400/10">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}