export interface obatM {
  id?: string;
  kode_obat?: string;
  nama_obat: string;
  kategori_obat: string;
  satuan: string;
  bentuk_obat?: string; // sirup, tablet, salep, dll
  stok: number;
  stok_minimum: number;
  harga_beli: number;
  harga_jual: number;
  id_supplier?: string;
  nama_supplier?: string;
  tanggal_kadaluarsa?: string;
  status: string;
  deskripsi?: string;
  created_at: number;
  created_by: string;
  updated_at?: number;
  updated_by?: string;
}