<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <v-dialog
    v-model="data.dialoghapus"
    :width="$vuetify.display.mdAndUp ? '30%' : '380'"
  >
    <v-card>
      <v-card-title
        style="background-color: #0d52af"
        class="text-white font-weight-bold pa-5"
      >
        <span class="ml-5">HAPUS DATA PEMERIKSAAN</span>
      </v-card-title>

      <v-card-text>
        <v-alert
          type="warning"
          class="mb-4 text-body-2"
          border="start"
          variant="tonal"
          density="comfortable"
          text="Data akan dihapus secara permanen dan tidak dapat dipulihkan. Pastikan Anda yakin sebelum melanjutkan."
        />

        <p class="text-center">
          Untuk melanjutkan proses penghapusan, silakan ketik ID Biaya berikut:
          <br />
          <span class="text-red"> "{{ data.id_pemeriksaan }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_pemeriksaan"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_pemeriksaan || 'ID tidak cocok',
          ]"
          clearable
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="red" variant="flat" @click="data.dialoghapus = false">
          Batal
        </v-btn>

        <v-btn
          :disabled="data.nama_id != data.id_pemeriksaan"
          color="primary"
          variant="flat"
          @click="hapuspemeriksaan"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="data.dialogAdd"
    :width="$vuetify.display.mdAndUp ? '580px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        {{ titleaddedit }}
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
          @click="validate"
          variant="flat"
          class="text-capitalize px-3"
          size="small"
        >
          {{ bottomAddEdit }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Main Content -->
  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5"> Master Pemeriksaan </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="3">
      <v-btn
        size="28"
        variant="outlined"
        color="grey-darken-1"
        class="border mr-3"
        @click="refreshData"
      >
        <v-icon size="18" icon="mdi-refresh" />
        <v-tooltip activator="parent" location="top"> Refresh Data </v-tooltip>
      </v-btn>

      <v-btn
        color="primary"
        @click="openDialogAdd"
        variant="flat"
        size="small"
        class="text-capitalize px-3"
        prepend-icon="mdi-plus"
      >
        Tambah Pemeriksaan
      </v-btn>
    </v-col>
  </v-row>

  <v-card class="border rounded-lg" flat>
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col cols="12" sm="10">
          <a-text-field
            v-model="data.search"
            placeholder="Search"
            style="max-width: 280px"
          />
        </v-col>

        <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
          Total: {{ pemeriksaanStore.getDataPemeriksaan.length }} Pemeriksaan
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headPemeriksaan"
      :items="pemeriksaanStore.getDataPemeriksaan"
      :search="data.search"
      density="compact"
      :items-per-page="data.itemsPerPage"
      v-model:page="data.page"
    >
      <!-- NO -->
      <!-- NO -->
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <!-- KODE RM
      <template v-slot:item.kode_rm="{ item }">
        <v-chip size="x-small" color="primary" class="font-weight-bold">
          {{ item.kode_rm }}
        </v-chip>
      </template> -->

      <!-- PASIEN -->
      <template v-slot:item.nama_pasien="{ item }">
        <span class="font-weight-medium">
          {{ item.nama_pasien }}
        </span>
      </template>

      <!-- POLI -->
      <template v-slot:item.nama_poli="{ item }">
        <v-chip size="x-small" color="indigo" class="text-white">
          {{ item.nama_poli }}
        </v-chip>
      </template>

      <!-- DOKTER -->
      <template v-slot:item.nama_dokter="{ item }">
        <span class="text-caption">
          {{ item.nama_dokter }}
        </span>
      </template>

      <!-- DIAGNOSA -->
      <template v-slot:item.diagnosa="{ item }">
        <span class="text-caption">
          {{ item.diagnosa || "-" }}
        </span>
      </template>

      <!-- TANGGAL -->
      <template v-slot:item.tanggal_pemeriksaan="{ item }">
        <span class="text-caption">
          {{ item.tanggal_pemeriksaan }}
        </span>
      </template>

      <!-- STATUS -->
      <template v-slot:item.status="{ item }">
        <v-chip
          size="x-small"
          :color="
            item.status === 'Draft'
              ? 'grey'
              : item.status === 'selesai'
                ? 'green'
                : 'blue'
          "
          class="text-white"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- AKSI -->
      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn size="25" color="info" variant="tonal" class="mr-1" :to="`/admin/pemeriksaan/${item.id}`">
            <v-icon icon="mdi-eye" />
          </v-btn>

          <v-btn size="25" color="warning" variant="tonal" class="mr-1">
            <v-icon icon="mdi-pencil" />
          </v-btn>

          <v-btn size="25" color="error" variant="tonal" @click="opendialoghapus(item.id)">
             <v-icon icon="mdi-delete" />
          </v-btn>
        </div>
      </template>

      <!-- NO DATA -->
      <template v-slot:no-data>
        <div class="text-center py-6 text-grey">
          <v-icon icon="mdi-file-document-outline" size="40" />
          <div>Tidak ada data rekam medis</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import { usePemeriksaanStores } from "~/stores/pemeriksaanStore";
import type { pemeriksaanM } from "~/types/pemeriksaanModel";
const pasienStore = usePasienStores();
const poliStore = usePoliStores();
const dokterStore = useDokterStores();
const pemeriksaanStore = usePemeriksaanStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("m_pemeriksaan");
  await pemeriksaanStore.tarikDataPemeriksaan();
});

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
  status: "Draft",
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
    { title: "Kode RM", value: "id_pemeriksaan" },
    { title: "Pasien", value: "nama_pasien", sortable: true },
    { title: "Poli", value: "nama_poli" },
    { title: "Dokter", value: "nama_dokter" },
    { title: "Diagnosa", value: "diagnosa" },
    { title: "Tanggal", value: "tanggal_pemeriksaan" },
    { title: "Status", value: "status" },
    { title: "Aksi", value: "aksi", align: "center", width: "100px" },
  ],
});

const titleaddedit = computed(() => {
  if (data.addedit == "add") {
    return "TAMBAH Pemeriksaan";
  } else {
    return "EDIT Pemeriksaan";
  }
});

const bottomAddEdit = computed(() => {
  if (data.addedit == "add") {
    return "Simpan";
  } else {
    return "Edit";
  }
});

async function openDialogAdd() {
  new_pemeriksaan.value = defaultPemeriksaan();
  data.addedit = "add";
  data.dialogAdd = true;
}

async function validate() {
  if (data.addedit == "add") {
    addPemeriksaan();
  } else {
    saveedit();
  }
}

async function saveedit() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Edit",
    "Anda yakin ingin mengedit data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("edit data dibatalkan");
  }
  new_pemeriksaan.value.updated_at = moment().unix();
  new_pemeriksaan.value.updated_by = useUserStore().getEmail;
  await pemeriksaanStore.updatePemeriksaan(new_pemeriksaan.value);
  data.dialogAdd = false;
  refreshData();
}

function openDialogEdit(item: pemeriksaanM) {
  data.addedit = "edit";
  new_pemeriksaan.value = _.assign({}, item);
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
  await pemeriksaanStore.addPemeriksaan(new_pemeriksaan.value);
  data.dialogAdd = false;
  refreshData();
}

function opendialoghapus(id_pemeriksaan: string) {
  data.dialoghapus = true;
  data.id_pemeriksaan = id_pemeriksaan;
  data.nama_id = "";
}

async function hapuspemeriksaan() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_pemeriksaan == data.nama_id) {
    pemeriksaanStore.deletePemeriksaan(data.id_pemeriksaan);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus pemeriksaan");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_Pemeriksaan_erp");
  useloadingStore().setLoading(false);
}
</script>

<style scoped>
:deep() thead th {
  font-weight: bold !important;
  border: 1px solid #cbcbcb !important;
  background-color: #dddddd !important;
}

:deep() tbody td {
  border-right: 1px solid #e0e0e0 !important;
}
</style>
