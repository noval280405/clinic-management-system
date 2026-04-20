export interface poliM {
    id?: string;
    // IDENTITAS POLI
    kode_poli: string;
    nama_poli: string;
    // KATEGORI
    jenis_poli: string; // contoh: umum, gigi, anak, dll
    // LOKASI
    lokasi?: string; // contoh: lantai 1, ruang 101
    // RELASI
    id_dokter?: string[]; // relasi ke dokter
    layanan_id?: string[]; // layanan yang tersedia di poli ini
    // ANTRIAN
    max_antrian_per_hari?: number;
    // JAM OPERASIONAL
    jam_operasional?: {
        jam_buka: string;
        jam_tutup: string;
    };
    // STATUS
    status: string; // contoh: aktif, nonaktif
    // DESKRIPSI
    deskripsi?: string;
    // AUDIT
    created_at: number;
    created_by: string;
    updated_at?: number;
    updated_by?: string;
}