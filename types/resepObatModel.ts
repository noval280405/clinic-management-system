export interface resepObatM {
    id?: string;
    id_resep?: string;
    id_pendaftaran: string;
    id_pemeriksaan: string;
    id_pasien: string;
    id_dokter: string;
    id_poli: string;
    nama_dokter: string;
    nama_poli: string;
    nama_pasien: string;
    items_obat: ResepObatItemM[];
    diagnosa: string;
    status: string;
    total_harga?: number;
    created_at?: number;
    created_by?: string;
    updated_at?: number;
    updated_by?: string;
}

export interface ResepObatItemM {
    id_obat?: string;
    nama_obat: string;
    dosis: string;
    jumlah: number;
    harga: number;
    subtotal: number;
}