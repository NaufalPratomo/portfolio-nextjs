# Spesifikasi Desain: Modul Hak Kekayaan Intelektual (HKI / Hak Cipta) & Halaman Dedicated

**Tanggal:** 23 September 2026  
**Status:** Disetujui Pengguna (Siap Implementasi)  
**Dokumen Terkait:** Surat Pencatatan Ciptaan Kemenkumham / Ditjen KI No. 001417127 (AIDA V2)

---

## 1. Ringkasan Proyek
Menambahkan modul dan halaman khusus Hak Kekayaan Intelektual (HKI / Hak Cipta) ke dalam portofolio Next.js Muhammad Naufal Pratomo. Fitur ini dirancang dengan pendekatan **kombinasi**:
1. **Section Beranda (`#copyright`)**: Menampilkan kartu sorotan sertifikat HKI secara elegan di antara alur one-page scroll portofolio, lengkap dengan Lightbox Zoom modal dan tombol navigasi menuju halaman detail.
2. **Halaman Khusus (`/copyright`)**: Halaman galeri lengkap untuk menampilkan seluruh sertifikat hak cipta, informasi rinci (Judul, Jenis Ciptaan, Nomor Pencatatan, Pemegang Hak Cipta, dan Lampiran Daftar Pencipta), filter kategori, serta tombol kembali ke beranda.
3. **Admin Dashboard (`/editporto-27112004`)**: Pengelolaan data hak cipta secara dinamis berbasis **MongoDB Atlas** dan upload sertifikat ke **Cloudinary** (CRUD lengkap: Create, Read, Update, Delete dengan fitur auto-cleanup media).

---

## 2. Arsitektur Data & Model Skema

### Koleksi MongoDB: `copyrights`
```json
{
  "_id": "ObjectId(...)",
  "title": "AIDA V2: Sistem Reklame Cerdas Terintegrasi",
  "type": "Program Komputer",
  "registrationNumber": "001417127",
  "applicationNumber": "EC002026143438",
  "date": "14 Agustus 2026",
  "holder": "Politeknik Negeri Malang",
  "creators": [
    "Muhammad Afif Hendrawan",
    "Pramana Yoga Saputra",
    "Triana Fatmawati",
    "Sofyan Noor Arief",
    "Armand Maulana Andika Putra",
    "Innama Maesa Putri",
    "Muhammad Naufal Pratomo",
    "Aril Ibbet Ardana Putra"
  ],
  "description": "Sistem Reklame Cerdas Terintegrasi yang dilindungi oleh Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta dengan jangka waktu pelindungan 50 tahun.",
  "certificateImage": "/images/copyright/aida-v2-cert.png",
  "attachmentImage": "/images/copyright/aida-v2-creators.png",
  "cloudinaryPublicId": "",
  "attachmentCloudinaryPublicId": "",
  "featured": true,
  "order": 1,
  "createdAt": "2026-09-23T00:00:00.000Z"
}
```

### Initial Seed Data (Fallback Data):
Data default berbasis Surat Pencatatan Ciptaan nyata dari Kemenkumham RI:
- **Judul:** AIDA V2: Sistem Reklame Cerdas Terintegrasi
- **Jenis:** Program Komputer
- **Nomor:** 001417127 (Permohonan: EC002026143438)
- **Pemegang:** Politeknik Negeri Malang
- **Pencipta:** Muhammad Afif Hendrawan, Pramana Yoga Saputra dkk (termasuk Muhammad Naufal Pratomo sebagai Pencipta ke-7)
- **Asset Gambar:** Disimpan di `public/images/copyright/` sebagai fallback lokal sebelum diunggah ke Cloudinary.

---

## 3. Rute API (`/api/copyrights`)

- **`GET /api/copyrights`**:
  - Publik, mengambil seluruh data hak cipta dari koleksi `copyrights`, diurutkan berdasarkan `order` ascending.
  - Jika koleksi kosong, secara otomatis mengisi seed data awal (AIDA V2).
- **`POST /api/copyrights`**:
  - Terproteksi autentikasi admin (`checkAdminAuth()`).
  - Menyimpan data hak cipta baru ke MongoDB.
- **`PUT /api/copyrights`**:
  - Terproteksi autentikasi admin (`checkAdminAuth()`).
  - Memperbarui data hak cipta. Jika gambar sertifikat diganti, sistem menghapus file Cloudinary lama via `deleteCloudinaryMedia()`.
- **`DELETE /api/copyrights`**:
  - Terproteksi autentikasi admin (`checkAdminAuth()`).
  - Menghapus dokumen hak cipta dari MongoDB dan menghapus aset gambar Cloudinary terkait.

---

## 4. Tampilan Antarmuka (UI/UX) & Komponen

### A. Komponen Beranda: `src/components/CopyrightSection.jsx`
- Ditempatkan di `src/app/page.js` di dalam `<OverlapSection>` setelah section *Achievements* (Lomba) dan sebelum *Projects*.
- Menggunakan Framer Motion untuk transisi entrance bertahap (*staggered fade-up*).
- Menampilkan kartu sertifikat dengan:
  - Badge *Jenis Ciptaan* (contoh: "Program Komputer").
  - Nomor Pencatatan resmi (*No. 001417127*).
  - Judul ciptaan tebal dan deskripsi ringkas.
  - Institusi Pemegang Hak Cipta (*Politeknik Negeri Malang*).
  - Highlight khusus untuk nama **Muhammad Naufal Pratomo** di antara daftar pencipta.
  - Thumbnail sertifikat yang dapat diklik untuk membuka **Modal Lightbox Resolusi Tinggi**.
  - Tombol CTA: **"Lihat Semua Hak Cipta & Dokumen →"** menuju `/copyright`.

### B. Halaman Khusus: `src/app/copyright/page.js`
- Halaman dedicated dengan layout responsif:
  - Header modern dengan badge Kementerian Hukum & HAM / DJKI.
  - Tombol navigasi **"← Kembali ke Beranda"**.
  - Filter kategori jenis ciptaan jika terdapat lebih dari satu kategori.
  - Galeri kartu hak cipta dengan informasi lengkap.
  - **Multi-Page Modal Lightbox**: Memungkinkan pengunjung beralih (*tab switch*) antara **Halaman 1: Surat Pencatatan** dan **Halaman 2: Lampiran Pencipta** untuk melihat bukti otentik dengan fitur zoom.
- Optimasi SEO Metadata (`title: "Hak Cipta & HKI | Muhammad Naufal Pratomo"`).

### C. Pembaruan Navigasi: `src/components/Navbar.jsx`
- Menambahkan tautan `#copyright` dengan label `"hak cipta"` di desktop & mobile menu.
- Menyesuaikan penanganan klik: Jika pengguna sedang berada di halaman `/copyright`, tautan navigasi hash (`#about`, `#projects`, dll.) akan mengarahkan browser kembali ke `/#about`, `/#projects`.

---

## 5. Integrasi Dashboard Admin (`src/app/editporto-27112004/page.js`)

1. **Tab Baru "Hak Cipta"**:
   - Berdampingan dengan tab *Experience*, *Projects*, *Skills*, *Achievements*.
2. **Formulir Input / Edit**:
   - `Judul Ciptaan` (text)
   - `Jenis Ciptaan` (text/dropdown: Program Komputer, Karya Tulis, Desain Industri, dll.)
   - `Nomor Pencatatan` (text)
   - `Nomor Permohonan` (text)
   - `Tanggal` (text)
   - `Pemegang Hak Cipta` (text)
   - `Daftar Pencipta` (textarea / comma-separated text)
   - `Deskripsi` (textarea)
   - `Unggah Sertifikat Utama` (file input -> Cloudinary upload)
   - `Unggah Lampiran Pencipta` (file input -> Cloudinary upload, opsional)
   - `Tampilkan di Beranda (Featured)` (checkbox)
   - `Urutan (Order)` (number)
3. **Daftar & Aksi**:
   - Tabel/list kartu hak cipta dengan preview thumbnail sertifikat.
   - Tombol **Edit** (memuat data ke form modal) dan **Hapus** (konfirmasi dan delete media di Cloudinary).

---

## 6. Rencana Verifikasi & Uji Kualitas
1. **Verifikasi Tampilan Beranda**:
   - Memastikan section `#copyright` muncul di halaman utama dengan animasi halus.
   - Memastikan Lightbox Modal dapat membuka sertifikat AIDA V2 dengan jelas.
   - Memastikan link menuju `/copyright` berfungsi dengan baik.
2. **Verifikasi Halaman `/copyright`**:
   - Memastikan halaman `/copyright` me-render semua data sertifikat dengan rapi.
   - Menguji toggle switch antara Surat Pencatatan dan Lampiran Pencipta.
   - Menguji tombol navigasi kembali ke Beranda (`/`).
3. **Verifikasi Dashboard Admin**:
   - Menguji login admin di `/editporto-27112004`.
   - Menguji penambahan data baru, pengeditan, upload gambar, dan penghapusan item.
4. **Verifikasi Build**:
   - Menjalankan `npm run build` untuk memastikan tidak ada error kompilasi Next.js.
