import type { layananM } from "./master/layananModel";
import type { obatM } from "./master/obatModel";

export interface pemeriksaanM {
    id?: string;
    no_pemeriksaan?: string; // bisa dibuat dari id atau nomor antrian, yang penting unik dan mudah diingat
    id_pemeriksaan?: string; // relasi ke pendaftaran
    // RELASI
    id_pendaftaran: string;
    id_pasien: string;
    id_dokter: string;
    id_poli: string;

    // INFO DASAR (snapshot biar aman kalau master berubah)
    nama_pasien: string;
    nama_dokter: string;
    nama_poli: string;
    nomor_antrian?: number;

    // 🩺 ANAMNESA (keluhan detail)
    anamnesa: string;

    // 🔍 PEMERIKSAAN FISIK (optional tapi bagus)
    tekanan_darah?: string;   // contoh: 120/80
    suhu_tubuh?: number;      // contoh: 36.5
    berat_badan?: number;
    tinggi_badan?: number;

    // 🧠 DIAGNOSA
    diagnosa: string;

    // ⚕️ TINDAKAN
    tindakan?: string;

    // 💬 CATATAN DOKTER
    catatan?: string;

    // 💉 LAYANAN (tindakan berbayar)
    layanan: layananM[];

    // 💊 OBAT (resep)
    obat: obatM[];

    // 💰 TOTAL (boleh dihitung di sini atau kasir)
    total_layanan: number;
    total_obat: number;
    grand_total: number;

    // STATUS PEMERIKSAAN
    status: "draft" | "selesai";
    tanggal_pemeriksaan: string;

    // AUDIT
    created_at: number;
    created_by: string;
    updated_at?: number;
    updated_by?: string;
}