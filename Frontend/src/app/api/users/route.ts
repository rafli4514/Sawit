import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { riwayat: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data user' }, { status: 500 })
  }
}

export async function POST(Request: Request) {
  try {
    const { email, nama, password } = await Request.json()
    const newUser = await prisma.user.create({
      data: { email, nama, password, role: 'USER' },
      select: { id: true, nama: true, email: true, role: true }
    })
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal membuat user baru' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json()
    await prisma.user.delete({ where: { id: parseInt(userId) } })
    return NextResponse.json({ message: 'User berhasil dihapus' })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus user' }, { status: 500 })
  }
}

// Update Role User (misal jadikan Admin)
export async function PATCH(request: Request) {
  try {
    const { userId, role } = await request.json()
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: { id: true, nama: true, role: true }
    })
    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ message: 'Gagal update role' }, { status: 500 })
  }
}
