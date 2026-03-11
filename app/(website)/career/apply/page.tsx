import { JobApplicationForm } from '@/components/website/career/job-application-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
    searchParams: Promise<{ position?: string; id?: string }>
}

export default async function ApplyPage({ searchParams }: Props) {
    const { position, id } = await searchParams

    return (
        <>
            <div className="max-w-3xl mx-auto px-6 pt-8">
                <Link
                    href="/career"
                    className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-yellow-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Careers
                </Link>
            </div>

            <JobApplicationForm
                positionTitle={position ?? ''}
                positionId={id ?? ''}
            />
        </>
    )
}