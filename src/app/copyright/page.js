import CopyrightClient from './CopyrightClient';

export const metadata = {
  title: 'Hak Kekayaan Intelektual & Hak Cipta | Muhammad Naufal Pratomo',
  description: 'Dokumentasi resmi Surat Pencatatan Ciptaan Kementerian Hukum dan HAM Republik Indonesia / Ditjen Kekayaan Intelektual oleh Muhammad Naufal Pratomo.',
  openGraph: {
    title: 'Hak Kekayaan Intelektual & Hak Cipta | Muhammad Naufal Pratomo',
    description: 'Surat Pencatatan Ciptaan resmi Kementerian Hukum dan HAM Republik Indonesia atas karya Program Komputer.',
    images: ['/images/copyright/aida-v2-cert.png'],
  },
};

export default function CopyrightPage() {
  return <CopyrightClient />;
}
