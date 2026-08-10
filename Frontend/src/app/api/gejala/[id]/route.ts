import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const gejala = await prisma.gejala.findUnique({
      where: { id: parseInt(id) }
    })
    if (!gejala) return NextResponse.json({ message: 'Gejala tidak ditemukan' }, { status: 404 })
    return NextResponse.json(gejala)
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
    const updated = await prisma.gejala.update({
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
    await prisma.rule.deleteMany({ where: { gejalaId: id } })
    await prisma.gejala.delete({ where: { id } })
    return NextResponse.json({ message: 'Gejala berhasil dihapus' })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus data' }, { status: 500 })
  }
}
