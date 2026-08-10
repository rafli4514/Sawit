import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId, diagnosaResults } = await request.json()
    const riwayat = await prisma.riwayat.create({
      data: {
        userId,
        hasil: {
          create: diagnosaResults.map((res: { diseaseId: number; cfScore: number }) => ({
            penyakitId: res.diseaseId,
            cfHasil: res.cfScore,
          })),
        },
      },
      include: { hasil: true },
    })
    return NextResponse.json({ message: 'Riwayat berhasil disimpan', riwayat }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menyimpan riwayat' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || '' // Cari berdasarkan nama penyakit
  const skip = (page - 1) * limit

  try {
    // Filter logic
    const whereClause: any = {}
    if (userId) whereClause.userId = parseInt(userId)
    if (search) {
      whereClause.hasil = {
        some: { penyakit: { nama: { contains: search } } }
      }
    }

    const [data, total] = await Promise.all([
      prisma.riwayat.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: { select: { nama: true, email: true } },
          hasil: { include: { penyakit: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.riwayat.count({ where: whereClause })
    ])

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal ambil data' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ message: 'ID riwayat dibutuhkan' }, { status: 400 })
  try {
    await prisma.riwayatDetail.deleteMany({ where: { riwayatId: parseInt(id) } })
    await prisma.riwayat.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ message: 'Riwayat berhasil dihapus' })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus riwayat' }, { status: 500 })
  }
}
