import { Navbar } from '@/components/website/shared/navbar'
import { Footer } from '@/components/website/shared/footer'

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    )
}