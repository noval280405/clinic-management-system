import type { layananM } from "./master/layananModel";
import type { obatM } from "./master/obatModel";

export interface pendaftaranM {
  id?: string;
  id_pendaftaran?: string;
  id_pasien: string;
  id_dokter: string;
  id_poli: string;
  nama_pasien: string;
  nama_dokter: string;
  nama_poli: string;
  no_antrian?: number;
  tanggal_kunjungan: string;
  status: string;
  jenis_pasien?: "umum" | "bpjs" | "asuransi";
  no_bpjs?: string;
  keluhan?: string;
  diagnosa?: string;
  catatan?: string;
  layanan?: layananM[];
  obat?: obatM[];
  total_layanan?: number;
  total_obat?: number;
  grand_total?: number;
  metode_pembayaran?: "cash" | "transfer" | "qris" | "bpjs";
  status_pembayaran?: "belum" | "lunas";
  created_at: number;
  created_by: string;
  updated_at?: number;
  updated_by?: string;
  disetujui_at?: number;
  disetujui_by?: string;
  dibatalkan_at?: number;
  dibatalkan_by?: string;
}