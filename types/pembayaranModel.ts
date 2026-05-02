export interface pembayaranM {
    id?:string
    id_pembayaran?: string;
    id_billing: string;
    id_pasien: string;
    nama_pasien?: string;
    id_dokter: string;
    nama_dokter?: string;
    total_tagihan: number;
    jumlah_bayar: number;
    kembalian: number;
    metode: "cash" | "transfer" | "qris" | "debit" | string;
    status: string;
    tanggal_bayar?: number;
    created_at?: number;
    created_by?: string;
    updated_at?: number;
    updated_by?: string;
}