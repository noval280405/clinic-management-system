export interface layananM {
  id?: string;

  // IDENTITAS LAYANAN
  kode_layanan: string;
  nama_layanan: string;
  kategori_layanan: string;

  // DETAIL
  jenis_layanan: "tindakan" | "konsultasi" | "lab" | "radiologi" | "lainnya";
  deskripsi?: string;

  // HARGA
  harga: number;

  // DURASI (opsional)
  durasi_menit?: number;

  // STATUS
  status: "aktif" | "nonaktif";

  // OPSIONAL (UNTUK SISTEM LANJUT)
  perlu_dokter?: boolean;
  perlu_ruangan?: boolean;

  // AUDIT
  created_at: number;
  created_by: string;
  updated_at?: number;
  updated_by?: string;
}