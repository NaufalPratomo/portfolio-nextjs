# Walkthrough: Sistem CRUD Portofolio Dinamis (MongoDB Atlas + Cloudinary)

Sistem CRUD portofolio dinamis telah berhasil diimplementasikan! Sekarang Anda dapat mengelola seluruh data Pengalaman, Proyek, Skill, dan Prestasi secara *real-time* tanpa perlu mengubah kode sumber React.

---

## 🎯 Apa yang Telah Dibuat

### 1. Database & Cloud Media Integration
- **MongoDB Atlas Helper** ([`src/lib/mongodb.js`](file:///c:/laragon/www/private/portfolio-nextjs/src/lib/mongodb.js)): Connection pooling reusable untuk Next.js App Router.
- **Cloudinary SDK Helper** ([`src/lib/cloudinary.js`](file:///c:/laragon/www/private/portfolio-nextjs/src/lib/cloudinary.js)): Fitur unggah otomatis & *auto-destroy* saat item dihapus atau diganti (*replace*).
- **Admin Auth Helper** ([`src/lib/auth.js`](file:///c:/laragon/www/private/portfolio-nextjs/src/lib/auth.js)): Pengaman rute admin dengan kata sandi & cookie session `HTTP-only`.

### 2. Restful API Endpoints (dengan Auto-Seeding)
- [`/api/experiences`](file:///c:/laragon/www/private/portfolio-nextjs/src/app/api/experiences/route.js): GET, POST, PUT, DELETE
- [`/api/projects`](file:///c:/laragon/www/private/portfolio-nextjs/src/app/api/projects/route.js): GET, POST, PUT, DELETE
- [`/api/skills`](file:///c:/laragon/www/private/portfolio-nextjs/src/app/api/skills/route.js): GET, POST, PUT, DELETE
- [`/api/achievements`](file:///c:/laragon/www/private/portfolio-nextjs/src/app/api/achievements/route.js): GET, POST, PUT, DELETE
- [`/api/upload`](file:///c:/laragon/www/private/portfolio-nextjs/src/app/api/upload/route.js): API upload gambar ke Cloudinary CDN
- [`/api/auth/login`](file:///c:/laragon/www/private/portfolio-nextjs/src/app/api/auth/login/route.js) & `/check`: Layanan autentikasi admin

> **Fitur Auto-Seeding**: Saat API diakses pertama kali dan database masih kosong, data awal portofolio yang ada di kode statis secara otomatis dimigrasikan ke database MongoDB Atlas Anda!

### 3. CMS Dashboard Admin Modern
- **Rute Rahasia**: `/editporto-27112004` ([`src/app/editporto-27112004/page.js`](file:///c:/laragon/www/private/portfolio-nextjs/src/app/editporto-27112004/page.js))
- **Layar Login PIN / Password Admin**
- **Tab 💼 Experience**: Tambah, ubah, hapus pengalaman + upload logo Cloudinary.
- **Tab 🚀 Projects**: Kelola Proyek Client & Private + upload foto proyek Cloudinary.
- **Tab ⚡ Skills**: Atur Hard Skills (dengan slider level %) & Soft Skills.
- **Tab 🏆 Achievements**: Tambah & ubah lomba/sertifikat + upload gambar Cloudinary.

### 4. Integrasi Komponen Publik Dinamis
Semua komponen berikut kini mengambil data secara dinamis dari database MongoDB dengan *fallback* halus:
- [`Experience.jsx`](file:///c:/laragon/www/private/portfolio-nextjs/src/components/Experience.jsx)
- [`Projects.jsx`](file:///c:/laragon/www/private/portfolio-nextjs/src/components/Projects.jsx)
- [`Skills.jsx`](file:///c:/laragon/www/private/portfolio-nextjs/src/components/Skills.jsx)
- [`Achievements.jsx`](file:///c:/laragon/www/private/portfolio-nextjs/src/components/Achievements.jsx)

---

## 🛠️ Cara Menggunakan Dashboard Admin

1. Buka browser dan akses halaman admin di:
   `http://localhost:3000/editporto-27112004`
2. Masukkan kata sandi admin (Default: `27112004`, atau sesuai nilai `ADMIN_PASSWORD` di file `.env.local`).
3. Pilih Tab yang ingin Anda ubah:
   - **Unggah Gambar**: Pilih file gambar dari komputer Anda saat menambah/edit item. Gambar otomatis diunggah ke Cloudinary dan URL-nya disimpan ke MongoDB.
   - **Hapus Item**: Saat item dihapus, file gambar terkait di Cloudinary juga akan otomatis terhapus (*auto-cleanup*).
