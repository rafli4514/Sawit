import type { Symptom, Disease, Treatment, Rule, DiagnosisCase, User } from "../engine/types";

export const mockSymptoms: Symptom[] = [
  // DAUN (12 Gejala)
  {
    id: 1, code: "SP001", label: "Bercak Daun Kecil", category: "Daun", severityHint: "low", active: true,
    description: "Bercak bulat kecil berwarna coklat gelap pada anak daun muda.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
  },
  {
    id: 2, code: "SP002", label: "Bercak Daun Melebar (Hawar)", category: "Daun", severityHint: "medium", active: true,
    description: "Bercak coklat yang menyatu membentuk area mati yang luas (hawar).",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop",
  },
  {
    id: 3, code: "SP003", label: "Daun Menguning (Klorosis)", category: "Daun", severityHint: "medium", active: true,
    description: "Anak daun berubah warna menjadi kuning pucat merata.",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  },
  {
    id: 8, code: "SP008", label: "Lesi Bergaris Coklat", category: "Daun", severityHint: "medium", active: true,
    description: "Garis-garis nekrotik memanjang sejajar tulang daun.",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  },
  {
    id: 9, code: "SP009", label: "Daun Berlubang/Terpotong", category: "Daun", severityHint: "medium", active: true,
    description: "Helaian daun tampak dimakan serangga, menyisakan lidi atau berlubang.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
  },
  {
    id: 11, code: "SP011", label: "Bercak Jingga (Orange Spotting)", category: "Daun", severityHint: "low", active: true,
    description: "Bercak kecil tembus cahaya berwarna jingga, indikasi defisiensi Kalium.",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  },
  {
    id: 12, code: "SP012", label: "Ujung Daun Mengering", category: "Daun", severityHint: "medium", active: true,
    description: "Bagian ujung anak daun mengering dan berwarna coklat tua (nekrosis).",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  },
  {
    id: 13, code: "SP013", label: "Daun Menggulung", category: "Daun", severityHint: "medium", active: true,
    description: "Anak daun menggulung ke arah dalam atau bawah.",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  },
  {
    id: 14, code: "SP014", label: "Karat Daun (Algae)", category: "Daun", severityHint: "low", active: true,
    description: "Lapisan seperti beludru berwarna jingga/abu-abu di permukaan daun.",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  },
  {
    id: 15, code: "SP015", label: "Daun Muda Berkerut", category: "Daun", severityHint: "medium", active: true,
    description: "Daun yang baru terbuka tampak kerdil dan berkerut/cacat.",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  },
  {
    id: 16, code: "SP016", label: "Bercak Halo Kuning", category: "Daun", severityHint: "medium", active: true,
    description: "Bercak coklat yang dikelilingi lingkaran (halo) berwarna kuning terang.",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  },
  {
    id: 17, code: "SP017", label: "V-Shape Yellowing", category: "Daun", severityHint: "medium", active: true,
    description: "Gejala kuning membentuk huruf V pada ujung pelepah tua.",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  },

  // BATANG (7 Gejala)
  {
    id: 2, code: "SP002-B", label: "Kotoran Serangga (Frass)", category: "Batang", severityHint: "low", active: true,
    description: "Serbuk kayu atau kotoran larva di ketiak pelepah atau pangkal batang.",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop",
  },
  {
    id: 4, code: "SP004", label: "Pelepah Sempal (Layu)", category: "Batang", severityHint: "high", active: true,
    description: "Pelepah daun patah di bagian tengah atau pangkal namun tetap menggantung.",
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop",
  },
  {
    id: 6, code: "SP006", label: "Eksudasi Cairan Coklat", category: "Batang", severityHint: "high", active: true,
    description: "Keluar cairan kental berwarna coklat kehitaman dari retakan batang.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
  },
  {
    id: 10, code: "SP010", label: "Batang Melunak/Berlubang", category: "Batang", severityHint: "high", active: true,
    description: "Jaringan batang bagian dalam membusuk dan menjadi rongga.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
  },
  {
    id: 18, code: "SP018", label: "Pertumbuhan Jamur di Batang", category: "Batang", severityHint: "high", active: true,
    description: "Terdapat badan buah jamur (basidiokarp) menempel di pangkal batang.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
  },
  {
    id: 19, code: "SP019", label: "Batang Menciut/Kerdil", category: "Batang", severityHint: "medium", active: true,
    description: "Diameter batang tampak mengecil di bagian atas atau pertumbuhan meninggi terhambat.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
  },
  {
    id: 20, code: "SP020", label: "Luka Gerekan di Pelepah", category: "Batang", severityHint: "medium", active: true,
    description: "Terdapat lubang gerekan berbentuk oval pada pangkal pelepah muda.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
  },

  // AKAR (3 Gejala)
  {
    id: 5, code: "SP005", label: "Akar Membusuk", category: "Akar", severityHint: "high", active: true,
    description: "Akar berwarna coklat kehitaman, rapuh, dan jaringan korteks terlepas.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
  },
  {
    id: 21, code: "SP021", label: "Akar Udara (Adventive)", category: "Akar", severityHint: "medium", active: true,
    description: "Munculnya akar-akar baru di atas permukaan tanah pada pangkal batang.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
  },
  {
    id: 22, code: "SP022", label: "Pertumbuhan Akar Terhenti", category: "Akar", severityHint: "medium", active: true,
    description: "Sistem perakaran kerdil dan tidak berkembang ke area luar piringan.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
  },

  // PUCUK (3 Gejala)
  {
    id: 7, code: "SP007", label: "Pucuk Mati (Spear Rot)", category: "Pucuk", severityHint: "high", active: true,
    description: "Janur (pucuk muda) membusuk, berwarna coklat basah, dan mudah dicabut.",
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop",
  },
  {
    id: 23, code: "SP023", label: "Janur Tegak (Unopened)", category: "Pucuk", severityHint: "medium", active: true,
    description: "Terdapat lebih dari 3 janur yang tidak membuka (tegak lurus).",
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop",
  },
  {
    id: 24, code: "SP024", label: "Pucuk Membengkok", category: "Pucuk", severityHint: "medium", active: true,
    description: "Bagian pucuk tumbuh tidak lurus, miring ke satu sisi.",
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop",
  },

  // BUAH (3 Gejala)
  {
    id: 25, code: "SP025", label: "Buah Busuk Prematur", category: "Buah", severityHint: "high", active: true,
    description: "Brondolan membusuk sebelum matang, berair dan berjamur.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
  },
  {
    id: 26, code: "SP026", label: "Buah Kerdil/Aborsi", category: "Buah", severityHint: "medium", active: true,
    description: "Tandan buah tidak berkembang maksimal, ukuran kecil dan kering.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
  },
  {
    id: 27, code: "SP027", label: "Brondolan Mudah Lepas", category: "Buah", severityHint: "low", active: true,
    description: "Buah mentah rontok dengan sendirinya tanpa gangguan mekanis.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
  },
];

export const mockTreatments: Treatment[] = [
  {
    id: 1, name: "Penanganan Ganoderma (Busuk Pangkal Batang)",
    steps: [
      "Lakukan sensus untuk menentukan tingkat keparahan (stadium)",
      "Buat parit isolasi sedalam 1m di sekeliling tanaman terinfeksi",
      "Aplikasikan agensia hayati Trichoderma harzianum pada piringan",
      "Bongkar dan musnahkan tanaman jika infeksi >50% (stadium berat)",
      "Gunakan fungisida sistemik melalui injeksi batang (Hexaconazole)",
    ],
    emergencyActions: [
      "Segera isolasi tanaman agar spora jamur tidak menyebar ke tanaman sehat",
      "Hancurkan badan buah jamur yang ditemukan dan kubur dengan kapur",
    ],
    dosage: { chemical: "Trichoderma / Hexaconazole", rate: "400g / 15ml", unit: "per pohon", per: "pohon" },
    safetyNotes: "Pastikan alat pelindung diri lengkap. Limbah tanaman sakit jangan dibawa keluar blok.",
  },
  {
    id: 2, name: "Penanganan Busuk Pucuk (Phytophthora)",
    steps: [
      "Bersihkan jaringan pucuk yang membusuk sampai bersih (sanitasi)",
      "Semprotkan fungisida tembaga pada bekas sayatan",
      "Lakukan pengenceran kanopi untuk mengurangi kelembaban",
      "Pastikan drainase blok lancar tidak ada air tergenang",
    ],
    emergencyActions: [
      "Potong bagian pucuk yang busuk segera untuk menyelamatkan titik tumbuh",
    ],
    dosage: { chemical: "Copper Oxychloride", rate: "2g/L", unit: "larutan", per: "pohon" },
    safetyNotes: "Jangan semprot saat akan turun hujan. Gunakan masker.",
  },
  {
    id: 3, name: "Pengendalian Hama Oryctes rhinoceros",
    steps: [
      "Tanam tanaman penutup tanah (LCC) untuk menghambat akses ke tumpukan batang",
      "Pasang jebakan feromon (Ferotrap) 1 buah per 2 hektar",
      "Aplikasi jamur Metarhizium anisopliae pada tempat biak larva",
      "Kutip kumbang dewasa secara manual pada tanaman muda",
    ],
    emergencyActions: [
      "Aplikasi insektisida butiran (Carbofuran) pada ketiak pelepah muda",
    ],
    dosage: { chemical: "Cypermethrin / Carbofuran", rate: "2ml/L / 10g", unit: "dosis", per: "pohon" },
    safetyNotes: "Insektisida butiran beracun tinggi, gunakan sarung tangan.",
  },
  {
    id: 4, name: "Koreksi Defisiensi Unsur Hara",
    steps: [
      "Lakukan analisis daun dan tanah untuk diagnosis pasti",
      "Aplikasikan pupuk tunggal (MOP/Kieserit) sesuai rekomendasi",
      "Perbaiki pH tanah dengan aplikasi Dolomit jika terlalu asam",
      "Tingkatkan bahan organik tanah dengan aplikasi janjang kosong",
    ],
    emergencyActions: [],
    dosage: { chemical: "Pupuk KCL / Kieserit", rate: "2.5kg", unit: "per tahun", per: "pohon" },
    safetyNotes: "Aplikasikan pupuk pada piringan yang bersih.",
  },
  {
    id: 5, name: "Pengendalian Ulat Api/Kantung",
    steps: [
      "Lakukan pengamatan (sensus) global setiap 2 minggu",
      "Jika populasi di atas ambang ekonomi, lakukan penyemprotan",
      "Gunakan insektisida biologi (Bacillus thuringiensis)",
      "Lestarikan tanaman bermanfaat (Antigonon leptopus) sebagai inang musuh alami",
    ],
    emergencyActions: [
      "Fogging atau penyemprotan udara jika terjadi ledakan populasi",
    ],
    dosage: { chemical: "Deltamethrin", rate: "0.5 L/Ha", unit: "volume", per: "hektar" },
    safetyNotes: "Hindari penyemprotan di dekat pemukiman atau sumber air.",
  },
  {
    id: 6, name: "Penanganan Penyakit Antraknosa (Pembibitan)",
    steps: [
      "Kurangi intensitas penyiraman dan naungan",
      "Pisahkan bibit yang sakit dari bibit sehat",
      "Aplikasikan fungisida preventif secara rutin",
      "Gunakan media tanam yang steril",
    ],
    emergencyActions: [],
    dosage: { chemical: "Captan / Maneb", rate: "2g/L", unit: "larutan", per: "bibit" },
    safetyNotes: "Gunakan masker saat aplikasi di dalam nursery.",
  },
];

export const mockDiseases: Disease[] = [
  { id: 1, name: "Busuk Pangkal Batang (Ganoderma)", severityLevel: "high", treatmentId: 1, summary: "Penyakit paling mematikan pada kelapa sawit yang disebabkan oleh jamur Ganoderma boninense." },
  { id: 2, name: "Busuk Pucuk (Bud Rot)", severityLevel: "high", treatmentId: 2, summary: "Infeksi pada titik tumbuh yang sering disebabkan oleh Phytophthora atau bakteri." },
  { id: 3, name: "Hama Kumbang Tanduk (Oryctes)", severityLevel: "high", treatmentId: 3, summary: "Hama yang menyerang titik tumbuh tanaman muda, menyebabkan daun berbentuk huruf V terbalik." },
  { id: 4, name: "Defisiensi Unsur Kalium (K)", severityLevel: "low", treatmentId: 4, summary: "Kekurangan hara K yang ditandai dengan bercak jingga pada daun tua." },
  { id: 5, name: "Ulat Api (Setothosea asigna)", severityLevel: "medium", treatmentId: 5, summary: "Hama pemakan daun yang dapat menyebabkan defoliasi parah secara cepat." },
  { id: 6, name: "Antraknosa", severityLevel: "medium", treatmentId: 6, summary: "Penyakit jamur yang umum menyerang bibit di nursery." },
  { id: 7, name: "Defisiensi Magnesium (Mg)", severityLevel: "low", treatmentId: 4, summary: "Kekurangan hara Mg yang menyebabkan daun menguning merata (klorosis)." },
  { id: 8, name: "Hama Ulat Kantung (Metisa plana)", severityLevel: "medium", treatmentId: 5, summary: "Hama yang membuat kantung dari serpihan daun, menyerang tajuk bagian bawah." },
  { id: 9, name: "Penyakit Garis Kuning (Chlorotic Streak)", severityLevel: "medium", treatmentId: 2, summary: "Penyakit virus atau fisiologis yang menyebabkan garis kuning pada daun muda." },
  { id: 10, name: "Busuk Buah (Marasmius)", severityLevel: "medium", treatmentId: 2, summary: "Jamur yang menyerang tandan buah pada kondisi kebun yang terlalu lembab." },
];

export const mockRules: Rule[] = [
  // GANODERMA (R001 - R003)
  { id: 1, code: "R001", title: "Gejala Klasik Ganoderma", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Kombinasi paling umum", antecedents: [{ symptomId: 18, minConfidence: 0.1 }, { symptomId: 4, minConfidence: 0.2 }], consequents: [{ diseaseId: 1, cf: 0.95 }] },
  { id: 2, code: "R002", title: "Ganoderma Stadium Awal", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Fokus pada akar dan pelepah", antecedents: [{ symptomId: 5, minConfidence: 0.3 }, { symptomId: 4, minConfidence: 0.3 }], consequents: [{ diseaseId: 1, cf: 0.75 }] },
  { id: 3, code: "R003", title: "Ganoderma Stadium Lanjut", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Gejala batang dominan", antecedents: [{ symptomId: 10, minConfidence: 0.5 }, { symptomId: 6, minConfidence: 0.4 }], consequents: [{ diseaseId: 1, cf: 0.85 }] },

  // ORYCTES (R004 - R005)
  { id: 4, code: "R004", title: "Serangan Kumbang Tanduk", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Luka gerekan + janur cacat", antecedents: [{ symptomId: 20, minConfidence: 0.2 }, { symptomId: 15, minConfidence: 0.2 }], consequents: [{ diseaseId: 3, cf: 0.90 }] },
  { id: 5, code: "R005", title: "Indikasi Oryctes Lapangan", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Fokus pada frass dan pucuk", antecedents: [{ symptomId: 2, minConfidence: 0.1 }, { symptomId: 24, minConfidence: 0.3 }], consequents: [{ diseaseId: 3, cf: 0.70 }] },

  // DEFISIENSI (R006 - R008)
  { id: 6, code: "R006", title: "Defisiensi Kalium (K)", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Nutrisi", notes: "Bercak jingga khas", antecedents: [{ symptomId: 11, minConfidence: 0.2 }], consequents: [{ diseaseId: 4, cf: 0.80 }] },
  { id: 7, code: "R007", title: "Defisiensi Magnesium (Mg)", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Nutrisi", notes: "Kuning merata pelepah tua", antecedents: [{ symptomId: 3, minConfidence: 0.3 }, { symptomId: 17, minConfidence: 0.4 }], consequents: [{ diseaseId: 7, cf: 0.85 }] },
  { id: 8, code: "R008", title: "Klorosis Umum", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Nutrisi", notes: "Gejala kuning dasar", antecedents: [{ symptomId: 3, minConfidence: 0.1 }], consequents: [{ diseaseId: 7, cf: 0.50 }] },

  // ULAT API/KANTUNG (R009 - R011)
  { id: 9, code: "R009", title: "Ledakan Ulat Api", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Daun habis dimakan", antecedents: [{ symptomId: 9, minConfidence: 0.4 }], consequents: [{ diseaseId: 5, cf: 0.75 }] },
  { id: 10, code: "R010", title: "Serangan Ulat Kantung", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Fokus pada lidi daun", antecedents: [{ symptomId: 12, minConfidence: 0.3 }, { symptomId: 9, minConfidence: 0.2 }], consequents: [{ diseaseId: 8, cf: 0.80 }] },
  { id: 11, code: "R011", title: "Hama Pemakan Daun", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Hama", notes: "Gejala umum", antecedents: [{ symptomId: 9, minConfidence: 0.1 }], consequents: [{ diseaseId: 5, cf: 0.40 }] },

  // PUCUK/BUAH (R012 - R015)
  { id: 12, code: "R012", title: "Busuk Pucuk Akut", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Spear rot + bau", antecedents: [{ symptomId: 7, minConfidence: 0.5 }], consequents: [{ diseaseId: 2, cf: 0.90 }] },
  { id: 13, code: "R013", title: "Antraknosa Bibit", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Halo kuning bibit", antecedents: [{ symptomId: 16, minConfidence: 0.3 }, { symptomId: 1, minConfidence: 0.2 }], consequents: [{ diseaseId: 6, cf: 0.85 }] },
  { id: 14, code: "R014", title: "Busuk Buah Marasmius", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Brondolan busuk", antecedents: [{ symptomId: 25, minConfidence: 0.4 }], consequents: [{ diseaseId: 10, cf: 0.70 }] },
  { id: 15, code: "R015", title: "Garis Kuning Pucuk", active: true, version: 1, status: "published", createdAt: "2026-06-01T00:00:00Z", createdBy: "Pakar Agronomi", notes: "Janur tegak + kuning", antecedents: [{ symptomId: 23, minConfidence: 0.3 }, { symptomId: 3, minConfidence: 0.2 }], consequents: [{ diseaseId: 9, cf: 0.65 }] },
];

export const mockUsers: User[] = [
  { id: "u1", nama: "Bapak Sari Wibowo", email: "petani@demo.com", role: "petani" },
  { id: "u3", nama: "Prof. Ahmad Fauzi", email: "pakar@demo.com", role: "pakar" },
];

export const mockCases: DiagnosisCase[] = [
  {
    caseId: "KASUS-001",
    userId: "u1",
    userName: "Bapak Sari Wibowo",
    metadata: { plotId: "PLOT-A12", notes: "Tanaman di baris ke-3, pohon ke-7", timestamp: "2026-05-10T08:30:00Z" },
    output: {
      caseId: "KASUS-001",
      timestamp: "2026-05-10T08:30:00Z",
      diagnosisTimeMs: 245,
      emergencyFlag: true,
      inputs: [{ symptomId: 18, userConfidence: 0.8 }, { symptomId: 4, userConfidence: 0.7 }],
      diagnoses: [
        { diseaseId: 1, diseaseName: "Busuk Pangkal Batang (Ganoderma)", cfScore: 0.90, cfPercent: 90, severity: "high", treatmentId: 1, rulesTraced: [{ ruleId: 1, ruleCode: "R001", ruleTitle: "Gejala Klasik Ganoderma", cfContribution: 0.665, antecedentMatches: [{ symptomId: 18, userConfidence: 0.8 }, { symptomId: 4, userConfidence: 0.7 }] }] },
      ],
    },
    validatedBy: "Prof. Ahmad Fauzi",
    validationNote: "Sesuai dengan diagnosis sistem.",
    agreement: true,
    validatedDiseaseName: "Busuk Pangkal Batang (Ganoderma)",
  },
];

export const mockAccuracyReport = {
  from: "2026-01-01",
  to: "2026-06-10",
  agreementRate: 0.82,
  totalCases: 124,
  emergencyCases: 28,
  avgDiagnosisTimeMs: 156,
  perDisease: [
    { diseaseId: 1, diseaseName: "Ganoderma", agreement: 0.88, cases: 35 },
    { diseaseId: 3, diseaseName: "Oryctes", agreement: 0.84, cases: 22 },
    { diseaseId: 5, diseaseName: "Ulat Api", agreement: 0.78, cases: 18 },
    { diseaseId: 7, diseaseName: "Defisiensi Mg", agreement: 0.92, cases: 15 },
  ],
  ruleHitCounts: [
    { ruleId: 1, ruleCode: "R001", ruleTitle: "Gejala Klasik Ganoderma", hits: 32 },
    { ruleId: 4, ruleCode: "R004", ruleTitle: "Serangan Kumbang Tanduk", hits: 28 },
    { ruleId: 7, ruleCode: "R007", ruleTitle: "Defisiensi Magnesium", hits: 20 },
  ],
  monthlyData: [
    { month: "Jan 2026", cases: 15, agreementRate: 0.75 },
    { month: "Feb 2026", cases: 18, agreementRate: 0.78 },
    { month: "Mar 2026", cases: 22, agreementRate: 0.80 },
    { month: "Apr 2026", cases: 25, agreementRate: 0.82 },
    { month: "Mei 2026", cases: 30, agreementRate: 0.85 },
    { month: "Jun 2026", cases: 14, agreementRate: 0.88 },
  ],
};

export const mockStats = {
  monthlyCases: mockAccuracyReport.monthlyData,
  diseaseDistribution: mockAccuracyReport.perDisease.map(d => ({
    name: d.diseaseName,
    count: d.cases
  }))
};
