import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const penyakit = await prisma.penyakit.findUnique({
      where: { id: parseInt(id) },
      include: { rules: { include: { gejala: true } } }
    })
    if (!penyakit) return NextResponse.json({ message: 'Penyakit tidak ditemukan' }, { status: 404 })
    return NextResponse.json(penyakit)
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = await prisma.penyakit.update({
      where: { id: parseInt(id) },
      data: body
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ message: 'Gagal update data' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    // Hapus relasi dulu
    await prisma.rule.deleteMany({ where: { penyakitId: id } })
    await prisma.riwayatDetail.deleteMany({ where: { penyakitId: id } })
    
    await prisma.penyakit.delete({ where: { id } })
    return NextResponse.json({ message: 'Penyakit berhasil dihapus' })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus data' }, { status: 500 })
  }
}
