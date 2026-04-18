export interface obatM {
  id?: string;

  // IDENTITAS OBAT
  kode_obat: string;
  nama_obat: string;
  kategori_obat: string;

  // DETAIL OBAT
  satuan: "tablet" | "kapsul" | "botol" | "tube" | "strip" | "ampul" | "lainnya";
  bentuk_obat?: string; // sirup, tablet, salep, dll

  // STOK
  stok: number;
  stok_minimum: number;

  // HARGA
  harga_beli: number;
  harga_jual: number;

  // SUPPLIER
  supplier?: string;

  // EXP DATE (PENTING UNTUK FARMASI)
  tanggal_kadaluarsa?: string;

  // STATUS
  status: "aktif" | "nonaktif";

  // DESKRIPSI
  deskripsi?: string;

  // AUDIT
  created_at: number;
  created_by: string;
  updated_at?: number;
  updated_by?: string;
}