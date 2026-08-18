import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

const initialSkills = {
  hardSkills: [
    { name: 'Laravel', level: 65, order: 1 },
    { name: 'Next.js', level: 70, order: 2 },
    { name: 'Basis Data (MySQL, MongoDB)', level: 65, order: 3 },
    { name: 'Editing (Canva, Capcut)', level: 70, order: 4 },
    { name: 'Microsoft Office (Word, Excel, PPT)', level: 70, order: 5 },
    { name: 'PHP', level: 65, order: 6 },
    { name: 'CSS', level: 70, order: 7 },
    { name: 'HTML', level: 70, order: 8 },
    { name: 'JavaScript', level: 70, order: 9 },
  ],
  softSkills: [
    'Leadership',
    'Teamwork',
    'Critical Thinking',
    'Analytical Thinking',
    'Communication',
    'Problem Solving',
    'Time Management',
  ]
};

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('skills');
    let data = await collection.find({}).toArray();

    if (data.length === 0) {
      const hardSkillDocs = initialSkills.hardSkills.map(s => ({ ...s, type: 'hard' }));
      const softSkillDocs = initialSkills.softSkills.map((s, idx) => ({ name: s, type: 'soft', order: idx + 1 }));
      await collection.insertMany([...hardSkillDocs, ...softSkillDocs]);
      data = await collection.find({}).toArray();
    }

    const hard = data.filter(s => s.type === 'hard').sort((a, b) => (a.order || 0) - (b.order || 0));
    const soft = data.filter(s => s.type === 'soft').sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ success: true, data: { hardSkills: hard, softSkills: soft } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAdminAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const result = await db.collection('skills').insertOne({
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
    const { _id, ...updateData } = await request.json();
    await db.collection('skills').updateOne(
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
    await db.collection('skills').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
