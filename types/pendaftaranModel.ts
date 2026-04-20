import type { layananM } from "./master/layananModel";
import type { obatM } from "./master/obatModel";

export interface pendaftaranM {
  id?: string;

  // RELASI
  id_pasien: string;
  id_dokter: string;
  id_poli: string;

  // DENORMALIZE
  nama_pasien: string;
  nama_dokter: string;
  nama_poli: string;

  // ANTRIAN
  nomor_antrian: number;
  tanggal_kunjungan: string;

  // STATUS
  status: "menunggu" | "diproses" | "selesai" | "batal";

  //ADMINISTRASI (INI YANG KAMU PAKAI DI FORM)
  jenis_pasien?: "umum" | "bpjs" | "asuransi";
  no_bpjs?: string;

  //KELUHAN
  keluhan?: string;

  // MEDIS
  diagnosa?: string;
  catatan?: string;

  // TRANSAKSI
  layanan?: layananM[];
  obat?: obatM[];

  total_layanan?: number;
  total_obat?: number;
  grand_total?: number;

  // PEMBAYARAN
  metode_pembayaran?: "cash" | "transfer" | "qris" | "bpjs";
  status_pembayaran?: "belum" | "lunas";

  // AUDIT
  created_at: number;
  created_by: string;
  updated_at?: number;
  updated_by?: string;
}