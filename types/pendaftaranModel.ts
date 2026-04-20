import type { layananM } from "./master/layananModel";
import type { obatM } from "./master/obatModel";

export interface pendaftaranM {
    id?: string;
    // RELASI
    id_pasien: string;
    id_dokter: string;
    id_poli: string;
    // INFO ANTRIAN
    nomor_antrian: number;
    tanggal_kunjungan: string; // timestamp
    nama_pasien: string;
    nama_poli: string;
    nama_dokter: string;
    // STATUS FLOW
    status: "menunggu" | "diproses" | "selesai" | "batal";
    // MEDIS (diisi nanti)
    diagnosa?: string;
    catatan?: string;
    // LAYANAN
    layanan?: layananM[];
    // OBAT
    obat?: obatM[];
    // TOTAL
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