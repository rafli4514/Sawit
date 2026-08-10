import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Ambil semua daftar gejala
export async function GET() {
  try {
    const gejala = await prisma.gejala.findMany({
      orderBy: { kode: 'asc' }
    })
    return NextResponse.json(gejala)
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data gejala' }, { status: 500 })
  }
}

// POST: Tambah gejala baru
export async function POST(request: Request) {
  try {
    const { kode, nama, imageUrl } = await request.json()

    const newGejala = await prisma.gejala.create({
      data: { kode, nama, imageUrl: imageUrl || null }
    })

    return NextResponse.json(newGejala, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menambah gejala' }, { status: 500 })
  }
}
