import Link from 'next/link'
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react'

export function CTASection() {
    return (
        <section className="py-24 bg-yellow-400 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-300/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/50 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="inline-block bg-black/10 text-black text-sm font-black px-4 py-2 rounded-full mb-6 tracking-wider">VISIT US TODAY</span>
                        <h2 className="text-5xl md:text-7xl font-black text-black mb-6 leading-none">
                            TASTE THE
                            <span className="block">LEGEND</span>
                        </h2>
                        <p className="text-black/60 text-lg leading-relaxed mb-8">
                            Come experience the curry that took 100 hours to perfect. Your taste buds deserve this.
                        </p>
                        <div className="space-y-4 mb-10">
                            {[
                                { icon: MapPin, text: 'Jl. Kuliner No. 1, Jakarta Selatan' },
                                { icon: Clock, text: 'Open Daily: 11:00 AM - 10:00 PM' },
                                { icon: Phone, text: '+62 21 1234 5678' },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-3 text-black/70">
                                    <Icon className="w-5 h-5 text-black shrink-0" />
                                    <span className="font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/contact" className="inline-flex items-center gap-2 bg-black text-yellow-400 px-8 py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                            Get Directions <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { emoji: '⏰', title: '100 Hours', desc: 'Of slow cooking perfection' },
                            { emoji: '🌶️', title: 'Secret Spices', desc: '27 hand-selected ingredients' },
                            { emoji: '🏆', title: 'Award Winning', desc: 'Best curry in Jakarta 2023' },
                            { emoji: '🚚', title: 'Fast Delivery', desc: 'Hot to your door in 30 mins' },
                        ].map((item) => (
                            <div key={item.title} className="bg-black/10 rounded-2xl p-6 hover:bg-black/20 transition-all duration-300">
                                <span className="text-3xl mb-3 block">{item.emoji}</span>
                                <p className="font-black text-black mb-1">{item.title}</p>
                                <p className="text-black/50 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}