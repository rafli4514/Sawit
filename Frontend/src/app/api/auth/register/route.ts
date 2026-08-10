import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { nama, email, password } = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Simpan user baru
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { message: 'User berhasil didaftarkan', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register Error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
