const values = [
    {
        emoji: '⏰',
        title: 'No Shortcuts',
        desc: 'We cook every batch for exactly 100 hours. Not 99, not 101. The process is sacred and non-negotiable.',
    },
    {
        emoji: '🌿',
        title: 'Finest Ingredients',
        desc: 'We source 27 hand-selected spices from trusted farms. Quality ingredients are the foundation of great curry.',
    },
    {
        emoji: '❤️',
        title: 'Made with Love',
        desc: 'Every bowl is prepared with genuine care. We treat each serving as if cooking for our own family.',
    },
    {
        emoji: '🔬',
        title: 'Obsessive Quality',
        desc: 'Every batch is tasted and adjusted by our head chef. Consistency is our promise to every customer.',
    },
]

export function OurValues() {
    return (
        <section className="py-24 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block bg-yellow-400/10 text-yellow-400 text-sm font-bold px-4 py-2 rounded-full mb-4 border border-yellow-400/20">What We Stand For</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white">
                        OUR
                        <span className="text-yellow-400"> VALUES</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map(({ emoji, title, desc }) => (
                        <div key={title} className="group bg-zinc-950 rounded-3xl p-8 border border-white/5 hover:border-yellow-400/30 hover:bg-yellow-400/5 transition-all duration-300 hover:-translate-y-2">
                            <span className="text-5xl mb-6 block group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                            <h3 className="text-xl font-black text-white mb-3">{title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}