import { Clock, Star, Users, Award } from 'lucide-react'

const stats = [
    { icon: Clock, value: '100hrs', label: 'Slow Cooked', desc: 'Every single batch' },
    { icon: Star, value: '4.9/5', label: 'Rating', desc: 'From 10K+ reviews' },
    { icon: Users, value: '50K+', label: 'Happy Customers', desc: 'And counting' },
    { icon: Award, value: '#1', label: 'Best Curry', desc: 'Jakarta 2023' },
]

export function StatsSection() {
    return (
        <section className="py-20 bg-black border-y border-yellow-400/10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map(({ icon: Icon, value, label, desc }) => (
                        <div key={label} className="group text-center p-8 rounded-3xl border border-white/5 hover:border-yellow-400/30 bg-white/[0.02] hover:bg-yellow-400/5 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-400 group-hover:scale-110 transition-all duration-300">
                                <Icon className="w-7 h-7 text-yellow-400 group-hover:text-black transition-colors duration-300" />
                            </div>
                            <p className="text-4xl font-black text-white mb-1">{value}</p>
                            <p className="text-yellow-400 text-sm font-bold mb-1">{label}</p>
                            <p className="text-white/30 text-xs">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}