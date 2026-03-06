import { AboutHero } from '@/components/website/about/hero'
import { OurStory } from '@/components/website/about/our-story'
import { OurValues } from '@/components/website/about/our-values'
import { OurTeam } from '@/components/website/about/our-team'

export default function AboutPage() {
    return (
        <>
            <AboutHero />
            <OurStory />
            <OurValues />
            <OurTeam />
        </>
    )
}