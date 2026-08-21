import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/auth';
import { deleteCloudinaryMedia } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';
import { sortExperiencesByDate } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

const initialExperiences = [
  {
    title: 'Back End Developer',
    company: 'PT Indolakto',
    type: 'Internship',
    date: 'Jul 2026 - Present',
    duration: '2 mos',
    location: 'Pasuruan, East Java, Indonesia',
    locationType: 'On-site',
    logo: '/images/logopt/logo-indolakto.png',
    skills: ['Back-End Web Development', 'Mqtt', 'Back-end Operations', 'Server Side Programming'],
    order: 1,
  },
  {
    title: 'Web Developer',
    company: 'PT. XYZ',
    type: 'Freelance',
    date: 'Jun 2026',
    duration: '1 mo',
    location: 'Indonesia',
    locationType: 'Remote',
    description: 'Membangun aplikasi dashboard HR & GA (Human Resources & General Affairs) full-stack terintegrasi untuk PT XYZ (perusahaan agribisnis kelapa sawit nasional). Dashboard ini mendigitalisasi pemantauan Hari Kerja Normal Efektif (HKNE) karyawan operasional (Panen, Infield, Rawat), absensi, serta pelacakan realisasi anggaran biaya. Dilengkapi fitur manajemen aset dan jatuh tempo pajak kendaraan operasional untuk meminimalkan denda serta mendukung efisiensi biaya secara real-time.',
    initials: 'XYZ',
    media: '/images/projects/DashboardHRGA.jpg',
    logo: '/images/projects/DashboardHRGA.jpg',
    skills: ['Full-Stack Development'],
    order: 2,
  },
  {
    title: 'Back End Developer',
    company: 'UTERO INDONESIA',
    type: 'Internship',
    date: 'Jan 2026 - Jun 2026',
    duration: '6 mos',
    location: 'Kota Malang, East Java, Indonesia',
    locationType: 'On-site',
    logo: '/images/logopt/utero-logo.png',
    skills: ['Back-End Web Development'],
    order: 3,
  },
  {
    title: 'Project Manager',
    company: 'WebQuest ID',
    type: 'Self-employed',
    date: 'Oct 2025 - Present',
    duration: '6 mos',
    location: 'Kota Malang, East Java, Indonesia',
    locationType: 'Hybrid',
    logo: '/images/logopt/webquest-logo.png',
    skills: ['Full-Stack Development and Project Management'],
    order: 4,
  },
  {
    title: 'Fullstack Developer',
    company: 'PT. Palma Serasih Tbk.',
    type: 'Freelance',
    date: 'Oct 2025 - Feb 2026',
    duration: '5 mos',
    location: 'Jakarta, Indonesia',
    locationType: 'Remote',
    description: 'Membangun sistem manajemen operasional perkebunan berbasis web untuk memusatkan proses pencatatan, monitoring, dan pelaporan dalam satu platform terintegrasi. Sistem ini mencakup manajemen data master (lokasi, karyawan, kelompok kerja), transaksi harian lapangan (absensi, panen, pekerjaan, angkut, taksasi), hingga rekap dan verifikasi laporan untuk kebutuhan operasional dan manajerial. Dengan dashboard dan alur kerja yang terstruktur, PALMA ROOTS membantu tim mempercepat input data, mengurangi kesalahan manual, meningkatkan transparansi progres kerja, serta memudahkan pengambilan keputusan berbasis data.',
    logo: '/images/logopt/palma-logo.png',
    media: '/images/projects/palmaroots.png',
    skills: ['Full-Stack Development and Project Management'],
    order: 5,
  },
  {
    title: 'Frontend Web Developer',
    company: 'PT. XYZ',
    type: 'Freelance',
    date: 'Jul 2025 - Aug 2025',
    duration: '2 mos',
    location: 'Indonesia',
    locationType: 'Remote',
    description: 'Berkolaborasi dengan stakeholder dari PT XYZ untuk memahami kebutuhan bisnis dan Key Performance Indicators (KPI) yang perlu dimonitor. Dashboard ini bertujuan untuk meningkatkan efisiensi operasional dan mendukung pengambilan keputusan strategis berbasis data untuk perusahaan agribisnis/kelapa sawit nasional.',
    initials: 'XYZ',
    skills: ['Front-End Development'],
    order: 6,
  }
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('experiences');
    let data = await collection.find({}).sort({ order: 1 }).toArray();

    if (data.length === 0) {
      await collection.insertMany(initialExperiences);
      data = await collection.find({}).sort({ order: 1 }).toArray();
    } else {
      const missingItems = initialExperiences.filter(
        (initItem) => !data.some((dbItem) => dbItem.title === initItem.title && dbItem.company === initItem.company)
      );
      if (missingItems.length > 0) {
        await collection.insertMany(missingItems);
        data = await collection.find({}).sort({ order: 1 }).toArray();
      }
    }

    return NextResponse.json({ success: true, data: sortExperiencesByDate(data) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { db } = await connectToDatabase();
    const { _id, ...body } = await request.json();
    const result = await db.collection('experiences').insertOne({
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
    if (_id === undefined || _id === null) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    if (oldCloudinaryPublicId && updateData.cloudinaryPublicId && oldCloudinaryPublicId !== updateData.cloudinaryPublicId) {
      try {
        await deleteCloudinaryMedia(oldCloudinaryPublicId);
      } catch (mediaError) {
        console.error('Cloudinary delete old media error:', mediaError);
      }
    }

    const filter = ObjectId.isValid(_id) ? { _id: new ObjectId(_id) } : { _id: _id };
    await db.collection('experiences').updateOne(
      filter,
      { $set: updateData }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Experiences PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id === null) return NextResponse.json({ success: false, error: 'ID parameter is missing' }, { status: 400 });

    const { db } = await connectToDatabase();
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };


    const item = await db.collection('experiences').findOne(filter);
    if (item?.cloudinaryPublicId) {
      try {
        await deleteCloudinaryMedia(item.cloudinaryPublicId);
      } catch (mediaError) {
        console.error('Cloudinary delete media error:', mediaError);
      }
    }

    await db.collection('experiences').deleteOne(filter);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Experiences DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

