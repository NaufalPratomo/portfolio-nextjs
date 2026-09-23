import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/auth';
import { deleteCloudinaryMedia } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export const initialCopyrights = [
  {
    _id: 'default-aida',
    title: 'AIDA V2: Sistem Reklame Cerdas Terintegrasi',
    type: 'Program Komputer',
    registrationNumber: '001417127',
    applicationNumber: 'EC002026143438',
    date: '14 Agustus 2026',
    holder: 'Politeknik Negeri Malang',
    creators: [
      'Muhammad Afif Hendrawan',
      'Pramana Yoga Saputra',
      'Triana Fatmawati',
      'Sofyan Noor Arief',
      'Armand Maulana Andika Putra',
      'Innama Maesa Putri',
      'Muhammad Naufal Pratomo',
      'Aril Ibbet Ardana Putra'
    ],
    description: 'Sistem Reklame Cerdas Terintegrasi yang dilindungi oleh Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta dengan jangka waktu pelindungan 50 (lima puluh) tahun sejak Ciptaan pertama kali diumumkan.',
    certificateImage: '/images/copyright/aida-v2-cert.png',
    attachmentImage: '/images/copyright/aida-v2-creators.png',
    cloudinaryPublicId: '',
    attachmentCloudinaryPublicId: '',
    featured: true,
    order: 1,
    createdAt: new Date('2026-08-14T00:00:00.000Z'),
  }
];

export async function GET() {
  try {
    const fetchDb = async () => {
      const { db } = await connectToDatabase();
      const collection = db.collection('copyrights');
      let data = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();

      if (data.length === 0) {
        await collection.insertMany(initialCopyrights.map((item) => ({ ...item })));
        data = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
      }
      return data;
    };

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB connection timeout')), 4000)
    );

    const data = await Promise.race([fetchDb(), timeout]);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Copyrights GET error (using fallback):', error.message || error);
    // If DB is unreachable or times out, return initialCopyrights fallback
    return NextResponse.json({ success: true, data: initialCopyrights, fallback: true });
  }
}

export async function POST(request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { db } = await connectToDatabase();
    const { _id, ...body } = await request.json();
    const result = await db.collection('copyrights').insertOne({
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
    const { 
      _id, 
      oldCloudinaryPublicId, 
      oldAttachmentCloudinaryPublicId, 
      ...updateData 
    } = await request.json();

    if (_id === undefined || _id === null) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    // Clean up replaced certificate image
    if (oldCloudinaryPublicId && updateData.cloudinaryPublicId && oldCloudinaryPublicId !== updateData.cloudinaryPublicId) {
      try {
        await deleteCloudinaryMedia(oldCloudinaryPublicId);
      } catch (mediaError) {
        console.error('Cloudinary delete old certificate error:', mediaError);
      }
    }

    // Clean up replaced attachment image
    if (oldAttachmentCloudinaryPublicId && updateData.attachmentCloudinaryPublicId && oldAttachmentCloudinaryPublicId !== updateData.attachmentCloudinaryPublicId) {
      try {
        await deleteCloudinaryMedia(oldAttachmentCloudinaryPublicId);
      } catch (mediaError) {
        console.error('Cloudinary delete old attachment error:', mediaError);
      }
    }

    const filter = ObjectId.isValid(_id) ? { _id: new ObjectId(_id) } : { _id: _id };
    await db.collection('copyrights').updateOne(
      filter,
      { $set: updateData }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Copyrights PUT error:', error);
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

    const item = await db.collection('copyrights').findOne(filter);
    if (item?.cloudinaryPublicId) {
      try {
        await deleteCloudinaryMedia(item.cloudinaryPublicId);
      } catch (mediaError) {
        console.error('Cloudinary delete certificate media error:', mediaError);
      }
    }
    if (item?.attachmentCloudinaryPublicId) {
      try {
        await deleteCloudinaryMedia(item.attachmentCloudinaryPublicId);
      } catch (mediaError) {
        console.error('Cloudinary delete attachment media error:', mediaError);
      }
    }

    await db.collection('copyrights').deleteOne(filter);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Copyrights DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
