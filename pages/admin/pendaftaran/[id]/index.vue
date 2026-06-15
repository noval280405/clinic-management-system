<template>
  <v-container class="pa-3" fluid v-if="detailPendaftaran">
    <ConfirmationDialog ref="confirmationDialog" />

    <v-card
      variant="outlined"
      class="rounded-xl border-grey-lighten-2 bg-white elevation-1"
    >
      <v-card-title
        class="mb-4 text-center py-6 d-block rounded-t-xl"
        style="
          background: linear-gradient(135deg, #0d47a1 0%, #1e88e5 100%);
          overflow: hidden;
          position: relative;
          white-space: normal;
        "
      >
        <div
          style="
            position: absolute;
            top: -40px;
            right: -20px;
            width: 140px;
            height: 140px;
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0) 70%
            );
            border-radius: 50%;
          "
        ></div>
        <div
          style="
            position: absolute;
            bottom: -30px;
            left: -30px;
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
          "
        ></div>

        <div
          class="text-caption text-blue-lighten-4 font-weight-bold tracking-wider text-uppercase"
        >
          Nomor Antrian
        </div>

        <div class="text-h2 font-weight-black text-white my-1 tracking-tight">
          {{ detailPendaftaran.no_antrian }}
        </div>

        <v-chip
          size="small"
          class="font-weight-bold text-white px-4 mt-1"
          style="
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.25);
          "
        >
          <v-icon start size="10" class="mr-1" color="amber-lighten-3"
            >mdi-circle</v-icon
          >
          {{ detailPendaftaran.status }}
        </v-chip>
      </v-card-title>

      <v-card-text class="pt-0 px-4">
        <v-row dense class="mx-0 mb-3">
          <v-col cols="12" sm="4" class="pa-1">
            <v-card
              class="rounded-xl pa-3 d-flex align-center bg-blue-lighten-5 h-100 border-sm"
              variant="flat"
              style="border-color: #e3f2fd !important"
            >
              <v-avatar color="primary" class="mr-3 elevation-1" size="36">
                <v-icon color="white" size="18">mdi-account</v-icon>
              </v-avatar>
              <div style="min-width: 0">
                <div
                  class="text-caption text-primary font-weight-bold"
                  style="line-height: 1"
                >
                  Pasien
                </div>
                <div
                  class="text-body-2 font-weight-bold text-grey-darken-4 text-truncate mt-1"
                >
                  {{ detailPendaftaran.nama_pasien }}
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4" class="pa-1">
            <v-card
              class="rounded-xl pa-3 d-flex align-center bg-indigo-lighten-5 h-100 border-sm"
              variant="flat"
              style="border-color: #e8eaf6 !important"
            >
              <v-avatar color="indigo" class="mr-3 elevation-1" size="36">
                <v-icon color="white" size="18">mdi-hospital-building</v-icon>
              </v-avatar>
              <div style="min-width: 0">
                <div
                  class="text-caption text-indigo font-weight-bold"
                  style="line-height: 1"
                >
                  Poli
                </div>
                <div
                  class="text-body-2 font-weight-bold text-grey-darken-4 text-truncate mt-1"
                >
                  {{ detailPendaftaran.nama_poli }}
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4" class="pa-1">
            <v-card
              class="rounded-xl pa-3 d-flex align-center bg-teal-lighten-5 h-100 border-sm"
              variant="flat"
              style="border-color: #e0f2f1 !important"
            >
              <v-avatar color="teal" class="mr-3 elevation-1" size="36">
                <v-icon color="white" size="18">mdi-doctor</v-icon>
              </v-avatar>
              <div style="min-width: 0">
                <div
                  class="text-caption text-teal font-weight-bold"
                  style="line-height: 1"
                >
                  Dokter
                </div>
                <div
                  class="text-body-2 font-weight-bold text-grey-darken-4 text-truncate mt-1"
                >
                  {{ detailPendaftaran.nama_dokter }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-card
          class="rounded-xl pa-3 mb-2 bg-amber-lighten-5 border-sm"
          variant="flat"
          style="border-color: #fff8e1 !important"
        >
          <div class="d-flex align-center mb-1">
            <v-icon color="amber-darken-4" size="18" class="mr-1.5"
              >mdi-alert-circle</v-icon
            >
            <span class="text-caption font-weight-bold text-amber-darken-4"
              >Keluhan</span
            >
          </div>
          <div
            class="text-body-2 text-grey-darken-3 pl-5 font-italic"
            style="line-height: 1.4"
          >
            "{{ detailPendaftaran.keluhan || "Tidak ada keluhan tertulis." }}"
          </div>
        </v-card>
      </v-card-text>

      <v-card-actions class="px-4 pb-4 pt-0">
        <div
          v-if="detailPendaftaran.status === 'Menunggu'"
          class="d-flex justify-end w-100"
        >
          <div
            v-if="detailPendaftaran.status === 'Menunggu'"
            class="d-flex justify-end w-100"
          >
            <v-btn
              variant="tonal"
              color="red-darken-1"
              @click="cancelPendaftaran"
              class="rounded-xl font-weight-bold text-capitalize mr-2 px-4 action-btn-hover"
              prepend-icon="mdi-close-circle-outline"
              style="
                letter-spacing: 0.3px;
                transition: all 0.2s ease-in-out;
                border: 1px solid rgba(229, 57, 53, 0.2);
              "
            >
              Tolak
            </v-btn>

            <v-btn
              color="green-darken-1"
              variant="elevated"
              @click="approvePendaftaran"
              class="rounded-xl font-weight-bold text-white text-capitalize px-4 action-btn-hover"
              prepend-icon="mdi-check-circle"
              style="
                letter-spacing: 0.3px;
                transition: all 0.2s ease-in-out;
                box-shadow: 0 4px 10px rgba(67, 160, 71, 0.25) !important;
              "
            >
              Setujui
            </v-btn>
          </div>
        </div>

        <v-btn
          v-if="detailPendaftaran.status === 'Disetujui'"
          block
          size="large"
          color="primary"
          variant="elevated"
          elevation="2"
          class="rounded-xl font-weight-bold text-capitalize"
          prepend-icon="mdi-stethoscope"
          @click="openDialogAdd"
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
.hero-card {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  box-shadow: 0 10px 25px rgba(25, 118, 210, 0.3);
}

.info-card {
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.keluhan-card {
  padding: 12px;
  border-radius: 16px;
  background: #fff8e1;
  border-left: 4px solid orange;
}

.action-btn {
  background: linear-gradient(135deg, #0d52af, #1976d2);
  color: white;
  font-weight: bold;
}

.action-btn-cancel {
  background: linear-gradient(135deg, #890a0a, #ff0000);
  color: white;
  font-weight: bold;
}

.action-btn-approve {
  background: linear-gradient(135deg, #0f7614, #23f565);
  color: white;
  font-weight: bold;
}
</style>
