export interface mutasiStokObatM {
  id_mutasi?: string;
  id_obat: string;
  nama_obat: string;

  tipe: "masuk" | "keluar";

  jumlah: number;
  stok_sebelum: number;
  stok_sesudah: number;

  referensi?: string; // id_resep / pembelian
  keterangan?: string;

  created_at?: number;
}