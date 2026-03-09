'use client'

import { Clock, Star, Users, Award } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const stats = [
    { icon: Clock, value: '100hrs', label: 'Slow Cooked', desc: 'Every single batch' },
    { icon: Star, value: '4.9/5', label: 'Rating', desc: 'From 10K+ reviews' },
    { icon: Users, value: '50K+', label: 'Happy Customers', desc: 'And counting' },
    { icon: Award, value: '#1', label: 'Best Curry', desc: 'Jakarta 2023' },
]

export function StatsSection() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const isDark = mounted ? resolvedTheme === 'dark' : true

    return (
        <section className={`py-20 border-y transition-colors duration-300 ${isDark ? 'bg-black border-yellow-400/10' : 'bg-white border-yellow-400/20'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map(({ icon: Icon, value, label, desc }) => (
                        <div key={label} className={`group text-center p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${isDark
                            ? 'border-white/5 hover:border-yellow-400/30 bg-white/[0.02] hover:bg-yellow-400/5'
                            : 'border-gray-100 hover:border-yellow-400/40 bg-gray-50 hover:bg-yellow-400/5 shadow-sm'
                            }`}>
                            <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-400 group-hover:scale-110 transition-all duration-300">
                                <Icon className="w-7 h-7 text-yellow-500 group-hover:text-black transition-colors duration-300" />
                            </div>
                            <p className={`text-4xl font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
                            <p className="text-yellow-500 text-sm font-bold mb-1">{label}</p>
                            <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}