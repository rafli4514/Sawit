import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Ambil semua daftar penyakit
export async function GET() {
  try {
    const penyakit = await prisma.penyakit.findMany({
      orderBy: { kode: 'asc' }
    })
    return NextResponse.json(penyakit)
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data penyakit' }, { status: 500 })
  }
}

// POST: Tambah penyakit baru
export async function POST(request: Request) {
  try {
    const { kode, nama, deskripsi, solusi } = await request.json()

    const newPenyakit = await prisma.penyakit.create({
      data: { kode, nama, deskripsi, solusi }
    })

    return NextResponse.json(newPenyakit, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menambah penyakit' }, { status: 500 })
  }
}
