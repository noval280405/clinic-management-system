<template>
  <v-container fluid v-if="detailPendaftaran">
    <h1>Detail Pendaftaran</h1>

    <v-dialog
      v-model="data.dialogAdd"
      :width="$vuetify.display.mdAndUp ? '580px' : '90%'"
    >
      <v-card class="rounded-lg">
        <v-card-title
          class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
        >
          TAMBAH DATA PEMERIKSAAN
        </v-card-title>

        <v-card-text>
          <!-- INFO PASIEN -->
          <div class="text-caption font-weight-bold mb-2">Informasi Pasien</div>

          <v-alert type="info" variant="tonal" density="compact" class="mb-3">
            <div class="text-caption">
              {{ new_pemeriksaan.nama_pasien }} • Antrian:
              {{ new_pemeriksaan.nomor_antrian }} •
              {{ new_pemeriksaan.nama_poli }}
            </div>
          </v-alert>

          <!-- KELUHAN -->
          <div class="text-caption font-weight-bold mb-2">Keluhan</div>

          <a-textarea
            v-model="new_pemeriksaan.anamnesa"
            label="Keluhan Pasien"
            placeholder="Keluhan utama pasien"
            rows="2"
            class="mb-3"
          />

          <!-- PEMERIKSAAN -->
          <div class="text-caption font-weight-bold mb-2">Pemeriksaan</div>

          <v-row dense>
            <v-col cols="6">
              <a-text-field
                label="Tekanan Darah"
                v-model="new_pemeriksaan.tekanan_darah"
              />
            </v-col>

            <v-col cols="6">
              <a-text-field
                label="Suhu Tubuh (°C)"
                v-model="new_pemeriksaan.suhu_tubuh"
              />
            </v-col>

            <v-col cols="6">
              <a-text-field
                label="Berat Badan (kg)"
                v-model="new_pemeriksaan.berat_badan"
              />
            </v-col>

            <v-col cols="6">
              <a-text-field
                label="Tinggi Badan (cm)"
                v-model="new_pemeriksaan.tinggi_badan"
              />
            </v-col>
          </v-row>

          <!-- DIAGNOSA -->
          <div class="text-caption font-weight-bold mb-2 mt-4">Diagnosa</div>

          <a-textarea
            v-model="new_pemeriksaan.diagnosa"
            label="Diagnosa Dokter"
            rows="2"
            class="mb-3"
          />

          <!-- TINDAKAN -->
          <div class="text-caption font-weight-bold mb-2">Tindakan</div>

          <a-textarea
            v-model="new_pemeriksaan.tindakan"
            label="Tindakan Medis"
            rows="2"
            class="mb-3"
          />

          <!-- CATATAN -->
          <div class="text-caption font-weight-bold mb-2">Catatan</div>

          <a-textarea
            v-model="new_pemeriksaan.catatan"
            label="Catatan Tambahan"
            rows="2"
          />
        </v-card-text>

        <v-card-actions class="pa-3 bg-grey-lighten-4">
          <v-btn
            variant="flat"
            color="grey-darken-2"
            @click="data.dialogAdd = false"
            class="text-capitalize px-3"
            size="small"
          >
            Batal
          </v-btn>

          <v-btn
            color="primary"
            @click="addPemeriksaan()"
            variant="flat"
            class="text-capitalize px-3"
            size="small"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mt-4">
      <v-card-title>Informasi Pendaftaran</v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-title
            >Nama Pasien: {{ detailPendaftaran.nama_pasien }}</v-list-item-title
          >
          <v-list-item-subtitle
            >Nomor Antrian:
            {{ detailPendaftaran.nomor_antrian }}</v-list-item-subtitle
          >
          <v-list-item-subtitle
            >Poli: {{ detailPendaftaran.nama_poli }}</v-list-item-subtitle
          >
        </v-list-item>
      </v-card-text>

      <v-card-action>
        <v-btn @click="openDialogAdd">Lanjut Pemeriksaan</v-btn>
      </v-card-action>
    </v-card>
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
  new_pemeriksaan.value.created_at = moment().unix();
  new_pemeriksaan.value.created_by = useUserStore().getEmail;
  const c = await setPemeriksaan(new_pemeriksaan.value);
  data.dialogAdd = false;
  refreshData();
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_Pemeriksaan_erp");
  useloadingStore().setLoading(false);
}
</script>
