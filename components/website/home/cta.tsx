import Link from 'next/link'
import { ArrowRight, Clock, MapPin, Phone, FlameKindling, Leaf, Star, Bike } from 'lucide-react'
import { prisma } from '@/lib/prisma'

// ── Types ──────────────────────────────────────────────────────────────────
type Feature = {
    id: string
    iconName: string
    title: string
    desc: string
}

// ── Icon map ──────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
    FlameKindling,
    Leaf,
    Star,
    Bike,
    MapPin,
    Clock,
    Phone,
}

// ── Fallback data ─────────────────────────────────────────────────────────
const FALLBACK_FEATURES: Feature[] = [
    { id: '1', iconName: 'FlameKindling', title: 'Slow-Fired 100 Hours', desc: 'Every batch simmered to absolute perfection' },
    { id: '2', iconName: 'Leaf', title: 'All-Natural Spices', desc: '27 hand-sourced ingredients, zero shortcuts' },
    { id: '3', iconName: 'Star', title: "Jakarta's Finest", desc: 'Best Curry Award — 3 years running' },
    { id: '4', iconName: 'Bike', title: 'At Your Door in 30', desc: 'Piping hot, guaranteed fresh on arrival' },
]

// ── Server Component ───────────────────────────────────────────────────────
export async function CTASection() {
    const cta = await prisma.ctaSection.findFirst().catch(() => null)

    const badge = cta?.badge ?? 'COME FIND US'
    const headline1 = cta?.headline1 ?? 'ONE BOWL.'
    const headline2 = cta?.headline2 ?? 'FOREVER.'
    const description = cta?.description ?? 'A curry so carefully crafted, one visit is all it takes to make you a regular.'
    const address = cta?.address ?? 'Jl. Kuliner No. 1, Jakarta Selatan'
    const hours = cta?.hours ?? 'Open Daily: 11:00 AM – 10:00 PM'
    const phone = cta?.phone ?? '+62 21 1234 5678'
    const buttonLabel = cta?.buttonLabel ?? 'Get Directions'
    const features = (cta?.features as Feature[] | null) ?? FALLBACK_FEATURES

    return (
        <section className="py-24 bg-yellow-400 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-300/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/50 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* ── Left ── */}
                    <div>
                        <span className="inline-block bg-black/10 text-black text-sm font-black px-4 py-2 rounded-full mb-6 tracking-wider">
                            {badge}
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black text-black mb-6 leading-none">
                            {headline1}
                            <span className="block">{headline2}</span>
                        </h2>
                        <p className="text-black/60 text-lg leading-relaxed mb-8">
                            {description}
                        </p>
                        <div className="space-y-4 mb-10">
                            {[
                                { Icon: MapPin, text: address },
                                { Icon: Clock, text: hours },
                                { Icon: Phone, text: phone },
                            ].map(({ Icon, text }) => (
                                <div key={text} className="flex items-center gap-3 text-black/70">
                                    <Icon className="w-5 h-5 text-black shrink-0" />
                                    <span className="font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-black text-yellow-400 px-8 py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                        >
                            {buttonLabel}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* ── Right: Feature Cards ── */}
                    <div className="grid grid-cols-2 gap-4">
                        {features.map((f) => {
                            const Icon = ICON_MAP[f.iconName] ?? Star
                            return (
                                <div
                                    key={f.id}
                                    className="bg-black/10 rounded-2xl p-6 hover:bg-black/20 transition-all duration-300 group"
                                >
                                    <div className="w-11 h-11 bg-black/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black/20 transition-all duration-300">
                                        <Icon className="w-5 h-5 text-black" strokeWidth={2.5} />
                                    </div>
                                    <p className="font-black text-black mb-1">{f.title}</p>
                                    <p className="text-black/50 text-sm">{f.desc}</p>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </section>
    )
}