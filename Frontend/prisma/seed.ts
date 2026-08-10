import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // 1. Seed Admin
  await prisma.user.upsert({
    where: { email: 'admin@nyawit.com' },
    update: {},
    create: {
      email: 'admin@nyawit.com',
      nama: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // 2. Daftar Gejala
  const gejalaList = [
    { kode: 'G01', nama: 'Daun menjadi layu / anak daun layu' },
    { kode: 'G02', nama: 'Daun kekuningan / berubah warna menjadi hijau pucat atau kuning' },
    { kode: 'G03', nama: 'Daun timbul bercak-bercak lonjong berwarna kuning' },
    { kode: 'G04', nama: 'Akar menjadi lunak' },
    { kode: 'G05', nama: 'Busuk pada akar' },
    { kode: 'G06', nama: 'Daun muda berubah warna / berwarna coklat di ujungnya' },
    { kode: 'G07', nama: 'Daun rontok sebelum waktunya / pelepah rontok sebelum waktunya' },
    { kode: 'G08', nama: 'Warna daun hijau pucat' },
    { kode: 'G09', nama: 'Pelepah daun akan patah / sengkleh (patah pangkal pelepah)' },
    { kode: 'G10', nama: 'Pelepah daun menggantung pada batang pohonnya' },
    { kode: 'G11', nama: 'Daun muda (tombak) tidak membuka sepenuhnya / melengkung / tidak membuka secara total' },
    { kode: 'G12', nama: 'Tumbuh jamur / badan buah jamur pada pangkal batang atau akar' },
    { kode: 'G13', nama: 'Tanaman tumbang / roboh / pertumbuhan tanaman tidak normal' },
    { kode: 'G14', nama: 'Kuncup membusuk / mengeluarkan aroma busuk pada pangkal jaringan' },
    { kode: 'G15', nama: 'Kuncup mengeluarkan bau busuk' },
    { kode: 'G16', nama: 'Pelepah bengkok / menunduk ke arah bawah di bagian tengahnya' },
    { kode: 'G17', nama: 'Tanaman mengalami pertumbuhan yang lambat atau berhenti / kerdil' },
    { kode: 'G18', nama: 'Daun mengalami dehidrasi / kering' },
    { kode: 'G19', nama: 'Bercak berwarna kuning dan bagian tengahnya berwarna cokelat pada helaian daun' },
    { kode: 'G20', nama: 'Daun berukuran kecil / daun tajuk tumbuh lebih kecil bukan tambah besar' },
    { kode: 'G21', nama: 'Daun Sobek / helai daun tidak tumbuh' },
    { kode: 'G22', nama: 'Helai daun tidak tumbuh / tidak ada sama sekali pada pelepah' },
    { kode: 'G23', nama: 'Pelepah berwarna cokelat kemerahan' },
    { kode: 'G24', nama: 'Jamur berwarna putih / rizomorf jamur berwarna putih pada permukaan buah' },
    { kode: 'G25', nama: 'Buah menjadi kering / keriput' },
    { kode: 'G26', nama: 'Pangkal buah busuk' },
    { kode: 'G27', nama: 'Biji buah busuk / buah membusuk / rusak' },
    { kode: 'G28', nama: 'Warna buah berubah menjadi kecoklatan' },
    { kode: 'G29', nama: 'Warna buah berubah menjadi kehitaman' },
    { kode: 'G30', nama: 'Biji buah menjadi rontok' },
    { kode: 'G31', nama: 'Buah mengeluarkan bau busuk' }
  ]

  const dbGejala: Record<string, any> = {}
  for (const g of gejalaList) {
    dbGejala[g.kode] = await prisma.gejala.upsert({
      where: { kode: g.kode },
      update: { nama: g.nama },
      create: g,
    })
  }

  // 3. Daftar Penyakit
  const penyakitList = [
    {
      kode: 'P01',
      nama: 'Akar (Blast disease)',
      deskripsi: 'Penyakit yang menyerang perakaran tanaman kelapa sawit muda di pembibitan maupun tanaman dewasa, menyebabkan pembusukan akar dan menghambat penyerapan air dan nutrisi.',
      solusi: 'Sanitasi Kebun: Untuk mencegah penyebaran patogen, tanaman yang terinfeksi parah harus dicabut dan dimusnahkan. Penggunaan Agen Hayati: Gunakan jamur yang bersifat antagonis, seperti Trichoderma, untuk menghentikan perkembangan patogen. Perbaikan Drainase: Pastikan sistem drainase yang baik untuk mencegah tanah terlalu lembab, yang dapat memicu pertumbuhan jamur patogen.'
    },
    {
      kode: 'P02',
      nama: 'Busuk Pangkal Batang (Ganoderma)',
      deskripsi: 'Penyakit busuk pangkal batang yang paling mematikan bagi kelapa sawit dewasa disebabkan oleh jamur Ganoderma boninense.',
      solusi: 'Penggunaan Bibit Sehat: Untuk mencegah penyebaran penyakit, tanam bibit yang tidak terinfeksi. Sanitasi dan Pemusnahan: Untuk mengurangi sumber inokulum, tanaman yang terinfeksi berat dibongkar dan dimusnahkan. Penggunaan Fungisida secara preventif pada tanaman sehat.'
    },
    {
      kode: 'P03',
      nama: 'Busuk Kuncup (Spear rot)',
      deskripsi: 'Penyakit yang menyerang bagian kuncup daun muda (tombak) kelapa sawit sehingga membusuk dan tidak membuka dengan normal.',
      solusi: 'Pemangkasan Bagian Terinfeksi: Potong bagian kuncup yang membusuk untuk mencegah penyebaran infeksi lebih lanjut. Oleskan fungisida yang sesuai di area potongan dan sekelilingnya. Tingkatkan aerasi kebun.'
    },
    {
      kode: 'P04',
      nama: 'Garis Kuning (Patch yellow)',
      deskripsi: 'Penyakit bercak daun atau garis kuning pada kelapa sawit yang menyerang helaian daun akibat infeksi jamur Fusarium oxysporum.',
      solusi: 'Gunakan bibit yang resisten. Lakukan pemangkasan pelepah yang sakit secara rutin dan bakar sisa tanaman untuk sanitasi lahan.'
    },
    {
      kode: 'P05',
      nama: 'Tajuk (Crown disease)',
      deskripsi: 'Penyakit gangguan pertumbuhan tajuk tanaman muda di mana pelepah tumbuh membengkok, rapuh, atau tidak terbentuk secara utuh.',
      solusi: 'Identifikasi penyebab spesifik (apakah faktor nutrisi, hama, atau patogen). Lakukan pemupukan seimbang (terutama K, B, dan Mg) serta pembersihan gulma di sekitar piringan.'
    },
    {
      kode: 'P06',
      nama: 'Busuk Tandan (Marasmius)',
      deskripsi: 'Penyakit pembusukan buah atau tandan kelapa sawit yang disebabkan oleh jamur Marasmius palmivorus.',
      solusi: 'Lakukan penyerbukan buatan secara efektif untuk mengurangi bunga jantan yang membusuk. Lakukan pemangkasan pelepah mati, pembersihan buah busuk dari pohon, dan semprot dengan fungisida tembaga jika serangan parah.'
    },
    {
      kode: 'P07',
      nama: 'Anthracnose',
      deskripsi: 'Penyakit bercak daun pada bibit kelapa sawit yang disebabkan oleh kompleks jamur Melanconium, Glomerella, atau Botryodiplodia.',
      solusi: 'Pencegahan dengan menjaga kelembaban pembibitan agar tidak terlalu basah. Lakukan pemisahan/karantina bibit bergejala dan semprotkan fungisida kontak berbahan aktif mankozeb atau fungisida sistemik.'
    },
    {
      kode: 'P08',
      nama: 'Daun Mengecil',
      deskripsi: 'Gangguan fisiologis atau penyakit akibat defisiensi unsur hara mikro (seperti Boron) atau serangan hama/virus yang menyebabkan pertumbuhan daun menjadi mengecil dan tidak berkembang sempurna.',
      solusi: 'Lakukan aplikasi pupuk mikro Boron (Borate) secara teratur pada tanah atau ketiak pelepah tanaman sawit yang bergejala sesuai dosis anjuran.'
    }
  ]

  const dbPenyakit: Record<string, any> = {}
  for (const p of penyakitList) {
    dbPenyakit[p.kode] = await prisma.penyakit.upsert({
      where: { kode: p.kode },
      update: { nama: p.nama, deskripsi: p.deskripsi, solusi: p.solusi },
      create: p,
    })
  }

  // 4. Daftar Aturan Certainty Factor (CF Pakar)
  const rules = [
    // P01: Akar (Blast disease)
    { penyakitKode: 'P01', gejalaKode: 'G01', cf: 1.0 },
    { penyakitKode: 'P01', gejalaKode: 'G02', cf: 0.6 },
    { penyakitKode: 'P01', gejalaKode: 'G03', cf: 0.4 },
    { penyakitKode: 'P01', gejalaKode: 'G04', cf: 0.4 },
    { penyakitKode: 'P01', gejalaKode: 'G05', cf: 1.0 },
    { penyakitKode: 'P01', gejalaKode: 'G08', cf: 0.8 },
    { penyakitKode: 'P01', gejalaKode: 'G11', cf: 0.8 },
    { penyakitKode: 'P01', gejalaKode: 'G12', cf: 0.8 },
    { penyakitKode: 'P01', gejalaKode: 'G13', cf: 0.8 },

    // P02: Busuk Pangkal Batang (Ganoderma)
    { penyakitKode: 'P02', gejalaKode: 'G01', cf: 1.0 },
    { penyakitKode: 'P02', gejalaKode: 'G02', cf: 0.6 },
    { penyakitKode: 'P02', gejalaKode: 'G03', cf: 0.8 },
    { penyakitKode: 'P02', gejalaKode: 'G04', cf: 0.4 },
    { penyakitKode: 'P02', gejalaKode: 'G05', cf: 0.6 },
    { penyakitKode: 'P02', gejalaKode: 'G06', cf: 0.2 },
    { penyakitKode: 'P02', gejalaKode: 'G07', cf: 0.8 },
    { penyakitKode: 'P02', gejalaKode: 'G08', cf: 1.0 },
    { penyakitKode: 'P02', gejalaKode: 'G09', cf: 1.0 },
    { penyakitKode: 'P02', gejalaKode: 'G10', cf: 1.0 },
    { penyakitKode: 'P02', gejalaKode: 'G11', cf: 1.0 },
    { penyakitKode: 'P02', gejalaKode: 'G12', cf: 1.0 },
    { penyakitKode: 'P02', gejalaKode: 'G13', cf: 0.6 },
    { penyakitKode: 'P02', gejalaKode: 'G16', cf: 0.8 },

    // P03: Busuk Kuncup (Spear rot)
    { penyakitKode: 'P03', gejalaKode: 'G02', cf: 0.8 },
    { penyakitKode: 'P03', gejalaKode: 'G05', cf: 0.8 },
    { penyakitKode: 'P03', gejalaKode: 'G06', cf: 1.0 },
    { penyakitKode: 'P03', gejalaKode: 'G07', cf: 0.8 },
    { penyakitKode: 'P03', gejalaKode: 'G08', cf: 0.8 },
    { penyakitKode: 'P03', gejalaKode: 'G10', cf: 0.6 },
    { penyakitKode: 'P03', gejalaKode: 'G14', cf: 1.0 },
    { penyakitKode: 'P03', gejalaKode: 'G15', cf: 1.0 },
    { penyakitKode: 'P03', gejalaKode: 'G16', cf: 0.4 },
    { penyakitKode: 'P03', gejalaKode: 'G17', cf: 0.6 },

    // P04: Garis Kuning (Patch yellow)
    { penyakitKode: 'P04', gejalaKode: 'G01', cf: 0.8 },
    { penyakitKode: 'P04', gejalaKode: 'G03', cf: 0.6 },
    { penyakitKode: 'P04', gejalaKode: 'G06', cf: 0.8 },
    { penyakitKode: 'P04', gejalaKode: 'G07', cf: 0.6 },
    { penyakitKode: 'P04', gejalaKode: 'G09', cf: 0.8 },
    { penyakitKode: 'P04', gejalaKode: 'G13', cf: 0.8 },
    { penyakitKode: 'P04', gejalaKode: 'G18', cf: 0.6 },
    { penyakitKode: 'P04', gejalaKode: 'G19', cf: 1.0 },
    { penyakitKode: 'P04', gejalaKode: 'G20', cf: 0.8 },

    // P05: Tajuk (Crown disease)
    { penyakitKode: 'P05', gejalaKode: 'G08', cf: 0.8 },
    { penyakitKode: 'P05', gejalaKode: 'G10', cf: 0.8 },
    { penyakitKode: 'P05', gejalaKode: 'G14', cf: 1.0 },
    { penyakitKode: 'P05', gejalaKode: 'G16', cf: 1.0 },
    { penyakitKode: 'P05', gejalaKode: 'G20', cf: 0.6 },
    { penyakitKode: 'P05', gejalaKode: 'G21', cf: 0.6 },
    { penyakitKode: 'P05', gejalaKode: 'G22', cf: 0.2 },
    { penyakitKode: 'P05', gejalaKode: 'G23', cf: 0.8 },

    // P06: Busuk Tandan
    { penyakitKode: 'P06', gejalaKode: 'G12', cf: 1.0 },
    { penyakitKode: 'P06', gejalaKode: 'G16', cf: 0.6 },
    { penyakitKode: 'P06', gejalaKode: 'G17', cf: 1.0 },
    { penyakitKode: 'P06', gejalaKode: 'G18', cf: 0.6 },
    { penyakitKode: 'P06', gejalaKode: 'G22', cf: 0.8 },
    { penyakitKode: 'P06', gejalaKode: 'G24', cf: 1.0 },
    { penyakitKode: 'P06', gejalaKode: 'G25', cf: 0.2 },
    { penyakitKode: 'P06', gejalaKode: 'G26', cf: 0.2 },
    { penyakitKode: 'P06', gejalaKode: 'G27', cf: 0.4 },
    { penyakitKode: 'P06', gejalaKode: 'G28', cf: 0.8 },
    { penyakitKode: 'P06', gejalaKode: 'G29', cf: 1.0 },
    { penyakitKode: 'P06', gejalaKode: 'G30', cf: 0.4 },
    { penyakitKode: 'P06', gejalaKode: 'G31', cf: 0.2 },

    // P07: Anthracnose (Dari Jurnal BIMASATI)
    { penyakitKode: 'P07', gejalaKode: 'G06', cf: 0.8 },
    { penyakitKode: 'P07', gejalaKode: 'G13', cf: 0.6 },

    // P08: Daun Mengecil (Dari Jurnal BIMASATI)
    { penyakitKode: 'P08', gejalaKode: 'G07', cf: 0.8 },
    { penyakitKode: 'P08', gejalaKode: 'G13', cf: 0.8 },
    { penyakitKode: 'P08', gejalaKode: 'G20', cf: 0.8 }
  ]

  // Bersihkan data rules lama agar tidak terjadi duplikasi unik
  await prisma.rule.deleteMany({})

  for (const r of rules) {
    const penyakitId = dbPenyakit[r.penyakitKode]?.id
    const gejalaId = dbGejala[r.gejalaKode]?.id

    if (penyakitId && gejalaId) {
      await prisma.rule.create({
        data: {
          penyakitId,
          gejalaId,
          cfPakar: r.cf
        }
      })
    }
  }

  console.log('✅ Database Seeding selesai! Seluruh basis data dari 3 Jurnal PDF berhasil dimigrasikan.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
