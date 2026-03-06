import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="flex h-screen bg-zinc-950">
            <AdminSidebar />
            <main className="flex-1 overflow-auto bg-zinc-900">
                {children}
            </main>
        </div>
    )
}