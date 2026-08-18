import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/auth';
import { deleteCloudinaryMedia } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

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
    skills: ['Project Management'],
    order: 4,
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

    if (oldCloudinaryPublicId && updateData.cloudinaryPublicId && oldCloudinaryPublicId !== updateData.cloudinaryPublicId) {
      await deleteCloudinaryMedia(oldCloudinaryPublicId);
    }

    await db.collection('experiences').updateOne(
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

    const item = await db.collection('experiences').findOne({ _id: new ObjectId(id) });
    if (item?.cloudinaryPublicId) {
      await deleteCloudinaryMedia(item.cloudinaryPublicId);
    }

    await db.collection('experiences').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
