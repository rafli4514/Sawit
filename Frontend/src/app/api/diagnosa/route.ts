import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { runDiagnosis } from '@/app/engine/cfEngine'

export async function POST(request: Request) {
  try {
    const { userId, symptoms } = await request.json() 
    // symptoms: [{ symptomId: 1, userConfidence: 0.8 }, ...]

    // 1. Ambil semua data pendukung dari DB
    const [rules, diseases] = await Promise.all([
      prisma.rule.findMany(),
      prisma.penyakit.findMany()
    ])

    // Format data DB ke format yang diminta engine
    const formattedRules = rules.map(r => ({
      id: r.id,
      code: `R-${r.id}`,
      title: `Rule ${r.id}`,
      active: true,
      antecedents: [{ symptomId: r.gejalaId, minConfidence: 0.1 }],
      consequents: [{ diseaseId: r.penyakitId, cf: r.cfPakar }]
    }))

    const formattedDiseases = diseases.map(d => ({
      id: d.id,
      name: d.nama,
      severityLevel: 'medium' as any,
      treatmentId: 1
    }))

    // 2. Jalankan Engine
    const result = runDiagnosis(symptoms, formattedRules as any, formattedDiseases as any)

    // 3. Jika ada userId, simpan otomatis ke Riwayat
    if (userId && result.diagnoses.length > 0) {
      await prisma.riwayat.create({
        data: {
          userId: parseInt(userId),
          hasil: {
            create: result.diagnoses.map(d => ({
              penyakitId: d.diseaseId,
              cfHasil: d.cfScore
            }))
          }
        }
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Diagnosis Error:', error)
    return NextResponse.json({ message: 'Gagal menjalankan diagnosa' }, { status: 500 })
  }
}
