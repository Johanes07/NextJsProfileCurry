'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import * as LucideIcons from 'lucide-react'
import { LogOut, ChevronRight, Menu, X, PanelLeftClose, PanelLeftOpen, type LucideIcon } from 'lucide-react'
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

function isNavActive(href: string, pathname: string, siblings: NavChild[]): boolean {
    if (pathname === href) return true
    const hasMoreSpecificMatch = siblings.some(
        s => s.href !== href && (pathname === s.href || pathname.startsWith(s.href + '/'))
    )
    if (hasMoreSpecificMatch) return false
    return pathname.startsWith(href + '/')
}

// ── Logo ──────────────────────────────────────────────────────
function Logo({ collapsed }: { collapsed: boolean }) {
    return (
        <Link href="/dashboard"
            className="flex items-center gap-3 p-4 border-b border-yellow-400/10 hover:bg-white/5 transition-colors overflow-hidden">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-yellow-400/20 shrink-0">
                <Image src="/images/LOGOCURRY1.png" alt="Logo" width={28} height={28} className="object-contain" />
            </div>
            <div className={cn('transition-all duration-200 overflow-hidden whitespace-nowrap', collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>
                <p className="font-black text-sm text-white leading-tight">100HOURS</p>
                <p className="text-xs font-bold text-yellow-400 tracking-widest">ADMIN PANEL</p>
            </div>
        </Link>
    )
}

// ── Nav Content (shared between mobile & desktop) ─────────────
function NavContent({
    items,
    pathname,
    collapsed,
    onNavigate,
}: {
    items: NavItem[]
    pathname: string
    collapsed: boolean
    onNavigate?: () => void
}) {
    return (
        <nav className="flex-1 p-3 overflow-y-auto space-y-1">
            {items.filter(i => i.isActive).map((item) => {
                if (item.groupName) {
                    const activeChildren = item.children.filter(c => c.isActive)
                    if (activeChildren.length === 0) return null
                    return (
                        <div key={item.id} className="pt-4 first:pt-0">
                            {/* Group label — hidden when collapsed */}
                            {!collapsed && (
                                <p className="text-white/20 text-xs font-black tracking-widest px-3 mb-2">
                                    {item.groupName.toUpperCase()}
                                </p>
                            )}
                            {collapsed && <div className="border-t border-white/5 my-2" />}
                            <div className="space-y-1">
                                {activeChildren.map(child => {
                                    const Icon = getIcon(child.icon)
                                    const isActive = isNavActive(child.href, pathname, activeChildren)
                                    return (
                                        <Link key={child.id} href={child.href}
                                            onClick={onNavigate}
                                            title={collapsed ? child.label : undefined}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all',
                                                collapsed ? 'justify-center' : '',
                                                isActive
                                                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                                            )}>
                                            <Icon className="w-4 h-4 shrink-0" />
                                            {!collapsed && (
                                                <>
                                                    <span className="flex-1">{child.label}</span>
                                                    {isActive && <ChevronRight className="w-3 h-3" />}
                                                </>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }

                if (item.href) {
                    const Icon = getIcon(item.icon)
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.id} href={item.href}
                            onClick={onNavigate}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all',
                                collapsed ? 'justify-center' : '',
                                isActive
                                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                            )}>
                            <Icon className="w-4 h-4 shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="flex-1">{item.label}</span>
                                    {isActive && <ChevronRight className="w-3 h-3" />}
                                </>
                            )}
                        </Link>
                    )
                }

                return null
            })}
        </nav>
    )
}

// ── Main Sidebar ──────────────────────────────────────────────
export function AdminSidebar() {
    const pathname = usePathname()
    const [items, setItems] = useState<NavItem[] | null>(null)

    // Desktop: collapsed/expanded
    const [collapsed, setCollapsed] = useState(false)
    // Mobile: drawer open/close
    const [mobileOpen, setMobileOpen] = useState(false)

    // Close mobile drawer on route change
    useEffect(() => { setMobileOpen(false) }, [pathname])

    // Close mobile drawer on Escape
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
        window.addEventListener('keydown', fn)
        return () => window.removeEventListener('keydown', fn)
    }, [])

    useEffect(() => {
        fetch('/api/admin/nav')
            .then(r => r.json())
            .then(data => setItems(Array.isArray(data) && data.length > 0 ? data : FALLBACK))
            .catch(() => setItems(FALLBACK))
    }, [pathname])

    // ── Skeleton ──────────────────────────────────────────────
    const skeleton = (
        <nav className="flex-1 p-4 space-y-2">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-9 bg-white/5 rounded-xl animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
        </nav>
    )

    // ── Sidebar inner shared ──────────────────────────────────
    const sidebarInner = (isCollapsed: boolean, onNavigate?: () => void) => (
        <>
            <Logo collapsed={isCollapsed} />
            {items === null
                ? skeleton
                : <NavContent items={items} pathname={pathname} collapsed={isCollapsed} onNavigate={onNavigate} />
            }
            <div className={cn('p-3 border-t border-yellow-400/10', isCollapsed && 'flex flex-col items-center')}>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    title={isCollapsed ? 'Logout' : undefined}
                    className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all w-full',
                        isCollapsed && 'justify-center'
                    )}>
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </button>

                {/* Desktop collapse toggle */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className={cn(
                        'hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-white/20 hover:bg-white/5 hover:text-white/60 transition-all w-full mt-1',
                        isCollapsed && 'justify-center'
                    )}>
                    {isCollapsed
                        ? <PanelLeftOpen className="w-4 h-4 shrink-0" />
                        : <>
                            <PanelLeftClose className="w-4 h-4 shrink-0" />
                            <span>Collapse</span>
                        </>
                    }
                </button>
            </div>
        </>
    )

    return (
        <>
            {/* ── Mobile top bar ──────────────────────────────── */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-zinc-950 border-b border-yellow-400/10">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center overflow-hidden">
                        <Image src="/images/LOGOCURRY1.png" alt="Logo" width={24} height={24} className="object-contain" />
                    </div>
                    <span className="font-black text-sm text-white">100HOURS</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(o => !o)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-all">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* ── Mobile drawer overlay ────────────────────────── */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Mobile drawer ────────────────────────────────── */}
            <aside className={cn(
                'lg:hidden fixed top-14 left-0 bottom-0 z-40 w-72 bg-zinc-950 border-r border-yellow-400/10 text-white flex flex-col transition-transform duration-300',
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {sidebarInner(false, () => setMobileOpen(false))}
            </aside>

            {/* ── Desktop sidebar ──────────────────────────────── */}
            <aside className={cn(
                'hidden lg:flex flex-col h-full bg-zinc-950 border-r border-yellow-400/10 text-white shrink-0 transition-all duration-300',
                collapsed ? 'w-[60px]' : 'w-64'
            )}>
                {sidebarInner(collapsed)}
            </aside>
        </>
    )
}

// ── Mobile top-bar spacer ─────────────────────────────────────
// Tambahkan ini di layout utama supaya konten tidak tertimpa top bar mobile
export function MobileTopBarSpacer() {
    return <div className="h-14 lg:hidden shrink-0" />
}