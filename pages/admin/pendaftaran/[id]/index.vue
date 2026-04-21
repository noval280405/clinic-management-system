<template>
  <v-container class="pa-3" fluid v-if="detailPendaftaran">
    <ConfirmationDialog ref="confirmationDialog" />

    <!-- HERO ANTRIAN -->
    <v-card class="hero-card mb-3 rounded-xl">
      <div class="text-center py-4">
        <div class="text-caption text-white mb-1">Nomor Antrian</div>

        <div class="text-h1 font-weight-bold text-white">
          {{ detailPendaftaran.no_antrian }}
        </div>

        <v-chip size="small" class="mt-2" color="white" text-color="primary">
          {{ detailPendaftaran.status }}
        </v-chip>
      </div>
    </v-card>

    <!-- INFO GRID -->
    <v-row dense class="mb-3">
      <!-- PASIEN -->
      <v-col cols="12" sm="6">
        <v-card class="info-card">
          <v-icon class="mb-1" color="primary">mdi-account</v-icon>
          <div class="text-caption text-grey">Pasien</div>
          <div class="font-weight-bold">
            {{ detailPendaftaran.nama_pasien }}
          </div>
        </v-card>
      </v-col>

      <!-- POLI -->
      <v-col cols="6" sm="3">
        <v-card class="info-card text-center">
          <v-icon color="indigo">mdi-hospital-building</v-icon>
          <div class="text-caption text-grey">Poli</div>
          <div class="font-weight-medium">
            {{ detailPendaftaran.nama_poli }}
          </div>
        </v-card>
      </v-col>

      <!-- DOKTER -->
      <v-col cols="6" sm="3">
        <v-card class="info-card text-center">
          <v-icon color="teal">mdi-doctor</v-icon>
          <div class="text-caption text-grey">Dokter</div>
          <div class="font-weight-medium">
            {{ detailPendaftaran.nama_dokter }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- KELUHAN -->
    <v-card class="keluhan-card mb-3">
      <div class="d-flex align-center mb-2">
        <v-icon color="orange" class="mr-2">mdi-alert</v-icon>
        <div class="font-weight-bold">Keluhan</div>
      </div>

      <div class="text-body-2">
        {{ detailPendaftaran.keluhan || "-" }}
      </div>
    </v-card>

    <!-- ACTION -->
    <v-btn
      block
      size="large"
      class="rounded-xl action-btn"
      prepend-icon="mdi-stethoscope"
      @click="openDialogAdd"
    >
      Mulai Pemeriksaan
    </v-btn>
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

        <v-card-text>
          <!-- INFO -->
          <v-alert
            type="info"
            variant="tonal"
            density="comfortable"
            class="mb-4"
          >
            {{ new_pemeriksaan.nama_pasien }} • Antrian
            {{ detailPendaftaran.no_antrian }} •
            {{ new_pemeriksaan.nama_poli }}
          </v-alert>

          <!-- ANAMNESA -->
          <div class="text-caption font-weight-bold mb-1">Anamnesa</div>
          <a-textarea
            v-model="new_pemeriksaan.anamnesa"
            label="Keluhan Pasien"
            rows="2"
            class="mb-3"
          />

          <!-- PEMERIKSAAN -->
          <div class="text-caption font-weight-bold mb-2">
            Pemeriksaan Fisik
          </div>

          <v-row dense>
            <v-col cols="6">
              <a-text-field
                label="Tekanan Darah"
                v-model="new_pemeriksaan.tekanan_darah"
                prepend-inner-icon="mdi-heart-pulse"
              />
            </v-col>

            <v-col cols="6">
              <a-text-field
                label="Suhu (°C)"
                v-model="new_pemeriksaan.suhu_tubuh"
                prepend-inner-icon="mdi-thermometer"
              />
            </v-col>

            <v-col cols="6">
              <a-text-field
                label="Berat (kg)"
                v-model="new_pemeriksaan.berat_badan"
              />
            </v-col>

            <v-col cols="6">
              <a-text-field
                label="Tinggi (cm)"
                v-model="new_pemeriksaan.tinggi_badan"
              />
            </v-col>
          </v-row>

          <!-- DIAGNOSA -->
          <div class="text-caption font-weight-bold mt-3 mb-1">Diagnosa</div>
          <a-textarea v-model="new_pemeriksaan.diagnosa" rows="2" />

          <!-- TINDAKAN -->
          <div class="text-caption font-weight-bold mt-3 mb-1">Tindakan</div>
          <a-textarea v-model="new_pemeriksaan.tindakan" rows="2" />

          <!-- CATATAN -->
          <div class="text-caption font-weight-bold mt-3 mb-1">Catatan</div>
          <a-textarea v-model="new_pemeriksaan.catatan" rows="2" />
        </v-card-text>

        <!-- ACTION -->
        <v-card-actions class="bg-grey-lighten-4">
          <v-spacer />
          <v-btn @click="data.dialogAdd = false" variant="text"> Batal </v-btn>

          <v-btn color="primary" @click="addPemeriksaan"> Simpan </v-btn>
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
  total_obat: 0,
  grand_total: 0,
  status: "draft",
  created_at: 0,
  created_by: "",
  tanggal_pemeriksaan: "",
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
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }
  console.log("DATA PEMERIKSAAN BARU", new_pemeriksaan.value);
  const c = await setPemeriksaan(new_pemeriksaan.value);
  if (c == "ok") {
    notificationStore.showSuccess("Data pemeriksaan berhasil ditambahkan");
  } else {
    notificationStore.showError("Gagal menambahkan data pemeriksaan");
    return;
  }
  data.dialogAdd = false;
  refreshData();
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("pemeriksaan");
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
</style>
