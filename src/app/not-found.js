import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-slate-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-slate-400 mb-8">Halaman tidak ditemukan.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-full font-medium transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
