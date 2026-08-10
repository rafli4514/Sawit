import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Ambil semua aturan (Rules) beserta data gejala dan penyakitnya
export async function GET() {
  try {
    const rules = await prisma.rule.findMany({
      include: {
        penyakit: true,
        gejala: true,
      },
      orderBy: { penyakit: { kode: 'asc' } }
    })
    return NextResponse.json(rules)
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data aturan' }, { status: 500 })
  }
}

// POST: Tambah atau Update aturan (Upsert)
export async function POST(request: Request) {
  try {
    const { penyakitId, gejalaId, cfPakar } = await request.json()

    const rule = await prisma.rule.upsert({
      where: {
        penyakitId_gejalaId: {
          penyakitId: parseInt(penyakitId),
          gejalaId: parseInt(gejalaId),
        },
      },
      update: {
        cfPakar: parseFloat(cfPakar),
      },
      create: {
        penyakitId: parseInt(penyakitId),
        gejalaId: parseInt(gejalaId),
        cfPakar: parseFloat(cfPakar),
      },
    })

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error('Save Rule Error:', error)
    return NextResponse.json({ message: 'Gagal menyimpan aturan' }, { status: 500 })
  }
}

// DELETE: Hapus aturan tertentu
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const penyakitId = searchParams.get('penyakitId')
    const gejalaId = searchParams.get('gejalaId')

    if (id) {
      await prisma.rule.delete({
        where: { id: parseInt(id) }
      })
    } else if (penyakitId && gejalaId) {
      await prisma.rule.delete({
        where: {
          penyakitId_gejalaId: {
            penyakitId: parseInt(penyakitId),
            gejalaId: parseInt(gejalaId),
          },
        },
      })
    } else {
      return NextResponse.json({ message: 'ID atau pasangan (penyakitId, gejalaId) dibutuhkan' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Aturan berhasil dihapus' })
  } catch (error) {
    console.error('Delete Rule Error:', error)
    return NextResponse.json({ message: 'Gagal menghapus aturan' }, { status: 500 })
  }
}
