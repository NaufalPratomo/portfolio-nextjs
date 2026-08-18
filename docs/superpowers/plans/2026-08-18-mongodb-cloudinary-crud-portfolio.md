# Dynamic Portfolio CRUD System (MongoDB Atlas + Cloudinary) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform static portfolio sections (Experience, Projects, Skills, Achievements) into dynamic CRUD modules backed by MongoDB Atlas and Cloudinary media management, with an admin dashboard at `/editporto-27112004`.

**Architecture:** Next.js App Router API Routes serve JSON data from MongoDB Atlas. Media assets (logos, project screenshots, achievement photos) are stored on Cloudinary with automatic deletion/replacement when items are updated or removed. The admin UI is protected by an access password.

**Tech Stack:** Next.js 14 App Router, MongoDB Node Driver (`mongodb`), Cloudinary SDK (`cloudinary`), Tailwind CSS, Framer Motion.

## Global Constraints

- Storage: MongoDB Atlas for documents, Cloudinary CDN for images.
- Admin Path: `/editporto-27112004`
- Security: Protected by `ADMIN_PASSWORD` in `.env.local` & cookie session.
- Auto-seeding: Automatically populate MongoDB collections from static dataset on initial load if collections are empty.
- Auto-cleanup: Automatically call Cloudinary `destroy` on `cloudinaryPublicId` when deleting or replacing media.

---

### Task 1: Install Cloudinary SDK & Create Core Helpers

**Files:**
- Create: `src/lib/mongodb.js`
- Create: `src/lib/cloudinary.js`
- Create: `src/lib/auth.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ADMIN_PASSWORD` from environment.
- Produces: 
  - `connectToDatabase()` returning `{ db, client }`
  - `cloudinary` configured instance and `deleteCloudinaryMedia(publicId)`
  - `verifyAdminToken(req)` and `setAdminSessionCookie()`

- [ ] **Step 1: Install `cloudinary` npm package**

Run: `npm install cloudinary`
Expected: `added package` output with exit code 0.

- [ ] **Step 2: Create MongoDB connection helper (`src/lib/mongodb.js`)**

```javascript
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return { client, db };
}
```

- [ ] **Step 3: Create Cloudinary helper (`src/lib/cloudinary.js`)**

```javascript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function deleteCloudinaryMedia(publicId) {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary destroy error:', error);
    return null;
  }
}

export default cloudinary;
```

- [ ] **Step 4: Create Admin Auth helper (`src/lib/auth.js`)**

```javascript
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '27112004';
const COOKIE_NAME = 'admin_session';

export function checkAdminAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value === 'authenticated';
}

export function verifyPassword(password) {
  return password === ADMIN_PASSWORD;
}
```

- [ ] **Step 5: Commit task 1**

```bash
git add package.json package-lock.json src/lib/mongodb.js src/lib/cloudinary.js src/lib/auth.js
git commit -m "feat: setup mongodb, cloudinary, and admin auth helpers"
```

---

### Task 2: Implement Admin Login & Cloudinary Media Upload API Routes

**Files:**
- Create: `src/app/api/auth/login/route.js`
- Create: `src/app/api/auth/check/route.js`
- Create: `src/app/api/upload/route.js`

**Interfaces:**
- Consumes: `checkAdminAuth()`, `verifyPassword()`, Cloudinary SDK
- Produces:
  - `POST /api/auth/login` - Authenticates admin and sets HTTP-only cookie
  - `GET /api/auth/check` - Verifies session status
  - `POST /api/upload` - Accepts FormData file, uploads to Cloudinary, returns `{ url, public_id }`

- [ ] **Step 1: Create `src/app/api/auth/login/route.js`**

```javascript
import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    if (verifyPassword(password)) {
      const response = NextResponse.json({ success: true, message: 'Authenticated' });
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }
    return NextResponse.json({ success: false, message: 'Password salah!' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create `src/app/api/auth/check/route.js`**

```javascript
import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const isAuthenticated = checkAdminAuth();
  return NextResponse.json({ authenticated: isAuthenticated });
}
```

- [ ] **Step 3: Create `src/app/api/upload/route.js`**

```javascript
import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'portfolio_uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

- [ ] **Step 4: Commit task 2**

```bash
git add src/app/api/auth/login/route.js src/app/api/auth/check/route.js src/app/api/upload/route.js
git commit -m "feat: add admin auth and cloudinary file upload api routes"
```

---

### Task 3: Create CRUD & Auto-Seeding API Endpoints for All Portfolio Modules

**Files:**
- Create: `src/app/api/experiences/route.js`
- Create: `src/app/api/projects/route.js`
- Create: `src/app/api/skills/route.js`
- Create: `src/app/api/achievements/route.js`

**Interfaces:**
- Consumes: `connectToDatabase()`, `checkAdminAuth()`, `deleteCloudinaryMedia(publicId)`
- Produces:
  - `GET`, `POST`, `PUT`, `DELETE` for `/api/experiences`
  - `GET`, `POST`, `PUT`, `DELETE` for `/api/projects`
  - `GET`, `POST`, `PUT`, `DELETE` for `/api/skills`
  - `GET`, `POST`, `PUT`, `DELETE` for `/api/achievements`

- [ ] **Step 1: Create `src/app/api/experiences/route.js`**

```javascript
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
    description: 'Membangun aplikasi dashboard HR & GA (Human Resources & General Affairs) full-stack terintegrasi untuk PT XYZ...',
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
    
    // Auto-cleanup old image if replaced
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
```

- [ ] **Step 2: Create `src/app/api/projects/route.js`**

*(Including full auto-seeding with client & private projects array, GET, POST, PUT, DELETE with Cloudinary cleanup)*

```javascript
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkAdminAuth } from '@/lib/auth';
import { deleteCloudinaryMedia } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

const initialProjects = [
  {
    category: 'client',
    title: 'AIDA - Advertisement Intelligence & Data Analytics - (PT Utero Kreatif Indonesia)',
    period: 'Januari 2026 - Present',
    description: 'AIDA adalah sistem monitoring dan analitik billboard berbasis AI...',
    image: '/images/projects/aida.png',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Drizzle ORM', 'MySQL', 'Python', 'YOLO', 'OpenCV', 'MQTT'],
    order: 1,
  },
  {
    category: 'client',
    title: 'Enterprise Operations Dashboard - (PT Doa Suryo Agong)',
    period: 'Mar 2026 - Present',
    description: 'Membangun platform dashboard enterprise terintegrasi untuk mendukung operasional lintas divisi...',
    image: '/images/projects/suryo_agong.png',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'API Routes', 'RLS', 'Node.js'],
    order: 2,
  },
  {
    category: 'private',
    title: 'Frugalin.aja',
    period: 'May 2026',
    description: 'Aplikasi pengelolaan keuangan pribadi (personal finance tracker) modern dengan visualisasi interaktif...',
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
    description: 'Aplikasi ini adalah platform Al-Qur’an berbasis web...',
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
    description: 'MatchVibe adalah aplikasi web pencatat skor pertandingan multi-olahraga...',
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
    description: 'MotoTracker adalah aplikasi web untuk manajemen perawatan motor...',
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
    description: 'Aplikasi manajemen produktivitas cerdas...',
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
    description: 'Aplikasi pelacak waktu (time tracker) berbasis web...',
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
    description: 'Sistem informasi berbasis web untuk manajemen dan pencatatan prestasi mahasiswa...',
    image: '/images/projects/talenti.png',
    tags: ['Laravel', 'MySQL'],
    order: 9,
  },
  {
    category: 'private',
    title: 'SIBETA',
    period: 'Dec 2024 - Jan 2025',
    description: 'Sistem Informasi Bebas Tanggungan TA...',
    image: '/images/projects/sibeta.png',
    tags: ['Laravel', 'MySQL'],
    order: 10,
  },
  {
    category: 'private',
    title: 'WeatherAI Classification System',
    period: 'Oct 2025 - Dec 2025',
    description: 'Mengembangkan aplikasi mobile berbasis Flutter...',
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
```

- [ ] **Step 3: Create `src/app/api/skills/route.js`**

```javascript
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
```

- [ ] **Step 4: Create `src/app/api/achievements/route.js`**

```javascript
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
```

- [ ] **Step 5: Commit task 3**

```bash
git add src/app/api/experiences/route.js src/app/api/projects/route.js src/app/api/skills/route.js src/app/api/achievements/route.js
git commit -m "feat: implement mongodb api routes with auto-seeding and cloudinary cleanup"
```

---

### Task 4: Build Admin Dashboard Page (`/editporto-27112004`)

**Files:**
- Create: `src/app/editporto-27112004/page.js`

**Interfaces:**
- Consumes: `/api/auth/login`, `/api/auth/check`, `/api/upload`, `/api/experiences`, `/api/projects`, `/api/skills`, `/api/achievements`
- Produces: Interactive Glassmorphism Admin CMS Dashboard with authentication modal, tab navigation, media file drag-and-drop / upload preview, item creation, editing, and deletion.

- [ ] **Step 1: Create `src/app/editporto-27112004/page.js`**

Implement a comprehensive React Client Component featuring:
- Password Protection Modal
- Tab 1: Experience CRUD (Forms for title, company, type, date, location, logo file input, skills array)
- Tab 2: Projects CRUD (Forms for category client/private, title, period, description, image file input, tags, link, tryMe)
- Tab 3: Skills CRUD (Hard skills level slider 1-100, soft skill tags)
- Tab 4: Achievements CRUD (Forms for title, description, date, image file input)
- Auto Cloudinary upload indicator during file input

- [ ] **Step 2: Verify page build**

Run: `npm run build`
Expected: Build passes without syntax or import errors.

- [ ] **Step 3: Commit task 4**

```bash
git add src/app/editporto-27112004/page.js
git commit -m "feat: build full admin cms dashboard page with auth barrier"
```

---

### Task 5: Connect Public Components to Fetch Dynamic Data from API Routes

**Files:**
- Modify: `src/components/Experience.jsx`
- Modify: `src/components/Projects.jsx`
- Modify: `src/components/Skills.jsx`
- Modify: `src/components/Achievements.jsx`

**Interfaces:**
- Consumes: `/api/experiences`, `/api/projects`, `/api/skills`, `/api/achievements`
- Produces: Dynamic UI components with loading spinners / skeleton states and full fallback to initial datasets.

- [ ] **Step 1: Update `src/components/Experience.jsx` to fetch from `/api/experiences`**
- [ ] **Step 2: Update `src/components/Projects.jsx` to fetch from `/api/projects`**
- [ ] **Step 3: Update `src/components/Skills.jsx` to fetch from `/api/skills`**
- [ ] **Step 4: Update `src/components/Achievements.jsx` to fetch from `/api/achievements`**
- [ ] **Step 5: Verify build & dev server**

Run: `npm run build`
Expected: Clean build success.

- [ ] **Step 6: Commit task 5**

```bash
git add src/components/Experience.jsx src/components/Projects.jsx src/components/Skills.jsx src/components/Achievements.jsx
git commit -m "feat: integrate public portfolio components with dynamic mongodb api endpoints"
```

---

### Task 6: End-to-End Verification & Verification Report

- [ ] **Step 1: Test MongoDB Atlas connectivity & Auto-seeding**
- [ ] **Step 2: Test Admin Login at `/editporto-27112004`**
- [ ] **Step 3: Test Cloudinary Upload, Replace & Delete Cleanup**
- [ ] **Step 4: Create walkthrough artifact**
