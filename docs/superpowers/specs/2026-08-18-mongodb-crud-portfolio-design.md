# Spesifikasi Desain: Sistem CRUD Portofolio Dinamis Berbasis MongoDB Atlas & Cloudinary

**Tanggal:** 18 Agustus 2026  
**Status:** Draf untuk Review Pengguna  

---

## 1. Ringkasan Proyek
Mengubah data portofolio statis (Experience, Projects, Skills, & Achievements) di Next.js 14 App Router menjadi dinamis dengan database **MongoDB Atlas**, media hosting **Cloudinary** untuk penyimpanan gambar/logo, serta menyediakan **Dashboard Admin khusus** di rute rahasia `/editporto-27112004`.

---

## 2. Arsitektur & Alur Data

```
+---------------------------------------------------------------------------------------+
|                                  Next.js App Router                                   |
|                                                                                       |
|   +-----------------------+                        +------------------------------+   |
|   |   Halaman Publik      |                        |        Halaman Admin         |   |
|   |  (Home, Experience,   |                        |    (/editporto-27112004)    |   |
|   |  Projects, Skills)    |                        |    *Protected Admin PIN      |   |
|   +-----------+-----------+                        +--------------+---------------+   |
|               |                                                   |                   |
|               | fetch()                                           | Upload & CRUD     |
|               v                                                   v                   |
|   +-------------------------------------------------------------------------------+   |
|   |                         API Routes (src/app/api/...)                          |   |
|   |   - /api/experiences                                                          |   |
|   |   - /api/projects                                                             |   |
|   |   - /api/skills                                                               |   |
|   |   - /api/achievements                                                         |   |
|   |   - /api/upload / /api/delete-media -------------------------+                |   |
|   |   - /api/auth/login                                          |                |   |
|   +------------------------------------+-------------------------|----------------+   |
|                                        |                         |                    |
+----------------------------------------|-------------------------|--------------------+
                                         | mongodb driver          | Upload & Destroy API
                                         v                         v
                         +-------------------------------+  +--------------------------+
                         | MongoDB Atlas Cloud Database  |  | Cloudinary Media Cloud   |
                         | (Menyimpan URL Gambar & Data) |  | (Menyimpan File Gambar)  |
                         +-------------------------------+  +--------------------------+
```

---

## 3. Integrasi Cloudinary & Fitur Auto-Cleanup (Delete & Replace)

1. **Konfigurasi Environment Variables (`.env.local`)**:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. **Unggah Media (Upload)**:
   - File gambar diunggah ke Cloudinary (diberikan tag/folder khusus `portfolio_uploads`).
   - Menyimpan `url` dan `public_id` gambar ke database.
3. **Pembersihan Otomatis Saat Hapus Item (Delete Cleanup)**:
   - Ketika item Proyek, Pengalaman, atau Lomba dihapus dari MongoDB, API backend secara otomatis memanggil `cloudinary.uploader.destroy(public_id)` untuk menghapus file gambar dari cloud Cloudinary agar tidak menumpuk file sampah.
4. **Penggantian Gambar Otomatis Saat Edit (Replace Cleanup)**:
   - Ketika pengguna mengunggah gambar baru untuk menggantikan gambar lama saat memproses `PUT` (edit item), sistem otomatis menghapus gambar lama di Cloudinary terlebih dahulu sebelum memperbarui URL ke gambar baru.

---

## 4. Struktur Koleksi Database MongoDB

### A. Collection `experiences`
* `_id`: ObjectId
* `title`: String (mis: "Back End Developer")
* `company`: String (mis: "PT Indolakto")
* `type`: String ("Internship", "Freelance", "Full-time", "Self-employed")
* `date`: String (mis: "Jul 2026 - Present")
* `duration`: String (mis: "2 mos")
* `location`: String (mis: "Pasuruan, East Java, Indonesia")
* `locationType`: String ("On-site", "Remote", "Hybrid")
* `logo`: String (URL gambar Cloudinary atau path lokal)
* `cloudinaryPublicId`: String (ID unik file di Cloudinary untuk pembersihan otomatis)
* `initials`: String (optional fallback logo)
* `description`: String (optional)
* `skills`: Array of String
* `order`: Number (untuk urutan tampil)

### B. Collection `projects`
* `_id`: ObjectId
* `category`: String ("client" | "private")
* `title`: String
* `period`: String (mis: "Januari 2026 - Present")
* `description`: String
* `image`: String (URL gambar Cloudinary)
* `cloudinaryPublicId`: String (ID unik file di Cloudinary)
* `tags`: Array of String
* `link`: String (optional)
* `tryMe`: Boolean (optional)
* `order`: Number

### C. Collection `skills`
* `_id`: ObjectId
* `type`: String ("hard" | "soft")
* `name`: String
* `level`: Number (1-100, khusus hard skills)
* `order`: Number

### D. Collection `achievements`
* `_id`: ObjectId
* `title`: String
* `description`: String
* `image`: String (URL gambar Cloudinary)
* `cloudinaryPublicId`: String (ID unik file di Cloudinary)
* `date`: String
* `order`: Number

---

## 5. Keamanan & Otentikasi Admin

1. **Rute Khusus**: `/editporto-27112004`
2. **Kunci Akses/PIN Admin**: Disimpan di `.env.local` sebagai `ADMIN_PASSWORD` (mis: `27112004`).
3. **Session Cookie**: Saat login di layar admin, cookie terenkripsi HTTP-only akan dipasang untuk mengizinkan request `POST`, `PUT`, `DELETE`, dan API upload/destroy.

---

## 6. Fitur Auto-Seeding (Migrasi Data Otomatis)

Agar data yang saat ini sudah ada di website tidak hilang:
* Saat API dipanggil pertama kali dan koleksi di MongoDB masih kosong, API secara otomatis mengisi (*seed*) data dari array data awal ke MongoDB Atlas.

---

## 7. Rencana Komponen & UI Admin

Halaman Dashboard `/editporto-27112004` akan dirancang dengan tampilan modern, glassmorphism, dan tab intuitif:
- **Tab 💼 Experience**: Tambah, edit, hapus pengalaman kerja/magang + fitur upload/replace/delete logo Cloudinary.
- **Tab 🚀 Projects**: Manajemen proyek client & private + fitur upload/replace/delete gambar proyek Cloudinary.
- **Tab ⚡ Skills**: Kelola Hard Skill (dengan slide bar level %) & Soft Skill.
- **Tab 🏆 Achievements**: Kelola lomba & sertifikasi + upload/replace/delete gambar lomba Cloudinary.

---

## 8. Rencana Pengujian (Verification Plan)
1. **Koneksi MongoDB Atlas & Cloudinary**: Memastikan koneksi database dan API upload/destroy media berfungsi.
2. **Auto-Seeding**: Memastikan data awal dari file statis berhasil diimpor ke MongoDB.
3. **Pemeriksaan Keamanan**: Menguji rute `/editporto-27112004` terkunci tanpa PIN/password yang benar.
4. **Uji Coba Upload, Replace, & Delete Media**:
   - Upload file gambar baru ke Cloudinary via Admin UI.
   - Replace (Edit item dan ganti gambar): Verifikasi gambar lama di Cloudinary terhapus secara otomatis dan digantikan gambar baru.
   - Delete (Hapus item): Verifikasi file gambar di Cloudinary terhapus permanen dari cloud storage.
5. **Verifikasi Tampilan Publik**: Memastikan komponen `Experience`, `Projects`, `Skills`, dan `Achievements` merender data dinamis dari MongoDB dengan animasi Framer Motion yang tetap lancar.
