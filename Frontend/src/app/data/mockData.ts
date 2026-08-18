import type { Symptom, Disease, Treatment, Rule, DiagnosisCase, User } from "../engine/types";

export const mockSymptoms: Symptom[] = [
  // Bagian Daun & Pelepah (G01 - G14)
  { id: 1, code: "G01", label: "Daun Menjadi Layu / Terkulai", category: "Daun", severityHint: "medium", active: true, description: "Daun atau anak daun tampak layu dan terkulai." },
  { id: 2, code: "G02", label: "Daun Mengalami Klorosis (Menguning)", category: "Daun", severityHint: "medium", active: true, description: "Daun berubah warna menjadi hijau pucat atau kuning merata." },
  { id: 3, code: "G03", label: "Bercak Lonjong Kuning pada Daun", category: "Daun", severityHint: "low", active: true, description: "Timbul bercak-bercak lonjong berwarna kuning pada helaian daun." },
  { id: 4, code: "G04", label: "Ujung Daun Muda Cokelat Nekrosis", category: "Daun", severityHint: "medium", active: true, description: "Daun muda berubah warna menjadi cokelat gelap di ujungnya." },
  { id: 5, code: "G05", label: "Pelepah Sengkleh & Menggantung", category: "Batang", severityHint: "high", active: true, description: "Pelepah patah di pangkal dan menggantung pada batang." },
  { id: 6, code: "G06", label: "Pelepah Bengkok Menunduk ke Bawah", category: "Batang", severityHint: "medium", active: true, description: "Pelepah melengkung/menunduk ke arah bawah di bagian tengah." },
  { id: 7, code: "G07", label: "Pelepah Cokelat Kemerahan", category: "Batang", severityHint: "medium", active: true, description: "Pelepah mengalami diskolorasi menjadi cokelat kemerahan." },
  { id: 8, code: "G08", label: "Daun Tombak Melengkung / Tidak Membuka", category: "Pucuk", severityHint: "high", active: true, description: "Daun muda tombak tidak membuka secara total atau melengkung." },
  { id: 9, code: "G09", label: "Bercak Kuning Bagian Tengah Cokelat", category: "Daun", severityHint: "medium", active: true, description: "Bercak nekrotik kuning dengan bagian tengah berwarna cokelat." },
  { id: 10, code: "G10", label: "Daun Tajuk Kerdil & Kaku", category: "Daun", severityHint: "medium", active: true, description: "Daun berukuran kecil atau tajuk tumbuh mengecil dan kerdil." },
  { id: 11, code: "G11", label: "Daun Sobek / Tidak Berkembang", category: "Daun", severityHint: "medium", active: true, description: "Helai daun sobek-sobek atau tidak tumbuh normal pada pelepah." },
  { id: 12, code: "G12", label: "Daun Mengering Kecokelatan", category: "Daun", severityHint: "high", active: true, description: "Daun mengalami dehidrasi berat dan tampak mengering kecokelatan." },
  { id: 13, code: "G13", label: "Daun / Pelepah Rontok Prematur", category: "Batang", severityHint: "medium", active: true, description: "Daun atau pelepah gugur/rontok sebelum waktunya." },
  { id: 14, code: "G14", label: "Bercak Hitam/Cokelat Daun Bibit", category: "Daun", severityHint: "medium", active: true, description: "Timbul bercak-bercak hitam atau cokelat pada daun bibit nursery." },

  // Bagian Kuncup, Batang & Akar (G15 - G22)
  { id: 15, code: "G15", label: "Kuncup Membusuk & Berbau Busuk", category: "Pucuk", severityHint: "high", active: true, description: "Kuncup/titik tumbuh membusuk basah dan mengeluarkan aroma busuk menyengat." },
  { id: 16, code: "G16", label: "Akar Lunak dan Korteks Busuk", category: "Akar", severityHint: "high", active: true, description: "Sistem perakaran menjadi lunak, basah, dan korteks hancur membusuk." },
  { id: 17, code: "G17", label: "Badan Buah Jamur di Pangkal Batang", category: "Batang", severityHint: "high", active: true, description: "Tumbuh badan buah jamur kipas (basidiokarp) pada pangkal batang/akar." },
  { id: 18, code: "G18", label: "Batang Atas Membusuk & Patah", category: "Batang", severityHint: "high", active: true, description: "Batang bagian atas (1-2 m di atas tanah) membusuk dan patah (upper stem)." },
  { id: 19, code: "G19", label: "Batang Berongga & Serbuk Kayu", category: "Batang", severityHint: "high", active: true, description: "Batang bagian dalam berongga dan ada tumpukan serbuk kayu halus." },
  { id: 20, code: "G20", label: "Lubang Gerekan Kecil pada Batang", category: "Batang", severityHint: "medium", active: true, description: "Terdapat lubang-lubang gerekan kecil pada batang akibat rayap." },
  { id: 21, code: "G21", label: "Sarang Rayap di Sekitar Akar/Pangkal", category: "Akar", severityHint: "high", active: true, description: "Ditemukan lorong tanah atau sarang rayap di sekitar perakaran/pangkal." },
  { id: 22, code: "G22", label: "Tanaman Roboh / Tumbang / Mati", category: "Batang", severityHint: "high", active: true, description: "Tanaman roboh, tumbang, atau mati mendadak." },

  // Bagian Bunga, Buah & Produksi (G23 - G28)
  { id: 23, code: "G23", label: "Rizomorf Jamur Putih pada Buah", category: "Buah", severityHint: "high", active: true, description: "Miselium jamur berwarna putih menyelimuti permukaan tandan buah." },
  { id: 24, code: "G24", label: "Pangkal Buah & Tandan Busuk Berbau", category: "Buah", severityHint: "high", active: true, description: "Pangkal buah busuk basah dan tandan rusak mengeluarkan bau busuk." },
  { id: 25, code: "G25", label: "Buah Keriput, Kering & Kerdil", category: "Buah", severityHint: "medium", active: true, description: "Buah mengering, keriput, dan gagal berkembang sempurna." },
  { id: 26, code: "G26", label: "Buah Kehitaman & Biji Rontok", category: "Buah", severityHint: "medium", active: true, description: "Warna buah berubah kehitaman dan biji/brondolan mudah rontok." },
  { id: 27, code: "G27", label: "Bunga Tombak Tidak Membuka", category: "Buah", severityHint: "medium", active: true, description: "Tandan bunga tidak membuka atau pembentukan bunga terhambat." },
  { id: 28, code: "G28", label: "Penurunan Drastis Produksi TBS", category: "Buah", severityHint: "high", active: true, description: "Produksi tandan buah segar menurun drastis mencapai 40% - 60%." },

  // Gejala Khusus 4 Hama (G29 - G38)
  { id: 29, code: "G29", label: "Kerusakan Bibit Digigit Pengerat", category: "Batang", severityHint: "high", active: true, description: "Bibit kelapa sawit rusak digigit atau terpotong oleh hama tikus." },
  { id: 30, code: "G30", label: "Bekas Keratan Gigi pada Pelepah", category: "Batang", severityHint: "medium", active: true, description: "Bekas gigitan dan pengeratan gigi pada pangkal pelepah sawit." },
  { id: 31, code: "G31", label: "Bekas Gigitan Buah & Inti Sawit", category: "Buah", severityHint: "high", active: true, description: "Bekas gigitan pada buah mentah/masak hingga merusak inti sawit." },
  { id: 32, code: "G32", label: "Bibit Mati Akibat Pengeratan Titik Tumbuh", category: "Batang", severityHint: "high", active: true, description: "Tanaman sawit muda mati karena titik tumbuh pangkal bibit dikerat tikus." },
  { id: 33, code: "G33", label: "Helaian Daun Berlubang Ulat Api", category: "Daun", severityHint: "high", active: true, description: "Helaian daun berlubang-lubang dimakan ulat api secara rakus." },
  { id: 34, code: "G34", label: "Kehilangan Daun Bawah >80%", category: "Daun", severityHint: "high", active: true, description: "Kerusakan parah daun bagian bawah hingga >80% daun habis." },
  { id: 35, code: "G35", label: "Daun Terkikis Menyisakan Tulang Lidi", category: "Daun", severityHint: "high", active: true, description: "Daun terkikis habis menyisakan lidi, tajuk bawah tampak abu-abu." },
  { id: 36, code: "G36", label: "Daun Tajuk Bawah Kering Abu-Abu", category: "Daun", severityHint: "high", active: true, description: "Daun tajuk bagian bawah mengering kusam dan keabu-abuan." },
  { id: 37, code: "G37", label: "Kantong Ulat Menggantung di Daun", category: "Daun", severityHint: "high", active: true, description: "Ditemukan kantong-kantong ulat menggantung pada permukaan bawah pelepah." },
  { id: 38, code: "G38", label: "Daun Rusak Bergerigi Tidak Utuh", category: "Daun", severityHint: "medium", active: true, description: "Helaian daun tampak rusak tidak utuh dan bergerigi dimakan ulat kantong." },
];

export const mockTreatments: Treatment[] = [
  {
    id: 1, name: "Penanganan Penyakit Akar (Blast Disease)",
    steps: [
      "Sanitasi Kebun: Tanaman yang terinfeksi parah segera dicabut dan dimusnahkan agar patogen tidak menyebar.",
      "Aplikasi Agen Hayati: Taburkan jamur antagonis Trichoderma harzianum pada media tanah/pembibitan.",
      "Perbaikan Sistem Drainase: Pastikan saluran drainase lancar untuk mencegah kelembaban tanah berlebih.",
      "Pengaturan Naungan: Kurangi naungan pada pembibitan agar sirkulasi udara dan cahaya matahari optimal."
    ],
    emergencyActions: ["Cabut dan bakar bibit/tanaman yang perakarannya sudah membusuk total."],
    dosage: { chemical: "Trichoderma harzianum", rate: "100-200 g", unit: "per polybag/pohon", per: "tanaman" },
    safetyNotes: "Gunakan sarung tangan saat aplikasi agen hayati dan pemusnahan tanaman sakit."
  },
  {
    id: 2, name: "Penanganan Busuk Pangkal Batang (Ganoderma boninense)",
    steps: [
      "Sensus dan Pemetaan: Lakukan sensus pohon terinfeksi untuk mengetahui stadium serangan Ganoderma.",
      "Isolasi Tanaman: Buat parit isolasi sedalam 1 meter di sekeliling pohon yang sakit.",
      "Sanitasi dan Eradikasi: Bongkar pohon terinfeksi berat (>50%) beserta bonggol akarnya lalu musnahkan.",
      "Pengendalian Kimia / Hayati: Injeksi batang dengan fungisida heksakonazol atau aplikasi Trichoderma di piringan."
    ],
    emergencyActions: ["Hancurkan badan buah jamur Ganoderma yang tumbuh di batang dan kubur dengan kapur pertanian."],
    dosage: { chemical: "Heksakonazol / Trichoderma", rate: "15 ml / 400 g", unit: "per pohon", per: "pohon" },
    safetyNotes: "Limbah kayu/akar tanaman yang terinfeksi dilarang dipindahkan ke blok tanaman sehat."
  },
  {
    id: 3, name: "Penanganan Busuk Kuncup (Spear Rot)",
    steps: [
      "Pemangkasan Jaringan Busuk: Potong bagian kuncup/tombak yang membusuk sampai batas jaringan yang sehat.",
      "Aplikasi Fungisida/Bakterisida: Oleskan pasta fungisida tembaga (Copper Oxychloride) pada bekas potongan.",
      "Peningkatan Aerasi: Lakukan pemangkasan pelepah kering di sekelilingnya untuk mengurangi kelembaban.",
      "Perbaikan Pemupukan: Berikan pupuk mikro untuk merangsang pembentukan jaringan daun muda baru."
    ],
    emergencyActions: ["Segera bersihkan lendir dan jaringan busuk kuncup agar titik tumbuh utama terselamatkan."],
    dosage: { chemical: "Copper Oxychloride (Tembaga Oksiklorida)", rate: "2-3 g/L", unit: "larutan", per: "pohon" },
    safetyNotes: "Gunakan masker dan kacamata pelindung saat mengoleskan pasta fungisida tembaga."
  },
  {
    id: 4, name: "Penanganan Penyakit Garis Kuning (Patch Yellow)",
    steps: [
      "Penggunaan Bibit Resisten: Prioritaskan varietas bibit yang tahan terhadap infeksi Fusarium oxysporum.",
      "Sanitasi Pelepah Terinfeksi: Pangkas pelepah daun yang menunjukkan gejala garis kuning parah dan bakar.",
      "Pemupukan Berimbang: Tingkatkan asupan kalium (MOP/KCl) dan kurangi dosis nitrogen berlebih.",
      "Aplikasi Biofungisida: Berikan mikroba tanah antagonis untuk menekan inokulum Fusarium di tanah."
    ],
    emergencyActions: ["Pangkas pelepah yang terinfeksi berat dan segera bersihkan piringan pohon."],
    dosage: { chemical: "Pupuk MOP/KCl + Biofungisida", rate: "2 kg", unit: "per pohon/tahun", per: "pohon" },
    safetyNotes: "Pastikan pemangkasan dilakukan dengan dodos/egrek yang telah disterilisasi desinfektan."
  },
  {
    id: 5, name: "Penanganan Penyakit Tajuk (Crown Disease)",
    steps: [
      "Pemupukan Seimbang: Berikan kombinasi pupuk makro dan mikro lengkap (terutama K, Boron, dan Magnesium).",
      "Sanitasi Piringan: Bersihkan gulma dan semak belukar di sekitar piringan pohon untuk mengurangi stres tanaman.",
      "Monitoring Pertumbuhan: Amati perkembangan pelepah baru; umumnya tanaman pulih seiring bertambahnya umur.",
      "Penyemprotan Preventif: Semprotkan fungisida kontak jika ditemukan infeksi sekunder pada pelepah rapuh."
    ],
    emergencyActions: ["Pangkas pelepah yang patah atau menggantung agar tidak menjadi sarang hama pembusuk."],
    dosage: { chemical: "Pupuk Borate + Kieserit", rate: "100 g / 500 g", unit: "per pohon", per: "pohon" },
    safetyNotes: "Hindari pelukaan mekanis pada kuncup daun muda saat perawatan."
  },
  {
    id: 6, name: "Penanganan Busuk Tandan (Bunch Rot / Marasmius)",
    steps: [
      "Kastrasi dan Penyerbukan Buatan: Lakukan penyerbukan buatan secara efektif untuk mencegah bunga jantan busuk.",
      "Sanitasi Buah Busuk: Petik dan kumpulkan seluruh buah busuk/afkir dari pohon dan lantai kebun lalu musnahkan.",
      "Tunas Pelepah Mati: Pangkas pelepah kering yang menopang tandan untuk memperlancar sirkulasi udara.",
      "Penyemprotan Fungisida: Semprot tandan buah dengan fungisida tembaga jika intensitas serangan tinggi."
    ],
    emergencyActions: ["Kastrasi total tandan buah yang telah diselimuti miselium jamur putih Marasmius."],
    dosage: { chemical: "Fungisida Tembaga (Kocide / Cupravit)", rate: "2 g/L air", unit: "larutan semprot", per: "tandan" },
    safetyNotes: "Jangan menyemprot fungisida kimia mendekati jadwal rotasi panen tandan buah segar."
  },
  {
    id: 7, name: "Penanganan Penyakit Anthracnose & Bercak Daun",
    steps: [
      "Pengaturan Kelembaban: Kurangi frekuensi penyiraman dan renggangkan jarak antar polybag pembibitan.",
      "Karantina Bibit: Pisahkan bibit bergejala bercak daun dari bibit sehat untuk memutus penularan.",
      "Pemangkasan Daun Sakit: Gunting ujung anak daun yang terinfeksi dan buang jauh dari area nursery.",
      "Aplikasi Fungisida: Semprotkan fungisida kontak berbahan aktif mankozeb atau propineb secara berkala."
    ],
    emergencyActions: ["Isolasi blok pembibitan yang terinfeksi dan hentikan penyiraman overhead sementara."],
    dosage: { chemical: "Mankozeb (Dithane M-45) / Propineb", rate: "2 g/L air", unit: "larutan", per: "bibit" },
    safetyNotes: "Gunakan masker dan pakaian pelindung saat aplikasi fungisida di dalam rumah pembibitan."
  },
  {
    id: 8, name: "Penanganan Busuk Batang Atas (Upper Stem Rot)",
    steps: [
      "Pemangkasan Pelepah Higienis: Pangkas pelepah kering dengan dodos/egrek tajam dan steril.",
      "Aplikasi Fungisida Luka: Oleskan cat penutup luka atau pasta fungisida tembaga pada bekas luka pangkasan.",
      "Sanitasi Batang: Bersihkan sisa-sisa bahan organik yang menempel pada ketiak pelepah batang atas.",
      "Pemberian Pupuk Kalium: Tingkatkan ketahanan mekanis dinding sel batang dengan pemupukan KCl berimbang."
    ],
    emergencyActions: ["Topang atau pangkas bagian batang atas yang busuk agar tidak roboh menimpa tanaman sekitar."],
    dosage: { chemical: "Pasta Fungisida Tembaga + Pupuk KCl", rate: "Olesan pasta / 2 kg KCl", unit: "per pohon", per: "pohon" },
    safetyNotes: "Gunakan tangga panjat yang kokoh dan sabuk pengaman saat inspeksi batang atas."
  },
  {
    id: 9, name: "Pengendalian Hama Tikus (Rattus tiomanicus)",
    steps: [
      "Pengendalian Biologis: Memanfaatkan predator alami burung hantu (Tyto alba) dengan mendirikan rumah burung hantu 1 unit per 20-25 ha.",
      "Sanitasi Lahan: Bersihkan piringan pohon, ketiak pelepah, dan tumpukan pelepah mati yang menjadi sarang tikus.",
      "Pengendalian Kimia: Pasang umpan racun rodentisida antikoagulan (Kumatetralil atau Brodifakum) secara rotasi.",
      "Monitoring Umpan: Lakukan pengecekan konsumsi umpan setiap 3-4 hari hingga persentase umpan termakan <20%."
    ],
    emergencyActions: ["Pasang umpan rodentisida blok di ketiak pelepah dan piringan pohon yang mengalami gigitan aktif."],
    dosage: { chemical: "Rodentisida Kumatetralil (Racumin) / Brodifakum", rate: "1-2 umpan blok", unit: "per pohon", per: "pohon" },
    safetyNotes: "Simpan rodentisida jauh dari jangkauan hewan ternak dan gunakan sarung tangan saat memasang umpan."
  },
  {
    id: 10, name: "Pengendalian Hama Rayap (Coptotermes curvignathus)",
    steps: [
      "Sanitasi & Pembongkaran Sarang: Bongkar sarang rayap di sekitar perakaran dan piringan pohon yang terserang.",
      "Aplikasi Termitisida: Siramkan atau injeksikan larutan termitisida berbahan aktif fipronil atau klorpirifos ke dalam tanah perakaran.",
      "Pembersihan Sisa Kayu: Musnahkan sisa-sisa tunggul kayu mati di sekitar kebun yang menjadi sumber sarang rayap.",
      "Monitoring Berkala: Cek jalur terowongan tanah rayap pada batang sawit setiap bulan."
    ],
    emergencyActions: ["Siramkan larutan termitisida 5-10 liter langsung ke pangkal batang dan lubang rongga pohon."],
    dosage: { chemical: "Fipronil 50 SC / Klorpirifos", rate: "2-5 ml/L air (5 L larutan)", unit: "per pohon", per: "pohon" },
    safetyNotes: "Gunakan alat pelindung diri lengkap (sepatu bot, masker, sarung tangan karet) saat aplikasi termitisida."
  },
  {
    id: 11, name: "Pengendalian Hama Ulat Api (Setothosea asigna)",
    steps: [
      "Sensus Ulat: Lakukan pengamatan sensus populasi ulat per pelepah untuk menentukan ambang kendali (ambang ekonomi: 5-10 ulat/pelepah).",
      "Pengendalian Hayati: Semprotkan bioinsektisida virus Cordyceps atau jamur Beauveria bassiana, serta tanam tanaman inang Turnera subulata.",
      "Injeksi Batang (Trunk Injection): Untuk tanaman tinggi (>5 meter), lakukan injeksi batang dengan insektisida sistemik asefat.",
      "Penyemprotan / Fogging: Gunakan insektisida piretroid sintetis jika terjadi ledakan populasi parah di tanaman muda."
    ],
    emergencyActions: ["Lakukan injeksi batang asefat atau fogging segera jika populasi ulat api melampaui ambang kritis."],
    dosage: { chemical: "Insektisida Sistemik Asefat (Acephate 75 SP)", rate: "10-15 g dilarutkan dalam 10-15 ml air", unit: "per lubang bor", per: "pohon" },
    safetyNotes: "Tutup kembali lubang injeksi batang dengan lilin penutup atau pasak kayu setelah aplikasi insektisida."
  },
  {
    id: 12, name: "Pengendalian Hama Ulat Kantong (Metisa plana)",
    steps: [
      "Pengutipan Manual: Kutip dan kumpulkan kantong ulat pada tanaman muda jika serangan masih terisolasi.",
      "Pengendalian Biologis: Semprotkan bioinsektisida berbahan aktif bakteri Bacillus thuringiensis (Bt) pada tajuk bawah.",
      "Penanaman Bunga Bermanfaat: Tanam tanaman bermanfaat (Turnera subulata, Antigonon leptopus) sebagai habitat parasitoid alami.",
      "Injeksi Batang: Lakukan injeksi batang dengan insektisida asefat pada tanaman dewasa yang tajuk bawahnya terkikis parah."
    ],
    emergencyActions: ["Lakukan injeksi batang insektisida asefat untuk menghentikan defoliasi tajuk bawah secara cepat."],
    dosage: { chemical: "Bacillus thuringiensis (Bt) / Asefat", rate: "1-2 g/L air (semprot) atau 10 g (injeksi)", unit: "per pohon", per: "pohon" },
    safetyNotes: "Pastikan penyemprotan mengenai permukaan bawah daun tempat kantong ulat aktif bergantung."
  }
];

export const mockDiseases: Disease[] = [
  { id: 1, name: "Akar (Blast disease)", severityLevel: "high", treatmentId: 1, summary: "Penyakit pembusukan akar pada pembibitan dan tanaman dewasa akibat infeksi jamur Rhizoctonia lamellifera / Pythium sp." },
  { id: 2, name: "Busuk Pangkal Batang (Ganoderma)", severityLevel: "high", treatmentId: 2, summary: "Penyakit paling mematikan pada kelapa sawit yang disebabkan oleh jamur Ganoderma boninense / lucidum." },
  { id: 3, name: "Busuk Kuncup (Spear rot)", severityLevel: "high", treatmentId: 3, summary: "Infeksi pada titik tumbuh / kuncup daun muda yang membusuk dan mengeluarkan bau busuk." },
  { id: 4, name: "Garis Kuning (Patch yellow)", severityLevel: "medium", treatmentId: 4, summary: "Penyakit bercak daun atau garis kuning akibat infeksi jamur Fusarium oxysporum." },
  { id: 5, name: "Tajuk (Crown disease)", severityLevel: "medium", treatmentId: 5, summary: "Gangguan pertumbuhan tajuk di mana pelepah tumbuh membengkok atau tidak terbentuk utuh." },
  { id: 6, name: "Busuk Tandan (Bunch rot / Marasmius)", severityLevel: "medium", treatmentId: 6, summary: "Jamur Marasmius palmivorus yang menyerang tandan buah pada kondisi kebun lembab." },
  { id: 7, name: "Anthracnose & Bercak Daun", severityLevel: "medium", treatmentId: 7, summary: "Penyakit bercak daun pada bibit nursery yang disebabkan oleh jamur Melanconium elaedis / Glomerella." },
  { id: 8, name: "Busuk Batang Atas (Upper stem rot)", severityLevel: "high", treatmentId: 8, summary: "Penyakit pembusukan batang 1-2 meter di atas tanah yang disebabkan oleh infeksi jamur Fomes noxius." },
  { id: 9, name: "Hama Tikus (Rattus tiomanicus)", severityLevel: "high", treatmentId: 9, summary: "Hama vertebrata pengerat yang merusak bibit, pelepah, dan memakan buah sawit hingga ke inti." },
  { id: 10, name: "Hama Rayap (Coptotermes curvignathus)", severityLevel: "high", treatmentId: 10, summary: "Hama serangga perusak kayu yang menyerang pangkal batang dan akar kelapa sawit hingga berongga." },
  { id: 11, name: "Hama Ulat Api (Setothosea asigna)", severityLevel: "medium", treatmentId: 11, summary: "Hama ulat pemakan daun yang rakus, menyebabkan daun berlubang hingga habis tersisa tulang daun." },
  { id: 12, name: "Hama Ulat Kantong (Metisa plana)", severityLevel: "medium", treatmentId: 12, summary: "Hama ulat berkantong yang mengikis daun dari tajuk bagian bawah hingga mengering dan tampak abu-abu." },
];

export const mockRules: Rule[] = [
  // P01: Akar (Blast disease)
  { id: 1, code: "R001", title: "Akar - Daun Layu", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Layu", antecedents: [{ symptomId: 1, minConfidence: 0.1 }], consequents: [{ diseaseId: 1, cf: 0.85 }] },
  { id: 2, code: "R002", title: "Akar - Busuk Akar", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Akar busuk", antecedents: [{ symptomId: 16, minConfidence: 0.1 }], consequents: [{ diseaseId: 1, cf: 0.95 }] },
  { id: 3, code: "R003", title: "Akar - Jamur Pangkal Batang", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Jamur", antecedents: [{ symptomId: 17, minConfidence: 0.1 }], consequents: [{ diseaseId: 1, cf: 0.80 }] },

  // P02: Busuk Pangkal Batang (Ganoderma)
  { id: 4, code: "R004", title: "Ganoderma - Jamur Pangkal Batang", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Ganoderma", antecedents: [{ symptomId: 17, minConfidence: 0.1 }], consequents: [{ diseaseId: 2, cf: 0.95 }] },
  { id: 5, code: "R005", title: "Ganoderma - Pelepah Sengkleh & Menggantung", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Pelepah", antecedents: [{ symptomId: 5, minConfidence: 0.1 }], consequents: [{ diseaseId: 2, cf: 0.90 }] },
  { id: 6, code: "R006", title: "Ganoderma - Daun Tombak Melengkung", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Tombak", antecedents: [{ symptomId: 8, minConfidence: 0.1 }], consequents: [{ diseaseId: 2, cf: 0.90 }] },

  // P03: Busuk Kuncup (Spear rot)
  { id: 7, code: "R007", title: "Spear Rot - Kuncup Busuk", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Kuncup", antecedents: [{ symptomId: 15, minConfidence: 0.1 }], consequents: [{ diseaseId: 3, cf: 0.95 }] },
  { id: 8, code: "R008", title: "Spear Rot - Ujung Daun Cokelat", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Ujung daun", antecedents: [{ symptomId: 4, minConfidence: 0.1 }], consequents: [{ diseaseId: 3, cf: 0.90 }] },

  // P04: Garis Kuning (Patch yellow)
  { id: 9, code: "R009", title: "Patch Yellow - Bercak Tengah Cokelat", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Bercak daun", antecedents: [{ symptomId: 9, minConfidence: 0.1 }], consequents: [{ diseaseId: 4, cf: 0.90 }] },

  // P05: Tajuk (Crown disease)
  { id: 10, code: "R010", title: "Crown Disease - Pelepah Bengkok", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Bengkok", antecedents: [{ symptomId: 6, minConfidence: 0.1 }], consequents: [{ diseaseId: 5, cf: 0.90 }] },

  // P06: Busuk Tandan (Marasmius)
  { id: 11, code: "R011", title: "Marasmius - Rizomorf Jamur Putih Buah", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Miselium", antecedents: [{ symptomId: 23, minConfidence: 0.1 }], consequents: [{ diseaseId: 6, cf: 0.95 }] },

  // P07 & P08
  { id: 12, code: "R012", title: "Anthracnose - Bercak Daun Bibit", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Anthracnose", antecedents: [{ symptomId: 14, minConfidence: 0.1 }], consequents: [{ diseaseId: 7, cf: 0.90 }] },
  { id: 13, code: "R013", title: "Upper Stem Rot - Batang Atas Patah", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Batang atas", antecedents: [{ symptomId: 18, minConfidence: 0.1 }], consequents: [{ diseaseId: 8, cf: 0.90 }] },

  // H01: Hama Tikus
  { id: 14, code: "R014", title: "Tikus - Kerusakan Bibit & Pelepah", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Tikus", antecedents: [{ symptomId: 29, minConfidence: 0.1 }], consequents: [{ diseaseId: 9, cf: 0.70 }] },
  { id: 15, code: "R015", title: "Tikus - Gigitan Buah & Inti", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Buah", antecedents: [{ symptomId: 31, minConfidence: 0.1 }], consequents: [{ diseaseId: 9, cf: 0.80 }] },

  // H02: Hama Rayap
  { id: 16, code: "R016", title: "Rayap - Batang Berongga & Serbuk", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Rayap", antecedents: [{ symptomId: 19, minConfidence: 0.1 }], consequents: [{ diseaseId: 10, cf: 0.85 }] },
  { id: 17, code: "R017", title: "Rayap - Sarang di Pangkal/Akar", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Sarang", antecedents: [{ symptomId: 21, minConfidence: 0.1 }], consequents: [{ diseaseId: 10, cf: 0.90 }] },

  // H03: Hama Ulat Api
  { id: 18, code: "R018", title: "Ulat Api - Daun Berlubang", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Ulat Api", antecedents: [{ symptomId: 33, minConfidence: 0.1 }], consequents: [{ diseaseId: 11, cf: 0.80 }] },
  { id: 19, code: "R019", title: "Ulat Api - Daun Hilang >80%", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Defoliasi", antecedents: [{ symptomId: 34, minConfidence: 0.1 }], consequents: [{ diseaseId: 11, cf: 0.90 }] },

  // H04: Hama Ulat Kantong
  { id: 20, code: "R020", title: "Ulat Kantong - Daun Sisa Lidi & Tajuk Abu-Abu", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Ulat Kantong", antecedents: [{ symptomId: 35, minConfidence: 0.1 }], consequents: [{ diseaseId: 12, cf: 0.90 }] },
];

export const mockUsers: User[] = [
  { id: "u1", nama: "Bapak Sari Wibowo", email: "petani@demo.com", role: "petani" },
  { id: "u2", nama: "Bapak Joko Siswanto", email: "joko.petani@demo.com", role: "petani" },
  { id: "u3", nama: "Prof. Ahmad Fauzi", email: "pakar@demo.com", role: "pakar" },
  { id: "u4", nama: "Janter Herwin Simanjuntak, S.P.", email: "janter.pakar@demo.com", role: "pakar" },
];

export const mockCases: DiagnosisCase[] = [
  {
    caseId: "KASUS-2026-001",
    userId: "u1",
    userName: "Bapak Sari Wibowo",
    metadata: { plotId: "Blok Inti A-04 (Pohon 14)", notes: "Daun bawah layu terkulai, pelepah patah menggantung di batang, dan ada jamur di pangkal.", timestamp: "2026-06-12T08:30:00Z" },
    output: {
      caseId: "KASUS-2026-001",
      timestamp: "2026-06-12T08:30:00Z",
      diagnosisTimeMs: 142,
      emergencyFlag: true,
      inputs: [
        { symptomId: 1, userConfidence: 1.0 }, // G01 Daun layu
        { symptomId: 5, userConfidence: 0.8 }, // G05 Pelepah sengkleh
        { symptomId: 14, userConfidence: 1.0 }, // G14 Jamur pangkal batang
        { symptomId: 18, userConfidence: 0.6 }, // G18 Pelepah rontok
      ],
      diagnoses: [
        { 
          diseaseId: 2, 
          diseaseName: "Busuk Pangkal Batang (Ganoderma)", 
          cfScore: 1.00, 
          cfPercent: 100, 
          severity: "high", 
          treatmentId: 2, 
          rulesTraced: [
            { ruleId: 4, ruleCode: "R004", ruleTitle: "Ganoderma - Jamur Pangkal Batang", cfContribution: 1.00, antecedentMatches: [{ symptomId: 14, userConfidence: 1.0 }] },
            { ruleId: 5, ruleCode: "R005", ruleTitle: "Ganoderma - Pelepah Sengkleh & Menggantung", cfContribution: 0.80, antecedentMatches: [{ symptomId: 5, userConfidence: 0.8 }] },
            { ruleId: 6, ruleCode: "R006", ruleTitle: "Ganoderma - Daun Tombak Melengkung", cfContribution: 0.60, antecedentMatches: [{ symptomId: 18, userConfidence: 0.6 }] }
          ] 
        },
        { 
          diseaseId: 1, 
          diseaseName: "Akar (Blast disease)", 
          cfScore: 0.82, 
          cfPercent: 82, 
          severity: "high", 
          treatmentId: 1, 
          rulesTraced: [
            { ruleId: 1, ruleCode: "R001", ruleTitle: "Akar - Daun Layu", cfContribution: 0.80, antecedentMatches: [{ symptomId: 1, userConfidence: 1.0 }] }
          ] 
        }
      ],
    },
    validatedBy: "Prof. Ahmad Fauzi (Pakar Fitopatologi)",
    validationNote: "Gejala klinis sangat khas Ganoderma boninense stadium 3. Rekomendasi parit isolasi dan injeksi heksakonazol harus segera diterapkan.",
    agreement: true,
    validatedDiseaseName: "Busuk Pangkal Batang (Ganoderma)",
  },
  {
    caseId: "KASUS-2026-002",
    userId: "u2",
    userName: "Bapak Joko Siswanto",
    metadata: { plotId: "Afdeling 2 Blok C-08", notes: "Ditemukan banyak bekas pengeratan pada pangkal pelepah dan tandan buah mentah/masak rusak dimakan.", timestamp: "2026-06-14T10:15:00Z" },
    output: {
      caseId: "KASUS-2026-002",
      timestamp: "2026-06-14T10:15:00Z",
      diagnosisTimeMs: 165,
      emergencyFlag: true,
      inputs: [
        { symptomId: 23, userConfidence: 0.8 }, // G23 Bibit rusak
        { symptomId: 24, userConfidence: 0.8 }, // G24 Pelepah digigit
        { symptomId: 25, userConfidence: 1.0 }, // G25 Buah & inti dimakan
        { symptomId: 15, userConfidence: 0.6 }, // G15 Tanaman mati/roboh
      ],
      diagnoses: [
        { 
          diseaseId: 9, 
          diseaseName: "Hama Tikus (Rattus tiomanicus)", 
          cfScore: 0.98, 
          cfPercent: 98, 
          severity: "high", 
          treatmentId: 9, 
          rulesTraced: [
            { ruleId: 14, ruleCode: "R014", ruleTitle: "Tikus - Kerusakan Bibit & Pelepah", cfContribution: 0.70, antecedentMatches: [{ symptomId: 23, userConfidence: 0.8 }] },
            { ruleId: 15, ruleCode: "R015", ruleTitle: "Tikus - Gigitan Buah & Inti", cfContribution: 0.80, antecedentMatches: [{ symptomId: 25, userConfidence: 1.0 }] }
          ] 
        }
      ],
    },
    validatedBy: "Janter Herwin Simanjuntak, S.P. (Pakar Hama)",
    validationNote: "Serangan tikus pohon (Rattus tiomanicus) di atas ambang kritis. Segera pasang umpan Kumatetralil dan aktifkan rumah burung hantu Tyto alba.",
    agreement: true,
    validatedDiseaseName: "Hama Tikus (Rattus tiomanicus)",
  },
  {
    caseId: "KASUS-2026-003",
    userId: "u1",
    userName: "Bapak Sari Wibowo",
    metadata: { plotId: "Blok Timur D-02", notes: "Daun-daun berlubang parah dimakan ulat berwarna cerah berduri, tajuk bawah hampir habis tersisa lidi.", timestamp: "2026-06-15T14:20:00Z" },
    output: {
      caseId: "KASUS-2026-003",
      timestamp: "2026-06-15T14:20:00Z",
      diagnosisTimeMs: 138,
      emergencyFlag: false,
      inputs: [
        { symptomId: 29, userConfidence: 0.8 }, // G29 Daun berlubang
        { symptomId: 30, userConfidence: 1.0 }, // G30 Daun bawah rusak 90%
        { symptomId: 32, userConfidence: 0.6 }, // G32 Penurunan TBS
      ],
      diagnoses: [
        { 
          diseaseId: 11, 
          diseaseName: "Hama Ulat Api (Setothosea asigna)", 
          cfScore: 0.98, 
          cfPercent: 98, 
          severity: "medium", 
          treatmentId: 11, 
          rulesTraced: [
            { ruleId: 18, ruleCode: "R018", ruleTitle: "Ulat Api - Daun Berlubang", cfContribution: 0.64, antecedentMatches: [{ symptomId: 29, userConfidence: 0.8 }] },
            { ruleId: 19, ruleCode: "R019", ruleTitle: "Ulat Api - Daun Hilang 90%", cfContribution: 0.90, antecedentMatches: [{ symptomId: 30, userConfidence: 1.0 }] }
          ] 
        }
      ],
    },
    validatedBy: "Janter Herwin Simanjuntak, S.P. (Pakar Hama)",
    validationNote: "Terkonfirmasi ulat api Setothosea asigna. Lakukan sensus populasi per pelepah dan semprotkan bioinsektisida virus Cordyceps atau injeksi batang asefat.",
    agreement: true,
    validatedDiseaseName: "Hama Ulat Api (Setothosea asigna)",
  },
  {
    caseId: "KASUS-2026-004",
    userId: "u2",
    userName: "Bapak Joko Siswanto",
    metadata: { plotId: "Blok Perbatasan E-11", notes: "Pangkal batang berlubang-lubang kecil, terdapat terowongan tanah dan batang bagian dalam berongga.", timestamp: "2026-06-16T09:00:00Z" },
    output: {
      caseId: "KASUS-2026-004",
      timestamp: "2026-06-16T09:00:00Z",
      diagnosisTimeMs: 150,
      emergencyFlag: true,
      inputs: [
        { symptomId: 26, userConfidence: 0.8 }, // G26 Lubang kecil batang
        { symptomId: 27, userConfidence: 1.0 }, // G27 Batang berongga & serbuk
        { symptomId: 28, userConfidence: 1.0 }, // G28 Sarang rayap
      ],
      diagnoses: [
        { 
          diseaseId: 10, 
          diseaseName: "Hama Rayap (Coptotermes curvignathus)", 
          cfScore: 0.99, 
          cfPercent: 99, 
          severity: "high", 
          treatmentId: 10, 
          rulesTraced: [
            { ruleId: 16, ruleCode: "R016", ruleTitle: "Rayap - Batang Berongga & Serbuk", cfContribution: 0.85, antecedentMatches: [{ symptomId: 27, userConfidence: 1.0 }] },
            { ruleId: 17, ruleCode: "R017", ruleTitle: "Rayap - Sarang di Pangkal/Akar", cfContribution: 0.90, antecedentMatches: [{ symptomId: 28, userConfidence: 1.0 }] }
          ] 
        }
      ],
    },
    validatedBy: "Prof. Ahmad Fauzi (Pakar Agronomi)",
    validationNote: "Serangan rayap kayu Coptotermes curvignathus. Bongkar sarang dan segera siramkan termitisida Fipronil 5 liter per pohon.",
    agreement: true,
    validatedDiseaseName: "Hama Rayap (Coptotermes curvignathus)",
  },
  {
    caseId: "KASUS-2026-005",
    userId: "u1",
    userName: "Bapak Sari Wibowo",
    metadata: { plotId: "Nursery Pembibitan Blok B", notes: "Ujung daun muda tombak membusuk basah dan mengeluarkan bau busuk menyengat.", timestamp: "2026-06-17T11:45:00Z" },
    output: {
      caseId: "KASUS-2026-005",
      timestamp: "2026-06-17T11:45:00Z",
      diagnosisTimeMs: 130,
      emergencyFlag: true,
      inputs: [
        { symptomId: 4, userConfidence: 1.0 },  // G04 Ujung daun cokelat
        { symptomId: 12, userConfidence: 1.0 }, // G12 Kuncup busuk bau
        { symptomId: 13, userConfidence: 0.8 }, // G13 Akar membusuk
      ],
      diagnoses: [
        { 
          diseaseId: 3, 
          diseaseName: "Busuk Kuncup (Spear rot)", 
          cfScore: 1.00, 
          cfPercent: 100, 
          severity: "high", 
          treatmentId: 3, 
          rulesTraced: [
            { ruleId: 7, ruleCode: "R007", ruleTitle: "Spear Rot - Kuncup Busuk", cfContribution: 1.00, antecedentMatches: [{ symptomId: 12, userConfidence: 1.0 }] },
            { ruleId: 8, ruleCode: "R008", ruleTitle: "Spear Rot - Ujung Daun Cokelat", cfContribution: 0.80, antecedentMatches: [{ symptomId: 4, userConfidence: 1.0 }] }
          ] 
        }
      ],
    },
    validatedBy: "Prof. Ahmad Fauzi (Pakar Fitopatologi)",
    validationNote: "Penyakit Spear Rot terkonfirmasi. Segera potong jaringan kuncup yang membusuk dan olesi pasta fungisida tembaga untuk menyelamatkan titik tumbuh.",
    agreement: true,
    validatedDiseaseName: "Busuk Kuncup (Spear rot)",
  },
  {
    caseId: "KASUS-2026-006",
    userId: "u2",
    userName: "Bapak Joko Siswanto",
    metadata: { plotId: "Tanaman Muda Blok F-03", notes: "Helaian daun tajuk baru tumbuh kerdil, kaku, dan beberapa pelepah patah rontok.", timestamp: "2026-06-18T13:10:00Z" },
    output: {
      caseId: "KASUS-2026-006",
      timestamp: "2026-06-18T13:10:00Z",
      diagnosisTimeMs: 125,
      emergencyFlag: false,
      inputs: [
        { symptomId: 10, userConfidence: 0.8 }, // G10 Daun kerdil
        { symptomId: 15, userConfidence: 0.6 }, // G15 Pertumbuhan abnormal
        { symptomId: 18, userConfidence: 0.8 }, // G18 Pelepah rontok
      ],
      diagnoses: [
        { 
          diseaseId: 8, 
          diseaseName: "Daun Mengecil (Defisiensi Boron)", 
          cfScore: 0.93, 
          cfPercent: 93, 
          severity: "low", 
          treatmentId: 8, 
          rulesTraced: [
            { ruleId: 13, ruleCode: "R013", ruleTitle: "Daun Mengecil - Defisiensi Boron", cfContribution: 0.80, antecedentMatches: [{ symptomId: 10, userConfidence: 0.8 }] }
          ] 
        }
      ],
    },
    validatedBy: "Prof. Ahmad Fauzi (Pakar Nutrisi Tanaman)",
    validationNote: "Gejala defisiensi unsur hara mikro Boron. Aplikasi pupuk Fertibor / Borate 48% dosis 50-100 g per pohon pada ketiak pelepah.",
    agreement: true,
    validatedDiseaseName: "Daun Mengecil (Defisiensi Boron)",
  },
];

export const mockAccuracyReport = {
  from: "2026-01-01",
  to: "2026-06-30",
  agreementRate: 0.962, // 96.2% akurasi selaras pakar
  totalCases: 148,
  emergencyCases: 38,
  avgDiagnosisTimeMs: 145,
  perDisease: [
    { diseaseId: 2, diseaseName: "Busuk Pangkal Batang (Ganoderma)", agreement: 0.98, cases: 34 },
    { diseaseId: 9, diseaseName: "Hama Tikus (Rattus tiomanicus)", agreement: 0.97, cases: 24 },
    { diseaseId: 11, diseaseName: "Hama Ulat Api (Setothosea asigna)", agreement: 0.96, cases: 20 },
    { diseaseId: 10, diseaseName: "Hama Rayap (Coptotermes)", agreement: 0.98, cases: 18 },
    { diseaseId: 3, diseaseName: "Busuk Kuncup (Spear rot)", agreement: 0.95, cases: 14 },
    { diseaseId: 1, diseaseName: "Akar (Blast disease)", agreement: 0.94, cases: 12 },
    { diseaseId: 4, diseaseName: "Garis Kuning (Patch yellow)", agreement: 0.92, cases: 8 },
    { diseaseId: 12, diseaseName: "Hama Ulat Kantong (Metisa plana)", agreement: 0.96, cases: 7 },
    { diseaseId: 8, diseaseName: "Daun Mengecil (Defisiensi Boron)", agreement: 0.95, cases: 5 },
    { diseaseId: 6, diseaseName: "Busuk Tandan (Marasmius)", agreement: 0.94, cases: 3 },
    { diseaseId: 5, diseaseName: "Tajuk (Crown disease)", agreement: 0.92, cases: 2 },
    { diseaseId: 7, diseaseName: "Anthracnose", agreement: 0.90, cases: 1 },
  ],
  ruleHitCounts: [
    { ruleId: 4, ruleCode: "R004", ruleTitle: "Ganoderma - Jamur Pangkal Batang", hits: 48 },
    { ruleId: 14, ruleCode: "R014", ruleTitle: "Tikus - Kerusakan Bibit & Pelepah", hits: 36 },
    { ruleId: 18, ruleCode: "R018", ruleTitle: "Ulat Api - Daun Berlubang", hits: 28 },
    { ruleId: 16, ruleCode: "R016", ruleTitle: "Rayap - Batang Berongga & Serbuk", hits: 24 },
    { ruleId: 7, ruleCode: "R007", ruleTitle: "Spear Rot - Kuncup Busuk", hits: 20 },
    { ruleId: 2, ruleCode: "R002", ruleTitle: "Akar - Busuk Akar", hits: 18 },
  ],
  monthlyData: [
    { month: "Jan 2026", cases: 18, agreementRate: 0.91 },
    { month: "Feb 2026", cases: 22, agreementRate: 0.93 },
    { month: "Mar 2026", cases: 26, agreementRate: 0.95 },
    { month: "Apr 2026", cases: 30, agreementRate: 0.96 },
    { month: "Mei 2026", cases: 34, agreementRate: 0.97 },
    { month: "Jun 2026", cases: 18, agreementRate: 0.98 },
  ],
};

export const mockStats = {
  monthlyCases: mockAccuracyReport.monthlyData,
  diseaseDistribution: mockAccuracyReport.perDisease.map(d => ({
    name: d.diseaseName,
    count: d.cases
  }))
};
