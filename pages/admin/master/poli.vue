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
        <span class="ml-5">HAPUS DATA Poli</span>
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
          <span class="text-red"> "{{ data.id_Poli }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_Poli"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_Poli || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_Poli"
          color="primary"
          variant="flat"
          @click="hapusPoli"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="data.dialogAdd"
    :width="$vuetify.display.mdAndUp ? '780px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        {{ titleaddedit }}
      </v-card-title>

      <v-card-text>
        <!-- IDENTITAS -->
        <div class="text-caption font-weight-bold mb-2">Informasi Poli</div>

        <v-row dense>
          <v-col cols="6">
            <a-text-field label="Nama Poli" v-model="new_poli.nama_poli" />
          </v-col>

          <v-col cols="6">
            <a-select
              label="Jenis Poli"
              v-model="new_poli.jenis_poli"
              :items="['umum', 'spesialis', 'gigi', 'anak', 'lainnya']"
            />
          </v-col>

          <v-col cols="6">
            <a-text-field
              label="Lokasi"
              v-model="new_poli.lokasi"
              placeholder="Lantai / Ruangan"
            />
          </v-col>
        </v-row>

        <!-- JAM OPERASIONAL -->
        <div class="text-caption font-weight-bold mb-2 mt-4">
          Jam Operasional
        </div>

        <v-row dense>
          <v-col cols="6">
            <a-text-field
              label="Jam Buka"
              type="time"
              v-model="new_poli.jam_operasional.jam_buka"
            />
          </v-col>

          <v-col cols="6">
            <a-text-field
              label="Jam Tutup"
              type="time"
              v-model="new_poli.jam_operasional.jam_tutup"
            />
          </v-col>
        </v-row>

        <!-- ANTRIAN -->
        <div class="text-caption font-weight-bold mb-2 mt-4">
          Pengaturan Antrian
        </div>

        <v-row dense>
          <v-col cols="6">
            <a-text-field
              label="Max Antrian / Hari"
              type="number"
              v-model="new_poli.max_antrian_per_hari"
            />
          </v-col>
        </v-row>

        <!-- STATUS -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Status</div>

        <v-row dense>
          <v-col cols="6">
            <a-select
              label="Status"
              v-model="new_poli.status"
              :items="['aktif', 'nonaktif']"
            />
          </v-col>
        </v-row>

        <!-- DESKRIPSI -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Deskripsi</div>

        <v-row dense>
          <v-col cols="12">
            <a-text-field label="Deskripsi Poli" v-model="new_poli.deskripsi" />
          </v-col>
        </v-row>
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
          <span class="font-weight-medium text-h5"> Master Poli </span>
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
        Tambah Poli
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
          Total: {{ Polistore.getDataPoli.length }} Poli
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headPoli"
      :items="Polistore.getDataPoli"
      :search="data.search"
      density="compact"
      :items-per-page="data.itemsPerPage"
      v-model:page="data.page"
    >
      <!-- NO -->
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <!-- NAMA POLI -->
      <template v-slot:item.nama_poli="{ item }">
        <v-chip
          size="small"
          color="blue-grey-lighten-5"
          class="font-weight-bold border"
        >
          {{ item.nama_poli }}
        </v-chip>
      </template>

      <!-- JENIS -->
      <template v-slot:item.jenis_poli="{ item }">
        <v-chip size="x-small" color="indigo" class="text-white text-uppercase">
          {{ item.jenis_poli }}
        </v-chip>
      </template>

      <!-- JAM OPERASIONAL -->
      <template v-slot:item.jam_operasional="{ item }">
        <span class="text-caption">
          {{ item.jam_operasional?.jam_buka || "-" }} -
          {{ item.jam_operasional?.jam_tutup || "-" }}
        </span>
      </template>

      <!-- STATUS -->
      <template v-slot:item.status="{ item }">
        <v-chip
          size="x-small"
          :color="item.status === 'aktif' ? 'green' : 'grey'"
          class="text-white"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- AKSI -->
      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            size="25"
            color="info"
            variant="tonal"
            class="mr-1"
            @click="openDialogEdit(item)"
          >
            <v-icon icon="mdi-pencil" />
          </v-btn>

          <v-btn
            size="25"
            color="error"
            variant="tonal"
            @click="opendialoghapus(item.id!)"
          >
            <v-icon icon="mdi-delete" />
          </v-btn>
        </div>
      </template>

      <!-- NO DATA -->
      <template v-slot:no-data>
        <div class="text-center py-6 text-grey">
          <v-icon icon="mdi-hospital-building" size="40" />
          <div>Data poli tidak tersedia</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import { usePoliStores } from "~/stores/master/poliStore";
import type { poliM } from "~/types/master/poliModel";

definePageMeta({
  layout: "admin",
});
const Polistore = usePoliStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
onMounted(async () => {
  await Polistore.tarikDataPoli();
  sessionStorage.removeItem("m_Poli");
});
const defaultPoli = (): poliM => ({
  kode_poli: "",
  nama_poli: "",
  jenis_poli: "umum",
  lokasi: "",
  id_dokter: [],
  layanan_id: [],
  max_antrian_per_hari: 0,

  // ⬇️ WAJIB ADA
  jam_operasional: {
    jam_buka: "",
    jam_tutup: "",
  },

  status: "aktif",
  deskripsi: "",
  created_at: 0,
  created_by: "",
});
const new_poli = ref<poliM>(defaultPoli());

const data = reactive({
  search: "",
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,
  id_Poli: "",
  nama_id: "",
  dialoghapus: false,
  headPoli: [
    {
      title: "No",
      value: "no",
      align: "center",
      width: "50px",
    },
    {
      title: "Kode Poli",
      value: "kode_poli",
      sortable: true,
    },
    {
      title: "Nama Poli",
      value: "nama_poli",
      sortable: true,
    },
    {
      title: "Jenis",
      value: "jenis_poli",
      sortable: true,
    },
    {
      title: "Lokasi",
      value: "lokasi",
      sortable: true,
    },
    {
      title: "Jam Operasional",
      value: "jam_operasional",
    },
    {
      title: "Status",
      value: "status",
      sortable: true,
    },
    {
      title: "Aksi",
      value: "aksi",
      align: "center",
      width: "90px",
    },
  ],
});

const titleaddedit = computed(() => {
  if (data.addedit == "add") {
    return "TAMBAH POLI";
  } else {
    return "EDIT POLI";
  }
});

const bottomAddEdit = computed(() => {
  if (data.addedit == "add") {
    return "Simpan";
  } else {
    return "Edit";
  }
});

function openDialogAdd() {
  data.addedit = "add";
  new_poli.value = defaultPoli();

  data.dialogAdd = true;
}

async function validate() {
  if (data.addedit == "add") {
    addPoli();
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
  new_poli.value.updated_at = moment().unix();
  new_poli.value.updated_by = useUserStore().getEmail;

  await Polistore.updateMasterPoli(new_poli.value);

  data.dialogAdd = false;
  refreshData();
}

function openDialogEdit(item: poliM) {
  data.addedit = "edit";
  new_poli.value = _.assign({}, item);
  data.dialogAdd = true;
}

async function addPoli() {
  if (!new_poli.value.nama_poli?.trim()) {
    return notificationStore.showError("Nama poli wajib diisi");
  }

  if (!new_poli.value.jenis_poli) {
    return notificationStore.showError("Jenis poli wajib dipilih");
  }

  if (!new_poli.value.lokasi?.trim()) {
    return notificationStore.showError("Lokasi poli wajib diisi");
  }

  if (!new_poli.value.jam_operasional?.jam_buka) {
    return notificationStore.showError("Jam buka wajib diisi");
  }

  if (!new_poli.value.jam_operasional?.jam_tutup) {
    return notificationStore.showError("Jam tutup wajib diisi");
  }

  // 🔥 VALIDASI JAM (PENTING BANGET)
  const jamBuka = new_poli.value.jam_operasional.jam_buka;
  const jamTutup = new_poli.value.jam_operasional.jam_tutup;

  if (jamBuka >= jamTutup) {
    return notificationStore.showError(
      "Jam tutup harus lebih besar dari jam buka",
    );
  }

  if (
    new_poli.value.max_antrian_per_hari === null ||
    new_poli.value.max_antrian_per_hari === undefined
  ) {
    return notificationStore.showError("Max antrian wajib diisi");
  }

  if (Number(new_poli.value.max_antrian_per_hari) <= 0) {
    return notificationStore.showError("Max antrian harus lebih dari 0");
  }

  if (!new_poli.value.status) {
    return notificationStore.showError("Status poli wajib dipilih");
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }

  try {
    new_poli.value.nama_poli = new_poli.value.nama_poli.trim();
    new_poli.value.lokasi = new_poli.value.lokasi.trim();

    new_poli.value.created_at = moment().unix();
    new_poli.value.created_by = useUserStore().getEmail;

    const c = await setPoli(new_poli.value);

    if (c) {
      notificationStore.showSuccess("Berhasil menambahkan poli");
    } else {
      return notificationStore.showError("Gagal menambahkan poli");
    }

    await Polistore.tarikDataPoli();

    new_poli.value = defaultPoli();
    data.dialogAdd = false;
    refreshData();
  } catch (error) {
    console.error(error);
    notificationStore.showError("Terjadi kesalahan saat menyimpan data");
  }
}

function opendialoghapus(id_Poli: string) {
  data.dialoghapus = true;
  data.id_Poli = id_Poli;
  data.nama_id = "";
}

async function hapusPoli() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_Poli == data.nama_id) {
    Polistore.deleteMasterPoli(data.id_Poli);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus Poli");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_poli");
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
