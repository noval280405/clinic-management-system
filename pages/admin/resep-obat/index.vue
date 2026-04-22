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
        <span class="ml-5">HAPUS DATA RESEP</span>
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
          <span class="text-red"> "{{ data.id_resep }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_resep"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_resep || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_resep"
          color="primary"
          variant="flat"
          @click="hapusresep"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Main Content -->
  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5"> Master Resep </span>
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
        Tambah resep
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
          Total: {{ resepStore.getDataResepObat.length }} resep
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headresep"
      :items="resepStore.getDataResepObat"
      :search="data.search"
      density="compact"
      class="text-caption"
    >
      <!-- NO -->
      <template v-slot:item.no="{ index }">
        <span class="text-grey-darken-1 font-weight-bold">
          {{ index + 1 }}
        </span>
      </template>

      <!-- ID RESEP -->
      <template v-slot:item.id_resep="{ item }">
        <v-chip size="x-small" color="primary" class="font-weight-bold">
          {{ item.id_resep }}
        </v-chip>
      </template>

      <!-- PASIEN -->
      <template v-slot:item.nama_pasien="{ item }">
        <div class="font-weight-medium">
          {{ item.nama_pasien }}
        </div>
      </template>

      <!-- DOKTER -->
      <template v-slot:item.nama_dokter="{ item }">
        <span class="text-grey-darken-1">
          {{ item.nama_dokter }}
        </span>
      </template>

      <!-- POLI -->
      <template v-slot:item.nama_poli="{ item }">
        <v-chip size="x-small" color="indigo">
          {{ item.nama_poli }}
        </v-chip>
      </template>

      <!-- DIAGNOSA -->
      <template v-slot:item.diagnosa="{ item }">
        <span class="text-caption text-grey-darken-2">
          {{ item.diagnosa || "-" }}
        </span>
      </template>

      <!-- TOTAL -->
      <template v-slot:item.total_harga="{ item }">
        <span class="font-weight-bold text-green-darken-2">
          Rp {{ item.total_harga?.toLocaleString() || 0 }}
        </span>
      </template>

      <!-- AKSI -->
      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            size="25"
            color="info"
            variant="tonal"
            class="mr-1"
            :to="`/admin/resep-obat/${item.id_resep}`"
          >
            <v-icon size="16">mdi-eye</v-icon>
          </v-btn>

          <v-btn size="25" color="warning" variant="tonal" class="mr-1">
            <v-icon size="16">mdi-pencil</v-icon>
          </v-btn>
          <v-btn size="25" color="error" variant="tonal" @click="opendialoghapus(item.id)">
             <v-icon size="16">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>

      <!-- EMPTY -->
      <template v-slot:no-data>
        <div class="text-center py-6 text-grey">
          <v-icon size="40">mdi-pill</v-icon>
          <div>Belum ada data resep obat</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import type { resepObatM } from "~/types/resepObatModel";
const pasienStore = usePasienStores();
const poliStore = usePoliStores();
const dokterStore = useDokterStores();
const resepStore = useresepObatStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("resep_obat");
  await resepStore.tarikDataResepObat();
});

const defaultresep = (): resepObatM => ({
  id_pendaftaran: "",
  id_pemeriksaan: "",
  id_pasien: "",
  id_dokter: "",
  id_poli: "",
  nama_dokter: "",
  nama_poli: "",
  nama_pasien: "",
  items_obat: [],
  diagnosa: "",
  status: ""
});

const new_resep = ref<resepObatM>(defaultresep());

const data = reactive({
  search: "",
  id_resep: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,

  headresep: [
    { title: "No", value: "no", width: "60px", align: "center" },
    { title: "ID Resep", value: "id_resep" },
    { title: "Pasien", value: "nama_pasien" },
    { title: "Dokter", value: "nama_dokter" },
    { title: "Poli", value: "nama_poli" },
    { title: "Diagnosa", value: "diagnosa" },
    { title: "Total", value: "total_harga", align: "end" },
    { title: "Aksi", value: "aksi", align: "center", width: "120px" },
  ],
});

async function openDialogAdd() {
  new_resep.value = defaultresep();
  data.addedit = "add";
  data.dialogAdd = true;
}

async function saveedit() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Edit",
    "Anda yakin ingin mengedit data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("edit data dibatalkan");
  }
  new_resep.value.updated_at = moment().unix();
  new_resep.value.updated_by = useUserStore().getEmail;
  await resepStore.updateResepObat(new_resep.value);
  data.dialogAdd = false;
  refreshData();
}

function openDialogEdit(item: resepObatM) {
  data.addedit = "edit";
  new_resep.value = _.assign({}, item);
  data.dialogAdd = true;
}

function opendialoghapus(id_resep: string) {
  data.dialoghapus = true;
  data.id_resep = id_resep;
  data.nama_id = "";
}

async function hapusresep() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_resep == data.nama_id) {
    resepStore.deleteResepObat(data.id_resep);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus resep");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_resep_erp");
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
