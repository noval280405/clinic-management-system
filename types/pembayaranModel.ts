export interface pembayaranM {
    id_pembayaran?: string;
    id_billing: string;
    id_pasien: string;
    nama_pasien?: string;
    total_tagihan: number;
    jumlah_bayar: number;
    kembalian: number;
    metode: "cash" | "transfer" | "qris" | "debit" | string;
    status: "Lunas" | "Pending" | "Gagal";
    tanggal_bayar?: number;
    created_at?: number;
    created_by?: string;
    updated_at?: number;
    updated_by?: string;
}