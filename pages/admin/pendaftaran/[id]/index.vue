<template>
  <v-container class="pa-3" fluid v-if="detailPendaftaran">
    <ConfirmationDialog ref="confirmationDialog" />

    <v-card variant="flat" class="rounded-xl bg-white custom-detail-card">
      <!-- HEADER SECTION (MENYAMPING / HORIZONTAL) -->
      <v-card-title
        class="px-5 py-4 d-flex justify-space-between align-center header-gradient text-white"
      >
        <!-- Modern Abstract Background Shapes -->
        <div class="glow-circle-1"></div>

        <div class="d-flex align-center gap-3 z-index-1">
          <div class="d-flex flex-column">
            <span
              class="text-overline font-weight-black text-blue-lighten-4 tracking-wider lh-1"
            >
              No. Antrian
            </span>
            <span class="text-h3 font-weight-black tracking-tight mt-1">
              {{ detailPendaftaran.no_antrian }}
            </span>
          </div>
        </div>

        <!-- Status Badge Menyamping di Kanan -->
        <v-chip
          size="small"
          :color="getStatusColor(detailPendaftaran.status)"
          variant="flat"
          class="font-weight-bold px-4 status-chip z-index-1"
        >
          <v-icon start size="10" class="mr-1">mdi-circle</v-icon>
          {{ detailPendaftaran.status }}
        </v-chip>
      </v-card-title>

      <!-- BODY SECTION (DIOPTIMALKAN AGAR TIDAK KOSONG) -->
      <v-card-text class="pa-4">
        <!-- GRID UTAMA UNTUK INFORMASI -->
        <v-row dense class="mb-2">
          <!-- Kolom Kiri: Pasien -->
          <v-col cols="12" sm="6" class="pb-2">
            <div class="info-box h-100">
              <v-avatar
                color="blue-lighten-5"
                class="rounded-lg mr-3"
                size="40"
              >
                <v-icon color="blue-darken-2" size="18">mdi-account</v-icon>
              </v-avatar>
              <div class="info-content">
                <span class="info-label">Nama Pasien</span>
                <span class="info-value">{{
                  detailPendaftaran.nama_pasien
                }}</span>
              </div>
            </div>
          </v-col>

          <!-- Kolom Kanan: Detail Klinik (Poli & Dokter digabung vertikal agar padat) -->
          <v-col cols="12" sm="6" class="pb-2">
            <div class="d-flex flex-column gap-2 h-100">
              <!-- Poli -->
              <div class="info-box-sm">
                <v-icon color="indigo-darken-1" size="16" class="mr-2"
                  >mdi-hospital-building</v-icon
                >
                <div class="d-flex align-center justify-space-between w-100">
                  <span class="sub-label">Poli:</span>
                  <span class="sub-value">{{
                    detailPendaftaran.nama_poli
                  }}</span>
                </div>
              </div>
              <!-- Dokter -->
              <div class="info-box-sm">
                <v-icon color="teal-darken-1" size="16" class="mr-2"
                  >mdi-doctor</v-icon
                >
                <div class="d-flex align-center justify-space-between w-100">
                  <span class="sub-label">Dokter:</span>
                  <span class="sub-value">{{
                    detailPendaftaran.nama_dokter
                  }}</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- COMPLAINT / KELUHAN BOX -->
        <v-card
          class="rounded-xl pa-3 bg-slate-50 border-smooth"
          variant="flat"
        >
          <div class="d-flex align-center mb-1">
            <v-icon color="amber-darken-3" size="16" class="mr-2"
              >mdi-comment-text-alert-outline</v-icon
            >
            <span
              class="text-caption font-weight-bold text-grey-darken-2 text-uppercase tracking-wide"
              >Keluhan</span
            >
          </div>
          <div
            class="text-body-2 text-grey-darken-3 font-italic pl-6 style-quote"
          >
            "{{ detailPendaftaran.keluhan || "Tidak ada keluhan tertulis." }}"
          </div>
        </v-card>
      </v-card-text>

      <!-- ACTIONS SECTION -->
      <v-card-actions class="px-5 pb-4 pt-1 d-flex justify-end">
        <!-- Status: Menunggu (Tombol ringkas berjejer di kanan) -->
        <div
          v-if="detailPendaftaran.status === 'Menunggu'"
          class="d-flex align-center gap-2"
        >
          <v-btn
            variant="elevated"
            color="red-darken-1"
            density="comfortable"
            @click="cancelPendaftaran"
            class="rounded-lg font-weight-bold text-capitalize px-4"
            prepend-icon="mdi-close-circle-outline"
            style="font-size: 13px; height: 36px"
          >
            Tolak
          </v-btn>

          <v-btn
            color="green-darken-1"
            variant="elevated"
            density="comfortable"
            @click="approvePendaftaran"
            class="rounded-lg font-weight-bold text-white text-capitalize px-4 btn-shadow-green"
            prepend-icon="mdi-check-circle"
            style="font-size: 13px; height: 36px"
          >
            Setujui
          </v-btn>
        </div>

        <!-- Status: Disetujui (Tombol ramping tidak memblokir penuh lebar card) -->
        <v-btn
          v-slot:default
          v-if="detailPendaftaran.status === 'Disetujui'"
          size="default"
          color="indigo-darken-2"
          variant="elevated"
          @click="openDialogAdd"
          class="rounded-lg font-weight-bold text-capitalize px-5 btn-shadow-primary"
          prepend-icon="mdi-stethoscope"
          style="font-size: 13px; height: 36px"
        >
          Mulai Pemeriksaan
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- DIALOG PEMERIKSAAN -->
    <v-dialog
      v-model="data.dialogAdd"
      :width="$vuetify.display.mdAndUp ? '600px' : '95%'"
    >
      <v-card class="rounded-xl">
        <!-- HEADER -->
        <v-card-title class="bg-primary text-white">
          <v-icon class="mr-2">mdi-stethoscope</v-icon>
          Form Pemeriksaan Pasien
        </v-card-title>

        <v-card-text class="pa-4 bg-grey-lighten-5">
          <v-card
            variant="flat"
            class="mb-4 rounded-xl border-sm bg-blue-lighten-5 text-blue-darken-4 pa-3"
            style="border-color: #bbdefb !important"
          >
            <div
              class="d-flex align-center justify-space-between flex-wrap gap-2"
            >
              <div class="d-flex align-center">
                <v-avatar
                  color="blue-darken-1"
                  size="32"
                  class="mr-2 text-white font-weight-bold text-body-2"
                >
                  {{ detailPendaftaran.no_antrian }}
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-black">
                    {{ new_pemeriksaan.nama_pasien }}
                  </div>
                  <div class="text-caption text-grey-darken-2">
                    {{ new_pemeriksaan.nama_poli }}
                  </div>
                </div>
              </div>
              <v-chip
                size="small"
                color="blue-darken-2"
                variant="elevated"
                class="font-weight-bold text-white"
              >
                Sedang Diperiksa
              </v-chip>
            </div>
          </v-card>

          <div class="d-flex align-center mb-2 mt-4">
            <v-avatar size="24" color="teal-lighten-5" class="mr-2">
              <v-icon color="teal-darken-1" size="16"
                >mdi-clipboard-text-outline</v-icon
              >
            </v-avatar>
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
              Anamnesa
            </div>
          </div>
          <a-textarea
            v-model="new_pemeriksaan.anamnesa"
            placeholder="Tuliskan keluhan utama pasien, riwayat penyakit, atau keluhan saat ini..."
            rows="2"
            class="mb-4"
            variant="outlined"
          />

          <div class="d-flex align-center mb-2 mt-4">
            <v-avatar size="24" color="indigo-lighten-5" class="mr-2">
              <v-icon color="indigo-darken-1" size="16">mdi-heart-pulse</v-icon>
            </v-avatar>
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
              Pemeriksaan Fisik / Tanda Vital
            </div>
          </div>

          <v-card
            class="pa-3 rounded-xl border-sm mb-2 bg-white"
            variant="flat"
            style="border-color: #e0e0e0 !important"
          >
            <v-row dense>
              <v-col cols="6" sm="3">
                <a-text-field
                  label="Tekanan Darah"
                  v-model="new_pemeriksaan.tekanan_darah"
                  prepend-inner-icon="mdi-heart-pulse"
                  placeholder="120/80"
                  suffix="mmHg"
                />
              </v-col>

              <v-col cols="6" sm="3">
                <a-text-field
                  label="Suhu Tubuh"
                  v-model="new_pemeriksaan.suhu_tubuh"
                  prepend-inner-icon="mdi-thermometer"
                  placeholder="36.5"
                  suffix="°C"
                />
              </v-col>

              <v-col cols="6" sm="3">
                <a-text-field
                  label="Berat Badan"
                  v-model="new_pemeriksaan.berat_badan"
                  prepend-inner-icon="mdi-scale-bathroom"
                  placeholder="60"
                  suffix="kg"
                />
              </v-col>

              <v-col cols="6" sm="3">
                <a-text-field
                  label="Tinggi Badan"
                  v-model="new_pemeriksaan.tinggi_badan"
                  prepend-inner-icon="mdi-human-male-height"
                  placeholder="165"
                  suffix="cm"
                />
              </v-col>
            </v-row>
          </v-card>

          <v-alert
            v-if="bmi"
            :color="kategoriBMI === 'Normal' ? 'success' : 'warning'"
            variant="tonal"
            density="compact"
            class="rounded-lg mb-4"
            icon="mdi-calculator-variant-outline"
          >
            Status BMI Pasien: <b class="text-body-2">{{ bmi }}</b> ({{
              kategoriBMI
            }})
          </v-alert>

          <v-divider class="my-4 border-opacity-25"></v-divider>

          <div class="d-flex align-center mb-2">
            <v-avatar size="24" color="red-lighten-5" class="mr-2">
              <v-icon color="red-darken-1" size="16">mdi-stethoscope</v-icon>
            </v-avatar>
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
              Diagnosa
            </div>
          </div>
          <a-textarea
            v-model="new_pemeriksaan.diagnosa"
            placeholder="Masukkan hasil diagnosa medis atau kode ICD-10..."
            rows="2"
            class="mb-4"
            variant="outlined"
          />

          <div class="d-flex align-center mb-2">
            <v-avatar size="24" color="orange-lighten-5" class="mr-2">
              <v-icon color="orange-darken-2" size="16">mdi-pill</v-icon>
            </v-avatar>
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
              Tindakan / Terapi / Resep
            </div>
          </div>
          <a-textarea
            v-model="new_pemeriksaan.tindakan"
            placeholder="Tuliskan tindakan medis, resep obat, atau terapi yang diberikan..."
            rows="2"
            class="mb-4"
            variant="outlined"
          />

          <v-divider class="my-4 border-opacity-25"></v-divider>

          <div class="d-flex align-center mb-2">
            <v-avatar size="24" color="blue-grey-lighten-5" class="mr-2">
              <v-icon color="blue-grey-darken-1" size="16"
                >mdi-note-text-outline</v-icon
              >
            </v-avatar>
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
              Catatan Tambahan
            </div>
          </div>
          <a-textarea
            v-model="new_pemeriksaan.catatan"
            placeholder="Catatan internal dokter, instruksi kontrol kembali, dsb..."
            rows="2"
            variant="outlined"
          />
        </v-card-text>

        <!-- ACTION -->
        <v-card-actions class="bg-grey-lighten-4">
          <v-spacer />
          <v-btn @click="data.dialogAdd = false" color="red" variant="flat">
            Batal
          </v-btn>

          <v-btn color="primary" variant="flat" @click="addPemeriksaan">
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

import _, { add } from "lodash";
import moment from "moment";
import type { pemeriksaanM } from "~/types/pemeriksaanModel";
const pendaftaranStore = usePendaftaranStores();
const route = useRoute();
const pemeriksaanStore = usePemeriksaanStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

onMounted(async () => {
  await pendaftaranStore.tarikdetailPendaftaran(route.params.id as string);
});

const detailPendaftaran = computed(() => pendaftaranStore.getDetailPendaftaran);

const defaultPemeriksaan = (): pemeriksaanM => ({
  id_pendaftaran: "",
  id_pasien: "",
  id_dokter: "",
  id_poli: "",
  nama_pasien: "",
  nama_dokter: "",
  nama_poli: "",
  anamnesa: "",
  diagnosa: "",
  layanan: [],
  obat: [],
  total_layanan: 0,
  total_harga_obat: 0,
  grand_total: 0,
  status: "Diperiksa",
  created_at: 0,
  created_by: "",
  tanggal_pemeriksaan: "",
  tekanan_darah: "",
  suhu_tubuh: 0,
  berat_badan: 0,
  tinggi_badan: 0,
  tindakan: "",
  catatan: "",
});

const new_pemeriksaan = ref<pemeriksaanM>(defaultPemeriksaan());

const data = reactive({
  search: "",
  id_pemeriksaan: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,

  headPemeriksaan: [
    { title: "No", value: "no", align: "center", width: "50px" },
    { title: "Kode RM", value: "kode_rm" },
    { title: "Pasien", value: "nama_pasien", sortable: true },
    { title: "Poli", value: "nama_poli" },
    { title: "Dokter", value: "nama_dokter" },
    { title: "Diagnosa", value: "diagnosa" },
    { title: "Tanggal", value: "tanggal_pemeriksaan" },
    { title: "Status", value: "status" },
    { title: "Aksi", value: "aksi", align: "center", width: "100px" },
  ],
});

const getStatusColor = (status: string) => {
  switch (status) {
    case "Menunggu":
      return "amber-lighten-4 text-amber-darken-4";
    case "Disetujui":
      return "green-lighten-4 text-green-darken-4";
    default:
      return "grey-lighten-3 text-grey-darken-3";
  }
};

const bmi = computed(() => {
  const bb = Number(new_pemeriksaan.value.berat_badan);
  const tb = Number(new_pemeriksaan.value.tinggi_badan) / 100;

  if (!bb || !tb) return null;

  return (bb / (tb * tb)).toFixed(1);
});

const kategoriBMI = computed(() => {
  if (!bmi.value) return "-";
  if (bmi.value < 18.5) return "Kurus";
  if (bmi.value < 25) return "Normal";
  if (bmi.value < 30) return "Overweight";
  return "Obesitas";
});

async function openDialogAdd() {
  new_pemeriksaan.value.id_pendaftaran = detailPendaftaran.value.id!;
  new_pemeriksaan.value.id_pasien = detailPendaftaran.value.id_pasien;
  new_pemeriksaan.value.id_dokter = detailPendaftaran.value.id_dokter;
  new_pemeriksaan.value.id_poli = detailPendaftaran.value.id_poli;
  new_pemeriksaan.value.nama_pasien = detailPendaftaran.value.nama_pasien;
  new_pemeriksaan.value.nama_dokter = detailPendaftaran.value.nama_dokter;
  new_pemeriksaan.value.nama_poli = detailPendaftaran.value.nama_poli;
  new_pemeriksaan.value.anamnesa = detailPendaftaran.value.keluhan!;
  data.dialogAdd = true;
}

async function addPemeriksaan() {
  if (new_pemeriksaan.value.tekanan_darah == "") {
    return notificationStore.showError("Tekanan darah wajib di isi");
  }
  if (new_pemeriksaan.value.suhu_tubuh == 0) {
    return notificationStore.showError("suhu tubuh wajib di isi");
  }
  if (new_pemeriksaan.value.berat_badan == 0) {
    return notificationStore.showError("berat badan wajib di isi");
  }
  if (new_pemeriksaan.value.tinggi_badan == 0) {
    return notificationStore.showError("tinggi badan wajib di isi");
  }
  if (new_pemeriksaan.value.diagnosa == "") {
    return notificationStore.showError("diagnosa wajib di isi");
  }
  if (new_pemeriksaan.value.tindakan == "") {
    return notificationStore.showError("Tindakan wajib di isi");
  }
  if (new_pemeriksaan.value.catatan == "") {
    return notificationStore.showError("catatan wajib di isi");
  }
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }
  console.log("DATA PEMERIKSAAN BARU", new_pemeriksaan.value);
  useloadingStore().setLoading(true);
  const c = await setPemeriksaan(new_pemeriksaan.value);
  if (c == "ok") {
    notificationStore.showSuccess("Data pemeriksaan berhasil ditambahkan");
  } else {
    notificationStore.showError("Gagal menambahkan data pemeriksaan");
    return;
  }
  useloadingStore().setLoading(false);
  data.dialogAdd = false;
  refreshData();
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("pemeriksaan");
  useloadingStore().setLoading(false);
}

async function cancelPendaftaran() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Batal",
    "Anda yakin ingin membatalkan pendaftaran ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("pembatalan pendaftaran dibatalkan");
  }
  useloadingStore().setLoading(true);
  const c = await deletePendaftaran(detailPendaftaran.value.id!);
  if (c == "ok") {
    notificationStore.showSuccess("Pendaftaran berhasil dibatalkan");
    // navigateTo("/admin/pendaftaran");
  } else {
    notificationStore.showError("Gagal membatalkan pendaftaran");
    return;
  }
  useloadingStore().setLoading(false);
}

async function approvePendaftaran() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Setujui",
    "Anda yakin ingin menyetujui pendaftaran ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("penyetujuan pendaftaran dibatalkan");
  }
  detailPendaftaran.value.status = "Disetujui";
  detailPendaftaran.value.disetujui_at = moment().unix();
  detailPendaftaran.value.disetujui_by = useUserStore().getEmail;
  detailPendaftaran.value.updated_at = moment().unix();
  detailPendaftaran.value.updated_by = useUserStore().getEmail;
  useloadingStore().setLoading(true);
  const c = await updatePendaftaran(detailPendaftaran.value);
  if (c == "ok") {
    notificationStore.showSuccess("Pendaftaran berhasil disetujui");
    // navigateTo("/admin/pendaftaran");
  } else {
    notificationStore.showError("Gagal menyetujui pendaftaran");
    return;
  }
  useloadingStore().setLoading(false);
}
</script>

<style scoped>
/* Main Card Setup */
.custom-detail-card {
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03) !important;
  overflow: hidden;
}

/* Header Compact & Horizontal */
.header-gradient {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  position: relative;
  overflow: hidden;
}

.glow-circle-1 {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  border-radius: 50%;
}

.status-chip {
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 28px !important;
}

/* Info Box Layouts (Mengurangi Space Kosong) */
.info-box {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.info-box-sm {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8fafc;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  flex-grow: 1;
}

.info-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.info-label {
  font-size: 10px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sub-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.sub-value {
  font-size: 12px;
  color: #1e293b;
  font-weight: 700;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

/* Utilities */
.bg-slate-50 {
  background-color: #f8fafc !important;
}

.border-smooth {
  border: 1px solid #e2e8f0 !important;
}

.lh-1 {
  line-height: 1;
}

.z-index-1 {
  z-index: 1;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.action-btn {
  height: 40px !important;
  font-size: 13px !important;
}

.btn-shadow-green {
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2) !important;
}

.btn-shadow-primary {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2) !important;
}
/* Gabungkan dengan style Anda sebelumnya */
.gap-2 {
  gap: 8px;
}

.btn-shadow-green {
  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.15) !important;
}

.btn-shadow-primary {
  box-shadow: 0 4px 10px rgba(49, 46, 129, 0.15) !important;
}
</style>
