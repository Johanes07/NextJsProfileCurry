import { HeroSection } from '@/components/website/home/hero'
import { FeaturedPrograms } from '@/components/website/home/featured-programs'
import { LatestNews } from '@/components/website/home/latest-news'
import { CTASection } from '@/components/website/home/cta'

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <FeaturedPrograms />
            <LatestNews />
            <CTASection />
        </>
    )
}