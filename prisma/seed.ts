import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString }, { schema: 'appcompany' })
const prisma = new PrismaClient({ adapter })

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 12)

    await prisma.user.upsert({
        where: { email: 'admin@company.com' },
        update: {},
        create: {
            name: 'Administrator',
            email: 'admin@company.com',
            password: hashedPassword,
            role: 'admin',
        },
    })

    await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            siteName: 'Company Name',
            tagline: 'Your Company Tagline',
            email: 'info@company.com',
            phone: '+62 xxx xxxx xxxx',
            address: 'Jl. Contoh No. 1, Jakarta',
        },
    })

    console.log('✅ Seed berhasil! Login: admin@company.com / admin123')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())