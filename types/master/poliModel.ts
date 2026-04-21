export interface poliM {
    id?: string;
    kode_poli: string;
    nama_poli: string;
    jenis_poli: string; 
    lokasi?: string; 
    id_dokter?: string[]; 
    layanan_id?: string[]; 
    max_antrian_per_hari?: number;
    jam_operasional?: {
        jam_buka: string;
        jam_tutup: string;
    };
    status: string;
    deskripsi?: string;
    created_at: number;
    created_by: string;
    updated_at?: number;
    updated_by?: string;
}