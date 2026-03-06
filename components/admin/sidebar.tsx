'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { LogOut, ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type NavChild = {
    id: string
    label: string
    icon: string
    href: string
    isActive: boolean
}

type NavItem = {
    id: string
    label: string
    icon: string
    href: string | null
    groupName: string | null
    isActive: boolean
    children: NavChild[]
}

// Static fallback kalau DB belum ada data
const FALLBACK: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard', groupName: null, isActive: true, children: [] },
    {
        id: '2', label: 'Website', icon: '', href: null, groupName: 'Website', isActive: true, children: [
            { id: '2a', label: 'Menu', icon: 'UtensilsCrossed', href: '/dashboard/menu', isActive: true },
            { id: '2b', label: 'Promo', icon: 'Megaphone', href: '/dashboard/promo', isActive: true },
            { id: '2c', label: 'Instagram Feed', icon: 'Instagram', href: '/dashboard/sosmed', isActive: true },
            { id: '2d', label: 'Career', icon: 'Briefcase', href: '/dashboard/career', isActive: true },
            { id: '2e', label: 'Tim', icon: 'Users', href: '/dashboard/team', isActive: true },
            { id: '2f', label: 'About', icon: 'BookOpen', href: '/dashboard/about', isActive: true },
            { id: '2g', label: 'Hero Section', icon: 'Star', href: '/dashboard/hero', isActive: true },
        ]
    },
    {
        id: '3', label: 'Lainnya', icon: '', href: null, groupName: 'Lainnya', isActive: true, children: [
            { id: '3a', label: 'Pesan Masuk', icon: 'MessageSquare', href: '/dashboard/messages', isActive: true },
            { id: '3b', label: 'Site Settings', icon: 'Settings', href: '/dashboard/settings', isActive: true },
            { id: '3c', label: 'Sidebar CMS', icon: 'PanelLeft', href: '/dashboard/nav', isActive: true },
        ]
    },
]

function getIcon(name: string): LucideIcon {
    const icon = (LucideIcons as Record<string, unknown>)[name]
    if (typeof icon === 'function') return icon as LucideIcon
    return LucideIcons.Circle
}

export function AdminSidebar() {
    const pathname = usePathname()
    const [items, setItems] = useState<NavItem[]>(FALLBACK)

    useEffect(() => {
        fetch('/api/admin/nav')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setItems(data)
            })
            .catch(() => { })
    }, [pathname]) // re-fetch setiap ganti halaman

    return (
        <aside className="w-64 bg-zinc-950 border-r border-yellow-400/10 text-white flex flex-col h-full shrink-0">
            {/* Logo */}
            <div className="p-6 border-b border-yellow-400/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-yellow-400/20">
                        <Image src="/images/LOGOCURRY1.png" alt="Logo" width={32} height={32} className="object-contain" />
                    </div>
                    <div>
                        <p className="font-black text-sm text-white">100HOURS</p>
                        <p className="text-xs font-bold text-yellow-400 tracking-widest">ADMIN PANEL</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto space-y-1">
                {items.filter(i => i.isActive).map((item) => {
                    // Group dengan children
                    if (item.groupName) {
                        const activeChildren = item.children.filter(c => c.isActive)
                        if (activeChildren.length === 0) return null
                        return (
                            <div key={item.id} className="pt-4 first:pt-0">
                                <p className="text-white/20 text-xs font-black tracking-widest px-3 mb-2">
                                    {item.groupName.toUpperCase()}
                                </p>
                                <div className="space-y-1">
                                    {activeChildren.map(child => {
                                        const Icon = getIcon(child.icon)
                                        const isActive = pathname === child.href || pathname.startsWith(child.href + '/')
                                        return (
                                            <Link key={child.id} href={child.href}
                                                className={cn(
                                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all',
                                                    isActive
                                                        ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                                                )}>
                                                <Icon className="w-4 h-4" />
                                                <span className="flex-1">{child.label}</span>
                                                {isActive && <ChevronRight className="w-3 h-3" />}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    }

                    // Single item
                    if (item.href) {
                        const Icon = getIcon(item.icon)
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.id} href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all',
                                    isActive
                                        ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                                )}>
                                <Icon className="w-4 h-4" />
                                <span className="flex-1">{item.label}</span>
                                {isActive && <ChevronRight className="w-3 h-3" />}
                            </Link>
                        )
                    }

                    return null
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-yellow-400/10">
                <button onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all">
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}