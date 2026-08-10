import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// GET: Ambil detail profil user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ message: 'UserId dibutuhkan' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data profil' }, { status: 500 })
  }
}

// PATCH: Update profil (Nama, Email, atau Password)
export async function PATCH(request: Request) {
  try {
    const { userId, nama, email, currentPassword, newPassword } = await request.json()

    if (!userId) {
      return NextResponse.json({ message: 'UserId dibutuhkan' }, { status: 400 })
    }

    // Cari user dulu
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    })

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
    }

    const updateData: any = {}
    if (nama) updateData.nama = nama
    if (email) updateData.email = email

    // Jika ingin ganti password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'Password lama dibutuhkan untuk ganti password baru' }, { status: 400 })
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Password lama salah' }, { status: 401 })
      }

      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
      select: {
        id: true,
        nama: true,
        email: true,
      },
    })

    return NextResponse.json({ message: 'Profil berhasil diperbarui', user: updatedUser })
  } catch (error) {
    console.error('Update Profile Error:', error)
    return NextResponse.json({ message: 'Gagal memperbarui profil' }, { status: 500 })
  }
}

// DELETE: Hapus akun
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ message: 'UserId dibutuhkan' }, { status: 400 })
  }

  try {
    // Prisma akan menghapus riwayat secara otomatis jika kita set onDelete: Cascade di schema,
    // tapi karena di schema kita belum ada, kita hapus manual atau biarkan error jika ada relasi.
    // Untuk amannya, kita hapus riwayat dulu:
    await prisma.riwayatDetail.deleteMany({
      where: { riwayat: { userId: parseInt(userId) } }
    })
    await prisma.riwayat.deleteMany({
      where: { userId: parseInt(userId) }
    })

    await prisma.user.delete({
      where: { id: parseInt(userId) },
    })

    return NextResponse.json({ message: 'Akun berhasil dihapus' })
  } catch (error) {
    console.error('Delete Account Error:', error)
    return NextResponse.json({ message: 'Gagal menghapus akun' }, { status: 500 })
  }
}
