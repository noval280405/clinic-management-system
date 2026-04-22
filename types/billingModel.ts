export interface billingM {
  id_billing: string;
  id_resep: string;
  id_pasien: string;
  id_dokter: string;
  id_poli: string;

  nama_pasien: string;
  nama_dokter: string;
  nama_poli: string;

  items: {
    nama_obat: string;
    jumlah: number;
    harga: number;
    subtotal: number;
  }[];

  total: number;

  status: string;

  metode_pembayaran?: "cash" | "debit" | "bpjs";
  dibayar?: number;
  kembalian?: number;

  created_at: number;
  created_by: string;

  updated_at?: number;
  updated_by?: string;
}