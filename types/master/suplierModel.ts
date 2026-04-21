export interface supplierM {
  id?: string;
  kode_supplier?: string;
  nama_supplier: string;
  nama_kontak?: string;
  no_hp?: string;
  email?: string;
  alamat?: string;
  kota?: string;
  npwp?: string;
  status: "aktif" | "nonaktif";
  catatan?: string;
  created_at: number;
  created_by: string;
  updated_at?: number;
  updated_by?: string;
}