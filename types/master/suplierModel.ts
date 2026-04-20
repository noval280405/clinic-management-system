export interface supplierM {
  id?: string;

  // IDENTITAS
  kode_supplier: string;
  nama_supplier: string;

  // KONTAK
  nama_kontak?: string;
  no_hp?: string;
  email?: string;

  // ALAMAT
  alamat?: string;
  kota?: string;

  // ADMINISTRASI
  npwp?: string;

  // STATUS
  status: "aktif" | "nonaktif";

  // CATATAN
  catatan?: string;

  // AUDIT
  created_at: number;
  created_by: string;
  updated_at?: number;
  updated_by?: string;
}