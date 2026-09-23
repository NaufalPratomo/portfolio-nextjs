# Hak Cipta & HKI Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan modul dan halaman khusus Hak Kekayaan Intelektual (HKI / Hak Cipta) lengkap dengan kartu sorotan di beranda, halaman galeri dedicated `/copyright`, API CRUD MongoDB Atlas, serta integrasi dashboard admin `/editporto-27112004`.

**Architecture:** 
- Next.js 14 App Router dengan Tailwind CSS, Framer Motion, dan custom Lightbox modal.
- MongoDB Atlas (`copyrights` collection) dengan auto-seeding dari data Surat Pencatatan Ciptaan AIDA V2 Kemenkumham RI.
- Cloudinary media storage untuk upload file sertifikat baru via dashboard admin `/editporto-27112004`.
- Smart hash navigation di `Navbar.jsx` untuk navigasi mulus antara halaman `/` dan `/copyright`.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, Framer Motion, MongoDB, Cloudinary.

## Global Constraints
- Bahasa: Kode dalam JavaScript/JSX (Next.js App Router).
- Konsistensi Styling: Mendukung Dark Mode & Light Mode menggunakan Tailwind CSS dan tema portfolio yang sudah ada.
- Keamanan: Endpoint mutasi (POST, PUT, DELETE) dilindungi `checkAdminAuth()`.
- Media Cleanup: Hapus gambar di Cloudinary via `deleteCloudinaryMedia()` saat data dihapus atau gambar diganti.

---

### Task 1: Setup Asset Fallbacks & Seed Assets

**Files:**
- Create: `public/images/copyright/aida-v2-cert.png`
- Create: `public/images/copyright/aida-v2-creators.png`

- [ ] **Step 1: Copy uploaded certificate images to public folder**
  Salin file `media_1790148037439.png` ke `public/images/copyright/aida-v2-cert.png` dan `media_1790148042962.png` ke `public/images/copyright/aida-v2-creators.png`.

- [ ] **Step 2: Verifikasi file exists**
  Pastikan kedua file gambar ada di direktori `public/images/copyright/`.

- [ ] **Step 3: Commit**
  ```bash
  git add public/images/copyright/
  git commit -m "feat(assets): add initial AIDA V2 copyright certificate assets"
  ```

---

### Task 2: Backend API Route (`src/app/api/copyrights/route.js`)

**Files:**
- Create: `src/app/api/copyrights/route.js`

**Interfaces:**
- Produces:
  - `GET /api/copyrights` -> `{ success: true, data: Array<Copyright> }`
  - `POST /api/copyrights` -> `{ success: true, data: Copyright }`
  - `PUT /api/copyrights` -> `{ success: true, data: Copyright }`
  - `DELETE /api/copyrights?id=...` -> `{ success: true }`

- [ ] **Step 1: Buat file API route `/api/copyrights/route.js`**
  Implementasikan GET dengan auto-seed data AIDA V2 jika koleksi kosong.
  Implementasikan POST, PUT, DELETE dengan validasi admin token dan penghapusan Cloudinary otomatis.

- [ ] **Step 2: Verifikasi API endpoint secara lokal**
  Jalankan curl/fetch untuk memverifikasi `GET /api/copyrights` mengembalikan status 200 dengan data seed.

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/api/copyrights/route.js
  git commit -m "feat(api): add CRUD endpoint for copyrights collection"
  ```

---

### Task 3: Homepage Component (`CopyrightSection.jsx`) & Page Integration

**Files:**
- Create: `src/components/CopyrightSection.jsx`
- Modify: `src/app/page.js`

- [ ] **Step 1: Buat komponen `src/components/CopyrightSection.jsx`**
  - Fetch data dari `/api/copyrights` dengan fallback initial data.
  - Tampilkan kartu sorotan sertifikat dengan badge, judul, nomor pencatatan, pemegang hak cipta, dan highlight nama Muhammad Naufal Pratomo.
  - Implementasikan Lightbox Modal dengan tab switch Halaman 1 (Sertifikat) dan Halaman 2 (Lampiran).
  - Tambahkan tombol CTA: "Lihat Semua Hak Cipta & Dokumen →" menuju `/copyright`.

- [ ] **Step 2: Integrasikan ke `src/app/page.js`**
  - Pasang `<CopyrightSection />` di dalam `<OverlapSection>` setelah `<Achievements />` dengan urutan zIndex yang sesuai.

- [ ] **Step 3: Commit**
  ```bash
  git add src/components/CopyrightSection.jsx src/app/page.js
  git commit -m "feat(ui): add CopyrightSection component to homepage"
  ```

---

### Task 4: Dedicated Full Page (`src/app/copyright/page.js`)

**Files:**
- Create: `src/app/copyright/page.js`

- [ ] **Step 1: Buat halaman `src/app/copyright/page.js`**
  - Export metadata SEO lengkap.
  - Layout rapi dengan breadcrumb / tombol "← Kembali ke Beranda".
  - Grid sertifikat lengkap dengan filter kategori ciptaan.
  - Modal Lightbox resolusi tinggi dengan switch halaman sertifikat/lampiran.
  - Desain responsif dan harmonis dengan tema dark/light mode.

- [ ] **Step 2: Commit**
  ```bash
  git add src/app/copyright/page.js
  git commit -m "feat(page): create dedicated copyright showcase page"
  ```

---

### Task 5: Navbar Integration & Smart Hash Routing

**Files:**
- Modify: `src/components/Navbar.jsx`

- [ ] **Step 1: Update navigasi di `Navbar.jsx`**
  - Tambahkan link `{ href: '#copyright', label: 'hak cipta' }` ke dalam `navLinks`.
  - Tambahkan pengecekan path: jika sedang berada di `/copyright`, link `#home`, `#about`, dll. akan diarahkan ke `/#home`, `/#about`, dll.

- [ ] **Step 2: Commit**
  ```bash
  git add src/components/Navbar.jsx
  git commit -m "feat(navbar): add copyright navigation link and route fallback"
  ```

---

### Task 6: Admin Dashboard Integration (`/editporto-27112004`)

**Files:**
- Modify: `src/app/editporto-27112004/page.js`

- [ ] **Step 1: Tambahkan Tab "Hak Cipta" pada Dashboard Admin**
  - Tambahkan state `copyrights` dan `copyrightForm`.
  - Tambahkan tombol tab "Hak Cipta" di navigation tab panel.
  - Implementasikan modal tambah/edit hak cipta lengkap dengan upload sertifikat utama & lampiran ke Cloudinary.
  - Tambahkan tombol aksi Edit dan Delete dengan konfirmasi.

- [ ] **Step 2: Commit**
  ```bash
  git add src/app/editporto-27112004/page.js
  git commit -m "feat(admin): add copyright management tab to admin dashboard"
  ```

---

### Task 7: Build Verification & Final Polish

**Files:**
- Test: Run Next.js build (`npm run build`)
- Visual Verification: Check responsiveness, dark mode, modal interactions.

- [ ] **Step 1: Jalankan `npm run build`**
  Pastikan build berhasil tanpa error sintaks, TypeScript/JS, atau Tailwind error.

- [ ] **Step 2: Commit akhir & dokumentasi**
  ```bash
  git add .
  git commit -m "chore: verify build and finalize copyright showcase feature"
  ```
