import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/auth';
import { deleteCloudinaryMedia } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

const initialProjects = [
  {
    category: 'client',
    title: 'AIDA - Advertisement Intelligence & Data Analytics - (PT Utero Kreatif Indonesia)',
    period: 'Januari 2026 - Present',
    description: 'AIDA adalah sistem monitoring dan analitik billboard berbasis AI untuk deteksi serta perhitungan kendaraan secara real-time. Dalam proyek ini, saya tidak membangun sistem dari nol, tetapi berfokus pada improvement end-to-end: penyempurnaan tampilan dashboard agar lebih jelas dan usable, perbaikan logika proses data agar lebih stabil, serta retraining model YOLO untuk meningkatkan akurasi deteksi. Hasilnya, sistem memberikan insight trafik yang lebih presisi dan lebih siap digunakan untuk kebutuhan operasional serta pengambilan keputusan.',
    image: '/images/projects/aida.png',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Drizzle ORM', 'MySQL', 'Python', 'YOLO', 'OpenCV', 'MQTT'],
    order: 1,
  },
  {
    category: 'client',
    title: 'Enterprise Operations Dashboard - (PT Doa Suryo Agong)',
    period: 'Mar 2026 - Present',
    description: 'Membangun platform dashboard enterprise terintegrasi untuk mendukung operasional lintas divisi (Finance, HR, Produksi, Logistik, Sales, Management, dan Office) dalam satu ekosistem. Arsitektur backend dirancang secara hybrid, menggabungkan akses data langsung berbasis policy untuk CRUD ringan dan API server untuk business logic kompleks seperti approval workflow, payroll, reimburse, budget, serta agregasi metrik lintas modul. Solusi ini meningkatkan kecepatan proses kerja, akurasi data, dan kualitas pengambilan keputusan berbasis data real-time. Saya berfokus pada pengembangan backend end-to-end: merancang dan membangun API modular, menerapkan otorisasi berbasis role/access level, mengamankan data dengan Supabase Auth dan RLS, menyusun validasi payload serta service layer, mengembangkan workflow approval dan automasi perhitungan bisnis, serta melakukan hardening endpoint dan perbaikan bug kritikal agar sistem stabil di production.',
    image: '/images/projects/suryo_agong.png',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'API Routes', 'RLS', 'Node.js'],
    order: 2,
  },
  {
    category: 'private',
    title: 'Frugalin.aja',
    period: 'May 2026',
    description: 'Aplikasi pengelolaan keuangan pribadi (personal finance tracker) modern dengan visualisasi interaktif. Dilengkapi fitur canggih seperti Pemindai Struk otomatis berbasis OCR AI (Tesseract.js & Gemini 2.5 Flash), limit anggaran dinamis, pelacakan bunga bank bulanan, serta dukungan penuh Progressive Web App (PWA) untuk instalasi mandiri dengan animasi splash screen premium.',
    image: '/images/projects/frugalin.png',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'MongoDB', 'Next-Auth', 'Tesseract.js', 'OpenRouter API', 'PWA'],
    link: 'https://frugalin-aja.vercel.app/',
    tryMe: true,
    order: 3,
  },
  {
    category: 'private',
    title: 'Iqro Quran',
    period: 'Feb 2026 - Mar 2026',
    description: 'Aplikasi ini adalah platform Al-Qur’an berbasis web yang membantu pengguna membaca surah dan juz secara terstruktur, menandai ayat favorit (bookmark), serta memantau progres ibadah harian. Dilengkapi fitur pencarian, pengaturan tampilan bacaan, dan asisten AI untuk menjawab pertanyaan seputar Al-Qur’an, sistem ini dirancang dengan antarmuka modern, responsif, dan nyaman digunakan di berbagai perangkat.',
    image: '/images/projects/iqroquran.png',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Local Storage'],
    link: 'https://iqro-quran-delta.vercel.app/',
    tryMe: true,
    order: 4,
  },
  {
    category: 'private',
    title: 'Match Vibe',
    period: 'Feb 2026 - Mar 2026',
    description: 'MatchVibe adalah aplikasi web pencatat skor pertandingan multi-olahraga secara real-time, yang memudahkan pengguna memilih cabang olahraga, memasukkan nama pemain, lalu mengelola skor hingga penentuan pemenang dalam satu alur yang cepat dan intuitif. Sistem ini mendukung aturan skor berbeda untuk tiap olahraga (seperti badminton, basket, futsal, tenis, dan tenis meja), termasuk set, deuce, riwayat set, serta reset pertandingan, dengan antarmuka modern berbasis Next.js, React, Tailwind CSS, Zustand, dan Framer Motion.',
    image: '/images/projects/matchvibe.png',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Zustand', 'Framer Motion'],
    link: 'https://match-vibe-six.vercel.app/',
    tryMe: true,
    order: 5,
  },
  {
    category: 'private',
    title: 'Moto Tracker',
    period: 'Feb 2026',
    description: 'MotoTracker adalah aplikasi web untuk manajemen perawatan motor yang membantu pengguna memantau jadwal servis berdasarkan waktu dan kilometer, mengelola banyak kendaraan dalam satu dashboard, mencatat riwayat servis, serta mengekspor laporan servis ke PDF. Sistem ini dibangun dengan Next.js, React, TypeScript, Tailwind CSS, NextAuth, dan MongoDB sehingga tampil modern, responsif, dan aman untuk penggunaan harian.',
    image: '/images/projects/mototracker.png',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'NextAuth', 'MongoDB'],
    link: 'https://mototracker.vercel.app/',
    tryMe: true,
    order: 6,
  },
  {
    category: 'private',
    title: 'Deadline Reminder',
    period: 'Nov 2025 - Dec 2025',
    description: 'Aplikasi manajemen produktivitas cerdas untuk mengelola tugas dan tenggat waktu. Fitur unggulan meliputi sistem pengingat otomatis via email, manajemen prioritas dengan tracking real-time, dan autentikasi aman. Dibangun menggunakan Next.js dan MongoDB dengan antarmuka yang estetis dan responsif.',
    image: '/images/projects/deadlinereminderapp.png',
    tags: ['Next.js', 'MongoDB', 'TailwindCSS'],
    link: 'https://deadline-reminder-app.vercel.app/',
    tryMe: true,
    order: 7,
  },
  {
    category: 'private',
    title: 'Attendify',
    period: 'Jan 2026',
    description: 'Aplikasi pelacak waktu (time tracker) berbasis web yang dirancang untuk profesional yang mengutamakan fokus. Dilengkapi fitur check-in/check-out real-time, dashboard statistik produktivitas, dan logbook aktivitas harian. Dibangun dengan Next.js 16, React 19, dan Tailwind CSS dengan desain dark mode yang elegan dan responsif.',
    image: '/images/projects/attendify.png',
    tags: ['Next.js 16', 'React 19', 'Tailwind CSS'],
    link: 'https://attendify-three-sigma.vercel.app/',
    tryMe: true,
    order: 8,
  },
  {
    category: 'private',
    title: 'TALENTI',
    period: 'May 2025 - Oct 2025',
    description: 'Sistem informasi berbasis web untuk manajemen dan pencatatan prestasi mahasiswa di Jurusan Teknologi Informasi. Memfasilitasi mahasiswa dan dosen dalam mendokumentasikan, memvalidasi, dan mempublikasikan pencapaian akademik maupun non-akademik.',
    image: '/images/projects/talenti.png',
    tags: ['Laravel', 'MySQL'],
    order: 9,
  },
  {
    category: 'private',
    title: 'SIBETA',
    period: 'Dec 2024 - Jan 2025',
    description: 'Sistem Informasi Bebas Tanggungan TA untuk membantu pengelolaan data bebas tanggungan tugas akhir di Politeknik Negeri Malang.',
    image: '/images/projects/sibeta.png',
    tags: ['Laravel', 'MySQL'],
    order: 10,
  },
  {
    category: 'private',
    title: 'WeatherAI Classification System',
    period: 'Oct 2025 - Dec 2025',
    description: 'Mengembangkan aplikasi mobile berbasis Flutter yang mengimplementasikan sistem visi komputer untuk klasifikasi cuaca secara real-time. Aplikasi ini mampu menganalisis gambar langit untuk mengidentifikasi dan mengklasifikasikan kondisi cuaca secara otomatis, memberikan pengguna informasi meteorologi yang cepat dan akurat.',
    image: '/images/projects/weather.png',
    tags: ['Flutter', 'AI', 'Machine Learning'],
    order: 11,
  }
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('projects');
    let data = await collection.find({}).sort({ order: 1 }).toArray();

    if (data.length === 0) {
      await collection.insertMany(initialProjects);
      data = await collection.find({}).sort({ order: 1 }).toArray();
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const result = await db.collection('projects').insertOne({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { db } = await connectToDatabase();
    const { _id, oldCloudinaryPublicId, ...updateData } = await request.json();

    if (oldCloudinaryPublicId && updateData.cloudinaryPublicId && oldCloudinaryPublicId !== updateData.cloudinaryPublicId) {
      await deleteCloudinaryMedia(oldCloudinaryPublicId);
    }

    await db.collection('projects').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { db } = await connectToDatabase();

    const item = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    if (item?.cloudinaryPublicId) {
      await deleteCloudinaryMedia(item.cloudinaryPublicId);
    }

    await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
