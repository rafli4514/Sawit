import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ message: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.' }, { status: 400 })
    }

    // Validasi ukuran file (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'Ukuran file maksimal 5MB.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Buat nama file unik dengan timestamp
    const ext = file.name.split('.').pop() || 'jpg'
    const uniqueName = `gejala_${Date.now()}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gejala')

    // Pastikan folder ada
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, uniqueName)
    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/gejala/${uniqueName}`

    return NextResponse.json({ url: publicUrl }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ message: 'Gagal mengunggah file' }, { status: 500 })
  }
}
