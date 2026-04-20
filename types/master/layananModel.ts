export interface layananM {
    id?: string;
    kode_layanan: string;
    nama_layanan: string;
    kategori_layanan: string;
    jenis_layanan: string;
    deskripsi?: string;
    harga: number;
    durasi_menit?: number;
    status: string;
    perlu_dokter?: boolean;
    perlu_ruangan?: boolean;
    created_at: number;
    created_by: string;
    updated_at?: number;
    updated_by?: string;
}