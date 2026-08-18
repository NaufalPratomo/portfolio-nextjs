import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/auth';
import { deleteCloudinaryMedia } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

const initialAchievements = [
  {
    title: 'Lomba Web Development Nasional - Technofest',
    description: 'Participation in the Technofest competition.',
    image: '/images/lomba/technofest.png',
    date: '2026',
    order: 1,
  },
  {
    title: 'Explor[AI]tion',
    description: 'Participation in the Explor[AI]tion competition.',
    image: '/images/lomba/Explor[AI]tion.png',
    date: '2025',
    order: 2,
  },
  {
    title: '4C National Competition',
    description: 'Participation in the 4C National Competition.',
    image: '/images/lomba/4C.png',
    date: '2024',
    order: 3,
  }
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('achievements');
    let data = await collection.find({}).sort({ order: 1 }).toArray();

    if (data.length === 0) {
      await collection.insertMany(initialAchievements);
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
    const result = await db.collection('achievements').insertOne({
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

    await db.collection('achievements').updateOne(
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

    const item = await db.collection('achievements').findOne({ _id: new ObjectId(id) });
    if (item?.cloudinaryPublicId) {
      await deleteCloudinaryMedia(item.cloudinaryPublicId);
    }

    await db.collection('achievements').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
