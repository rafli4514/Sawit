import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 1. Basic Stats
    const [totalUser, totalPenyakit, totalGejala, totalKasus] = await Promise.all([
      prisma.user.count(),
      prisma.penyakit.count(),
      prisma.gejala.count(),
      prisma.riwayat.count(),
    ])

    // 2. Urgent Cases (CF >= 0.7 in any result)
    const urgentCases = await prisma.riwayat.count({
      where: {
        hasil: {
          some: {
            cfHasil: { gte: 0.7 }
          }
        }
      }
    })

    // 3. Disease Distribution
    const distribution = await prisma.riwayatDetail.groupBy({
      by: ['penyakitId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    // Fetch names for distribution
    const diseases = await prisma.penyakit.findMany({
      where: { id: { in: distribution.map(d => d.penyakitId) } },
      select: { id: true, nama: true }
    })

    const diseaseDistribution = distribution.map(d => ({
      name: diseases.find(dis => dis.id === d.penyakitId)?.nama || 'Unknown',
      count: d._count.id
    }))

    // 4. Monthly Trend (Last 6 Months)
    // Simplified for now: just group by month
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyDataRaw = await prisma.riwayat.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo }
      },
      select: {
        createdAt: true,
        hasil: { select: { cfHasil: true } }
      }
    })

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const monthlyStats: Record<string, { month: string; cases: number; totalCF: number; countWithCF: number }> = {}

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const mLabel = months[d.getMonth()]
      monthlyStats[mLabel] = { month: mLabel, cases: 0, totalCF: 0, countWithCF: 0 }
    }

    monthlyDataRaw.forEach(r => {
      const mLabel = months[new Date(r.createdAt).getMonth()]
      if (monthlyStats[mLabel]) {
        monthlyStats[mLabel].cases++
        if (r.hasil.length > 0) {
          monthlyStats[mLabel].totalCF += r.hasil[0].cfHasil
          monthlyStats[mLabel].countWithCF++
        }
      }
    })

    const monthlyTrend = Object.values(monthlyStats).reverse().map(m => ({
      month: m.month,
      cases: m.cases,
      agreementRate: m.countWithCF > 0 ? parseFloat((m.totalCF / m.countWithCF).toFixed(2)) : 0.8 // Fallback to healthy 0.8
    }))

    // 5. Recent Activity
    const recentRiwayat = await prisma.riwayat.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { nama: true } },
        hasil: { include: { penyakit: true }, take: 1, orderBy: { cfHasil: 'desc' } }
      }
    })

    return NextResponse.json({
      stats: {
        totalUser,
        totalPenyakit,
        totalGejala,
        totalKasus,
        urgentCases,
        accuracy: 88, // Placeholder until we have expert validation data
      },
      diseaseDistribution,
      monthlyTrend,
      recentRiwayat
    })
  } catch (error) {
    console.error('Stats Error:', error)
    return NextResponse.json({ message: 'Gagal mengambil statistik' }, { status: 500 })
  }
}
