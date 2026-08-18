import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/auth';
import { deleteCloudinaryMedia } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

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
    console.error('Achievements GET error:', error);
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
    if (!_id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    if (oldCloudinaryPublicId && updateData.cloudinaryPublicId && oldCloudinaryPublicId !== updateData.cloudinaryPublicId) {
      try {
        await deleteCloudinaryMedia(oldCloudinaryPublicId);
      } catch (mediaError) {
        console.error('Cloudinary delete old media error:', mediaError);
      }
    }

    const filter = ObjectId.isValid(_id) ? { _id: new ObjectId(_id) } : { _id: _id };
    await db.collection('achievements').updateOne(
      filter,
      { $set: updateData }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Achievements PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    const { db } = await connectToDatabase();
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };

    const item = await db.collection('achievements').findOne(filter);
    if (item?.cloudinaryPublicId) {
      try {
        await deleteCloudinaryMedia(item.cloudinaryPublicId);
      } catch (mediaError) {
        console.error('Cloudinary delete media error:', mediaError);
      }
    }

    await db.collection('achievements').deleteOne(filter);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Achievements DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

