export interface pasienM {
  id?: string;
  id_pasien?: string; // ID unik untuk pasien, bisa berupa UUID atau format lain
  no_rm?: string; // nomor rekam medis
  nik?: string;
  nama_pasien: string;
  jenis_kelamin: "L" | "P";
  tanggal_lahir: string;
  no_hp?: string;
  email?: string;
  alamat: string;
  jenis_pasien: "umum" | "bpjs" | "asuransi";
  no_bpjs?: string;
  no_asuransi?: string;
  golongan_darah?: "A" | "B" | "AB" | "O";
  alergi?: string;
  riwayat_penyakit?: string;
  nama_penanggung_jawab?: string;
  hubungan_penanggung?: string;
  no_hp_penanggung?: string;
  status: "aktif" | "nonaktif";
  created_at: number;
  created_by: string;
  updated_at?: number;
  updated_by?: string;
}