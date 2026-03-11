// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const now = new Date()
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

        const [
            totalMenu,
            totalPromo,
            totalPositions,
            totalApplications,
            unreadMessages,
            unreadApplications,
            recentApplications,
            recentMessages,
            applicationsRaw,
        ] = await Promise.all([
            prisma.menuItem.count({ where: { isActive: true } }),
            prisma.promo.count({ where: { isActive: true } }),
            prisma.jobPosition.count({ where: { isActive: true } }),
            prisma.jobApplication.count(),
            prisma.contactMessage.count({ where: { isRead: false } }),
            prisma.jobApplication.count({ where: { isRead: false } }),
            prisma.jobApplication.findMany({
                orderBy: { createdAt: 'desc' },
                take: 6,
                select: {
                    id: true,
                    namaLengkap: true,
                    positionTitle: true,
                    email: true,
                    noTelp: true,
                    isRead: true,
                    createdAt: true,
                },
            }),
            prisma.contactMessage.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    subject: true,
                    isRead: true,
                    createdAt: true,
                },
            }),
            // Applications grouped by month for chart
            prisma.jobApplication.findMany({
                where: { createdAt: { gte: twelveMonthsAgo } },
                select: { createdAt: true },
                orderBy: { createdAt: 'asc' },
            }),
        ])

        // Build monthly chart data (last 12 months)
        const monthlyMap: Record<string, number> = {}
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            monthlyMap[key] = 0
        }
        for (const app of applicationsRaw) {
            const d = new Date(app.createdAt)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            if (key in monthlyMap) monthlyMap[key]++
        }
        const monthlyChart = Object.entries(monthlyMap).map(([month, count]) => {
            const [year, m] = month.split('-')
            const label = new Date(Number(year), Number(m) - 1, 1)
                .toLocaleString('id-ID', { month: 'short', year: '2-digit' })
            return { month: label, count }
        })

        return NextResponse.json({
            stats: {
                totalMenu,
                totalPromo,
                totalPositions,
                totalApplications,
                unreadMessages,
                unreadApplications,
            },
            recentApplications,
            recentMessages,
            monthlyChart,
        })
    } catch (err) {
        console.error('[dashboard] error:', err)
        return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
    }
}