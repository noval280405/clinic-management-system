import type { layananM } from "./master/layananModel";
import type { obatM } from "./master/obatModel";

export interface pemeriksaanM {
    id?: string;
    no_pemeriksaan?: string; // bisa dibuat dari id atau nomor antrian, yang penting unik dan mudah diingat
    id_pemeriksaan?: string; // relasi ke pendaftaran
    id_pendaftaran: string;
    id_pasien: string;
    id_dokter: string;
    id_poli: string;
    nama_pasien: string;
    nama_dokter: string;
    nama_poli: string;
    nomor_antrian?: number;
    anamnesa: string;
    tekanan_darah?: string;   // contoh: 120/80
    suhu_tubuh?: number;      // contoh: 36.5
    berat_badan?: number;
    tinggi_badan?: number;
    diagnosa: string;
    tindakan?: string;
    catatan?: string;
    layanan: layananM[];
    obat: obatM[];
    total_layanan: number;
    total_obat: number;
    grand_total: number;
    status: string;
    tanggal_pemeriksaan: string;
    created_at: number;
    created_by: string;
    updated_at?: number;
    updated_by?: string;
}