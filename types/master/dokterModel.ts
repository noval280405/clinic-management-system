export interface dokterM {
    id?: string,
    nama_dokter: string,
    no_dokter: string,
    nama_poli?: string,
    id_poli?: string,
    sip_number?: string,
    no_hp?: string,
    email?: string,
    status: string,
    jadwal_praktik?: {
        hari: string[],
        jam_mulai: string,
        jam_selesai: string
    },
    user_id?: string,
    created_at: number,
    created_by: string,
    updated_at?: number,
    updated_by?: string,
}