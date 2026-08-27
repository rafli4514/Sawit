import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  console.log('🧹 Membersihkan seluruh data lama di database...')
  // Bersihkan data relasi dan riwayat lama agar database 100% bersih
  await prisma.riwayatDetail.deleteMany({})
  await prisma.riwayat.deleteMany({})
  await prisma.rule.deleteMany({})
  await prisma.gejala.deleteMany({})
  await prisma.penyakit.deleteMany({})

  // 1. Seed Admin
  await prisma.user.upsert({
    where: { email: 'admin@nyawit.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@nyawit.com',
      nama: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // 2. Daftar Tepat 38 Gejala Fisik Terpadu (Penyakit & Hama)
  const gejalaList = [
    // Bagian Daun & Pelepah
    { kode: 'G01', nama: 'Daun menjadi layu', imageUrl: '/gejala/G01.png' },
    { kode: 'G02', nama: 'Daun mengalami klorosis menguning atau hijau pucat', imageUrl: '/gejala/G02.png' },
    { kode: 'G03', nama: 'Daun timbul bercak-bercak lonjong berwarna kuning', imageUrl: '/gejala/G03.png' },
    { kode: 'G04', nama: 'Daun muda berwarna cokelat gelap hingga nekrosis di ujungnya', imageUrl: '/gejala/G04.png' },
    { kode: 'G05', nama: 'Pelepah daun patah atau sengkleh dan menggantung pada batang', imageUrl: '/gejala/G05.png' },
    { kode: 'G06', nama: 'Pelepah bengkok atau melengkung menunduk ke bawah di bagian tengahnya', imageUrl: '/gejala/G06.png' },
    { kode: 'G07', nama: 'Pelepah berubah warna menjadi cokelat kemerahan', imageUrl: '/gejala/G07.png' },
    { kode: 'G08', nama: 'Daun muda tidak membuka total atau tegak melengkung', imageUrl: '/gejala/G08.png' },
    { kode: 'G09', nama: 'Bercak kuning pada daun dengan bagian tengah berwarna cokelat', imageUrl: '/gejala/G09.png' },
    { kode: 'G10', nama: 'Daun berukuran kecil atau tajuk baru tumbuh kerdil dan kaku', imageUrl: '/gejala/G10.png' },
    { kode: 'G11', nama: 'Daun sobek-sobek atau helaian daun tidak berkembang normal', imageUrl: '/gejala/G11.png' },
    { kode: 'G12', nama: 'Daun mengalami dehidrasi berat atau mengering kecokelatan', imageUrl: '/gejala/G12.png' },
    { kode: 'G13', nama: 'Daun atau pelepah gugur atau rontok sebelum waktunya', imageUrl: '/gejala/G13.png' },
    { kode: 'G14', nama: 'Timbul bercak-bercak hitam atau cokelat pada daun bibit muda', imageUrl: '/gejala/G14.png' },

    // Bagian Kuncup, Titik Tumbuh, Batang & Akar
    { kode: 'G15', nama: 'Kuncup atau titik tumbuh membusuk basah dan mengeluarkan aroma bau busuk', imageUrl: '/gejala/G15.png' },
    { kode: 'G16', nama: 'Akar tanaman menjadi lunak, basah, dan jaringan korteks hancur membusuk', imageUrl: '/gejala/G16.png' },
    { kode: 'G17', nama: 'Tumbuh badan buah jamur kipas pada pangkal batang atau akar', imageUrl: '/gejala/G17.png' },
    { kode: 'G18', nama: 'Batang bagian atas (1-2 meter di atas tanah) membusuk dan patah', imageUrl: '/gejala/G18.png' },
    { kode: 'G19', nama: 'Batang tampak berongga dan terdapat serbuk kayu halus di pangkal batang', imageUrl: '/gejala/G19.png' },
    { kode: 'G20', nama: 'Lubang-lubang gerekan kecil pada batang kelapa sawit', imageUrl: '/gejala/G20.png' },
    { kode: 'G21', nama: 'Ditemukan sarang rayap atau lorong tanah di sekitar perakaran dan pangkal batang', imageUrl: '/gejala/G21.png' },
    { kode: 'G22', nama: 'Tanaman roboh atau tumbang atau mati mendadak', imageUrl: '/gejala/G22.png' },

    // Bagian Bunga, Buah & Produktivitas
    { kode: 'G23', nama: 'Rizomorf jamur berwarna putih atau miselium menyelimuti tandan buah', imageUrl: '/gejala/G23.png' },
    { kode: 'G24', nama: 'Pangkal buah membusuk basah dan tandan buah rusak berbau busuk', imageUrl: '/gejala/G24.png' },
    { kode: 'G25', nama: 'Buah menjadi keriput, kering, dan gagal berkembang', imageUrl: '/gejala/G25.png' },
    { kode: 'G26', nama: 'Warna buah berubah kehitaman dan biji atau brondolan rontok prematur', imageUrl: '/gejala/G26.png' },
    { kode: 'G27', nama: 'Tandan bunga atau bunga tombak tidak membuka atau pembentukan bunga terhambat', imageUrl: '/gejala/G27.png' },
    { kode: 'G28', nama: 'Penurunan drastis produksi Tandan Buah Segar mencapai 40% - 60%', imageUrl: '/gejala/G28.png' },

    // Gejala Khusus 4 Hama
    { kode: 'G29', nama: 'Kerusakan pada bibit kelapa sawit akibat gigitan hama pengerat', imageUrl: '/gejala/G29.png' },
    { kode: 'G30', nama: 'Bekas keratan gigi pengerat pada pangkal pelepah tanaman', imageUrl: '/gejala/G30.png' },
    { kode: 'G31', nama: 'Bekas gigitan pengerat pada buah mentah atau masak hingga merusak inti sawit', imageUrl: '/gejala/G31.png' },
    { kode: 'G32', nama: 'Tanaman kelapa sawit mati akibat pengeratan pada titik tumbuh bibit', imageUrl: '/gejala/G32.png' },
    { kode: 'G33', nama: 'Helaian daun berlubang-lubang akibat gigitan ulat pemakan daun', imageUrl: '/gejala/G33.png' },
    { kode: 'G34', nama: 'Kerusakan parah pada daun bagian bawah tajuk hingga kehilangan lebih dari 80% daun', imageUrl: '/gejala/G34.png' },
    { kode: 'G35', nama: 'Helaian daun terkikis habis hingga hanya tersisa tulang lidi (tajuk bawah abu-abu)', imageUrl: '/gejala/G35.png' },
    { kode: 'G36', nama: 'Daun tajuk bagian bawah tampak kering berwarna abu-abu kusam', imageUrl: '/gejala/G36.png' },
    { kode: 'G37', nama: 'Terdapat kantong-kantong ulat menggantung pada permukaan bawah pelepah', imageUrl: '/gejala/G37.png' },
    { kode: 'G38', nama: 'Helaian daun tidak utuh dan tampak rusak bergerigi akibat ulat kantong', imageUrl: '/gejala/G38.png' },
  ]

  const dbGejala: Record<string, any> = {}
  for (const g of gejalaList) {
    dbGejala[g.kode] = await prisma.gejala.upsert({
      where: { kode: g.kode },
      update: { nama: g.nama, imageUrl: g.imageUrl },
      create: g,
    })
  }

  // 3. Daftar 12 Penyakit & Hama (HPT)
  const penyakitList = [
    {
      kode: 'P01',
      nama: 'Akar (Blast disease)',
      deskripsi: 'Penyakit yang menyerang perakaran tanaman kelapa sawit muda di pembibitan maupun tanaman dewasa, menyebabkan pembusukan akar dan menghambat penyerapan air dan nutrisi.',
      solusi: 'Sanitasi Kebun: Untuk mencegah penyebaran patogen, tanaman yang terinfeksi parah harus dicabut dan dimusnahkan. Penggunaan Agen Hayati: Gunakan jamur antagonis Trichoderma untuk menghentikan patogen. Perbaikan Drainase: Pastikan sistem drainase baik untuk mencegah genangan air.'
    },
    {
      kode: 'P02',
      nama: 'Busuk Pangkal Batang (Ganoderma)',
      deskripsi: 'Penyakit busuk pangkal batang yang paling mematikan bagi kelapa sawit dewasa disebabkan oleh jamur Ganoderma boninense / lucidum.',
      solusi: 'Penggunaan Bibit Sehat: Tanam bibit yang telah teruji resisten. Sanitasi dan Pemusnahan: Bongkar dan musnahkan tanaman yang terinfeksi berat. Penggunaan Fungisida heksakonazol atau tabur Trichoderma harzianum.'
    },
    {
      kode: 'P03',
      nama: 'Busuk Kuncup (Spear rot)',
      deskripsi: 'Penyakit yang menyerang bagian kuncup daun muda (tombak) kelapa sawit sehingga membusuk dan tidak membuka dengan normal.',
      solusi: 'Pemangkasan Bagian Terinfeksi: Potong bagian kuncup yang membusuk untuk mencegah penyebaran infeksi. Oleskan fungisida tembaga di area potongan. Tingkatkan aerasi kebun.'
    },
    {
      kode: 'P04',
      nama: 'Garis Kuning (Patch yellow)',
      deskripsi: 'Penyakit bercak daun atau garis kuning pada kelapa sawit yang menyerang helaian daun akibat infeksi jamur Fusarium oxysporum.',
      solusi: 'Gunakan bibit yang resisten. Lakukan pemangkasan pelepah yang sakit secara rutin dan berikan pemupukan kalium (KCl/MOP) secara seimbang.'
    },
    {
      kode: 'P05',
      nama: 'Tajuk (Crown disease)',
      deskripsi: 'Penyakit gangguan pertumbuhan tajuk tanaman muda di mana pelepah tumbuh membengkok, rapuh, atau tidak terbentuk secara utuh akibat faktor genetis atau fisiologis.',
      solusi: 'Lakukan pemupukan seimbang (terutama K, B, dan Mg) serta pembersihan gulma di sekitar piringan.'
    },
    {
      kode: 'P06',
      nama: 'Busuk Tandan (Bunch rot / Marasmius)',
      deskripsi: 'Penyakit pembusukan buah atau tandan kelapa sawit yang disebabkan oleh jamur Marasmius palmivorus.',
      solusi: 'Lakukan penyerbukan buatan secara efektif. Lakukan pemangkasan pelepah mati, sanitasi buah busuk, dan semprot dengan fungisida tembaga jika serangan parah.'
    },
    {
      kode: 'P07',
      nama: 'Anthracnose & Bercak Daun',
      deskripsi: 'Penyakit bercak daun pada bibit kelapa sawit yang disebabkan oleh kompleks jamur Melanconium elaedis, Glomerella, atau Botryodiplodia.',
      solusi: 'Pencegahan dengan menjaga kelembaban pembibitan. Lakukan karantina bibit bergejala dan semprotkan fungisida kontak berbahan aktif mankozeb (Dithane M-45).'
    },
    {
      kode: 'P08',
      nama: 'Busuk Batang Atas (Upper stem rot)',
      deskripsi: 'Penyakit pembusukan pada batang kelapa sawit 1-2 meter di atas permukaan tanah yang disebabkan oleh infeksi jamur Fomes noxius.',
      solusi: 'Pangkas pelepah kering secara higienis, olesi luka bekas pangkasan dengan fungisida pelindung, dan hindari pelukaan mekanis pada batang atas.'
    },

    // 4 Hama Utama
    {
      kode: 'H01',
      nama: 'Hama Tikus (Rattus tiomanicus)',
      deskripsi: 'Hama vertebrata pengerat yang merusak bibit kelapa sawit, pangkal pelepah, serta memakan buah sawit mentah dan masak hingga merusak inti buah.',
      solusi: 'Pengendalian Biologis: Memanfaatkan predator alami burung hantu (Tyto alba) 1 unit per 20-25 ha. Sanitasi Lahan: Pembersihan piringan dan tumpukan pelepah sarang tikus. Pengendalian Kimia: Pemasangan umpan racun rodentisida Kumatetralil/Brodifakum.'
    },
    {
      kode: 'H02',
      nama: 'Hama Rayap (Coptotermes curvignathus)',
      deskripsi: 'Hama serangga perusak kayu dan jaringan tanaman yang menyerang pangkal batang dan akar kelapa sawit, membuat batang berongga dan pohon mudah tumbang.',
      solusi: 'Sanitasi dan Pemusnahan Sarang: Pembongkaran sarang rayap di sekitar perakaran. Pengendalian Kimia: Aplikasi termitisida berbahan aktif fipronil atau klorpirifos dengan metode penyiraman 5 liter per pohon.'
    },
    {
      kode: 'H03',
      nama: 'Hama Ulat Api (Setothosea asigna)',
      deskripsi: 'Hama ulat pemakan daun kelapa sawit yang sangat rakus, menyebabkan daun berlubang hingga habis tersisa tulang daun/lidi, menurunkan produksi TBS hingga 60%.',
      solusi: 'Pengendalian Hayati: Pelepasan bioinsektisida virus Cordyceps atau penanaman Turnera subulata. Pengendalian Kimia: Injeksi batang insektisida sistemik acephate 75 SP.'
    },
    {
      kode: 'H04',
      nama: 'Hama Ulat Kantong (Metisa plana)',
      deskripsi: 'Hama ulat berkantong yang mengikis dan memakan epidermis daun kelapa sawit dari tajuk bagian bawah hingga daun mengering dan tajuk tampak keabu-abuan, menurunkan produksi hingga 40%.',
      solusi: 'Pengendalian Manual: Pengutipan kantong ulat pada serangan awal. Pengendalian Biologis: Aplikasi bioinsektisida Bacillus thuringiensis (Bt). Pengendalian Kimia: Injeksi batang dengan insektisida acephate.'
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

  // 4. Daftar Aturan Certainty Factor (CF Pakar) - 38 Gejala
  const rules = [
    // P01: Akar (Blast disease)
    { penyakitKode: 'P01', gejalaKode: 'G01', cf: 0.85 },
    { penyakitKode: 'P01', gejalaKode: 'G02', cf: 0.60 },
    { penyakitKode: 'P01', gejalaKode: 'G03', cf: 0.50 },
    { penyakitKode: 'P01', gejalaKode: 'G08', cf: 0.80 },
    { penyakitKode: 'P01', gejalaKode: 'G16', cf: 0.95 },
    { penyakitKode: 'P01', gejalaKode: 'G17', cf: 0.80 },
    { penyakitKode: 'P01', gejalaKode: 'G22', cf: 0.80 },

    // P02: Busuk Pangkal Batang (Ganoderma)
    { penyakitKode: 'P02', gejalaKode: 'G01', cf: 0.90 },
    { penyakitKode: 'P02', gejalaKode: 'G02', cf: 0.60 },
    { penyakitKode: 'P02', gejalaKode: 'G03', cf: 0.80 },
    { penyakitKode: 'P02', gejalaKode: 'G04', cf: 0.40 },
    { penyakitKode: 'P02', gejalaKode: 'G05', cf: 0.90 },
    { penyakitKode: 'P02', gejalaKode: 'G06', cf: 0.80 },
    { penyakitKode: 'P02', gejalaKode: 'G08', cf: 0.90 },
    { penyakitKode: 'P02', gejalaKode: 'G16', cf: 0.60 },
    { penyakitKode: 'P02', gejalaKode: 'G17', cf: 0.95 },
    { penyakitKode: 'P02', gejalaKode: 'G22', cf: 0.70 },

    // P03: Busuk Kuncup (Spear rot)
    { penyakitKode: 'P03', gejalaKode: 'G02', cf: 0.80 },
    { penyakitKode: 'P03', gejalaKode: 'G04', cf: 0.90 },
    { penyakitKode: 'P03', gejalaKode: 'G05', cf: 0.60 },
    { penyakitKode: 'P03', gejalaKode: 'G06', cf: 0.40 },
    { penyakitKode: 'P03', gejalaKode: 'G13', cf: 0.70 },
    { penyakitKode: 'P03', gejalaKode: 'G15', cf: 0.95 },
    { penyakitKode: 'P03', gejalaKode: 'G16', cf: 0.75 },

    // P04: Garis Kuning (Patch yellow)
    { penyakitKode: 'P04', gejalaKode: 'G01', cf: 0.80 },
    { penyakitKode: 'P04', gejalaKode: 'G03', cf: 0.60 },
    { penyakitKode: 'P04', gejalaKode: 'G04', cf: 0.80 },
    { penyakitKode: 'P04', gejalaKode: 'G05', cf: 0.75 },
    { penyakitKode: 'P04', gejalaKode: 'G09', cf: 0.90 },
    { penyakitKode: 'P04', gejalaKode: 'G10', cf: 0.80 },
    { penyakitKode: 'P04', gejalaKode: 'G12', cf: 0.60 },
    { penyakitKode: 'P04', gejalaKode: 'G13', cf: 0.60 },
    { penyakitKode: 'P04', gejalaKode: 'G22', cf: 0.75 },

    // P05: Tajuk (Crown disease)
    { penyakitKode: 'P05', gejalaKode: 'G02', cf: 0.80 },
    { penyakitKode: 'P05', gejalaKode: 'G05', cf: 0.80 },
    { penyakitKode: 'P05', gejalaKode: 'G06', cf: 0.90 },
    { penyakitKode: 'P05', gejalaKode: 'G07', cf: 0.80 },
    { penyakitKode: 'P05', gejalaKode: 'G10', cf: 0.60 },
    { penyakitKode: 'P05', gejalaKode: 'G11', cf: 0.80 },
    { penyakitKode: 'P05', gejalaKode: 'G15', cf: 0.85 },

    // P06: Busuk Tandan (Marasmius)
    { penyakitKode: 'P06', gejalaKode: 'G06', cf: 0.60 },
    { penyakitKode: 'P06', gejalaKode: 'G11', cf: 0.80 },
    { penyakitKode: 'P06', gejalaKode: 'G17', cf: 0.85 },
    { penyakitKode: 'P06', gejalaKode: 'G23', cf: 0.95 },
    { penyakitKode: 'P06', gejalaKode: 'G24', cf: 0.75 },
    { penyakitKode: 'P06', gejalaKode: 'G25', cf: 0.60 },
    { penyakitKode: 'P06', gejalaKode: 'G26', cf: 0.90 },
    { penyakitKode: 'P06', gejalaKode: 'G27', cf: 0.80 },

    // P07: Anthracnose
    { penyakitKode: 'P07', gejalaKode: 'G04', cf: 0.85 },
    { penyakitKode: 'P07', gejalaKode: 'G12', cf: 0.70 },
    { penyakitKode: 'P07', gejalaKode: 'G14', cf: 0.90 },

    // P08: Busuk Batang Atas (Upper stem rot)
    { penyakitKode: 'P08', gejalaKode: 'G01', cf: 0.75 },
    { penyakitKode: 'P08', gejalaKode: 'G05', cf: 0.70 },
    { penyakitKode: 'P08', gejalaKode: 'G12', cf: 0.65 },
    { penyakitKode: 'P08', gejalaKode: 'G18', cf: 0.90 },
    { penyakitKode: 'P08', gejalaKode: 'G22', cf: 0.85 },

    // H01: Hama Tikus
    { penyakitKode: 'H01', gejalaKode: 'G22', cf: 0.90 },
    { penyakitKode: 'H01', gejalaKode: 'G29', cf: 0.70 },
    { penyakitKode: 'H01', gejalaKode: 'G30', cf: 0.75 },
    { penyakitKode: 'H01', gejalaKode: 'G31', cf: 0.80 },
    { penyakitKode: 'H01', gejalaKode: 'G32', cf: 0.85 },

    // H02: Hama Rayap
    { penyakitKode: 'H02', gejalaKode: 'G19', cf: 0.85 },
    { penyakitKode: 'H02', gejalaKode: 'G20', cf: 0.70 },
    { penyakitKode: 'H02', gejalaKode: 'G21', cf: 0.90 },

    // H03: Hama Ulat Api
    { penyakitKode: 'H03', gejalaKode: 'G28', cf: 0.70 },
    { penyakitKode: 'H03', gejalaKode: 'G33', cf: 0.80 },
    { penyakitKode: 'H03', gejalaKode: 'G34', cf: 0.90 },

    // H04: Hama Ulat Kantong
    { penyakitKode: 'H04', gejalaKode: 'G02', cf: 0.65 },
    { penyakitKode: 'H04', gejalaKode: 'G12', cf: 0.50 },
    { penyakitKode: 'H04', gejalaKode: 'G28', cf: 0.60 },
    { penyakitKode: 'H04', gejalaKode: 'G35', cf: 0.90 },
    { penyakitKode: 'H04', gejalaKode: 'G36', cf: 0.90 },
    { penyakitKode: 'H04', gejalaKode: 'G37', cf: 0.85 },
    { penyakitKode: 'H04', gejalaKode: 'G38', cf: 0.75 },
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

  console.log('✅ Database Seeding selesai! Sebanyak 38 Gejala dan 12 Diagnosis HPT berhasil dimigrasikan.')
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
