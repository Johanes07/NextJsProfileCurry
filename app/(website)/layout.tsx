import { Navbar } from '@/components/website/shared/navbar'
import { Footer } from '@/components/website/shared/footer'
import Script from 'next/script'

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

            {/* Google Translate */}
            <div id="google_translate_element" className="fixed bottom-4 left-4 z-50" />
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
            <Script id="google-translate-init" strategy="afterInteractive">{`
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({
                        pageLanguage: 'en',
                        includedLanguages: 'en,id',
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    }, 'google_translate_element');
                }
            `}</Script>
        </div>
    )
}