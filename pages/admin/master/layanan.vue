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
        <span class="ml-5">HAPUS DATA LAYANAN</span>
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
          <span class="text-red"> "{{ data.id_layanan }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_layanan"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_layanan || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_layanan"
          color="primary"
          variant="flat"
          @click="hapusLayanan()"
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
        <!-- IDENTITAS -->
        <div class="text-caption font-weight-bold mb-2">Informasi Layanan</div>

        <v-row dense>
          <v-col cols="6">
            <a-text-field
              label="Nama Layanan"
              v-model="new_layanan.nama_layanan"
            />
          </v-col>

          <v-col cols="12">
            <a-text-field
              label="Kategori Layanan"
              v-model="new_layanan.kategori_layanan"
            />
          </v-col>
        </v-row>

        <!-- JENIS -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Jenis Layanan</div>

        <v-row dense>
          <v-col cols="6">
            <a-select
              label="Jenis"
              v-model="new_layanan.jenis_layanan"
              :items="['tindakan', 'konsultasi', 'lab', 'radiologi', 'lainnya']"
            />
          </v-col>

          <v-col cols="6">
            <a-text-field
              label="Durasi (Menit)"
              type="number"
              v-model="new_layanan.durasi_menit"
            />
          </v-col>
        </v-row>

        <!-- HARGA -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Harga</div>

        <v-row dense>
          <v-col cols="12">
            <a-text-field
              label="Harga"
              type="number"
              v-model="new_layanan.harga"
            />
          </v-col>
        </v-row>

        <!-- OPSIONAL -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Pengaturan</div>

        <v-row dense>
          <v-col cols="6">
            <v-switch
              label="Perlu Dokter"
              v-model="new_layanan.perlu_dokter"
              inset
            />
          </v-col>

          <v-col cols="6">
            <v-switch
              label="Perlu Ruangan"
              v-model="new_layanan.perlu_ruangan"
              inset
            />
          </v-col>
        </v-row>

        <!-- STATUS -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Status</div>

        <v-row dense>
          <v-col cols="6">
            <a-select
              label="Status"
              v-model="new_layanan.status"
              :items="['aktif', 'nonaktif']"
            />
          </v-col>
        </v-row>

        <!-- DESKRIPSI -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Deskripsi</div>

        <v-row dense>
          <v-col cols="12">
            <a-text-field label="Deskripsi" v-model="new_layanan.deskripsi" />
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
          <span class="font-weight-medium text-h5"> Master layanan </span>
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
        Tambah layanan
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
          Total: {{ layananStore.getDataLayanan.length }} Layanan
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headlayanan"
      :items="layananStore.getDataLayanan"
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

      <!-- NAMA -->
      <template v-slot:item.nama_layanan="{ item }">
        <v-chip
          size="small"
          color="blue-grey-lighten-5"
          class="font-weight-bold border"
        >
          {{ item.nama_layanan }}
        </v-chip>
      </template>

      <!-- JENIS -->
      <template v-slot:item.jenis_layanan="{ item }">
        <v-chip size="x-small" color="indigo" class="text-white text-uppercase">
          {{ item.jenis_layanan }}
        </v-chip>
      </template>

      <!-- HARGA -->
      <template v-slot:item.harga="{ item }">
        <span class="font-weight-medium">
          Rp {{ item.harga.toLocaleString() }}
        </span>
      </template>

      <!-- DURASI -->
      <template v-slot:item.durasi_menit="{ item }">
        <span class="text-caption">
          {{ item.durasi_menit ? item.durasi_menit + " menit" : "-" }}
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
          <v-icon icon="mdi-medical-bag" size="40" />
          <div>Data layanan tidak tersedia</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import { useLayananStores } from "~/stores/master/layananStore";
import type { layananM } from "~/types/master/layananModel";
const layananStore = useLayananStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("m_layanan");
  await layananStore.tarikDataLayanan();
});

const defaultLayanan = (): layananM => ({
  nama_layanan: "",
  kategori_layanan: "",
  jenis_layanan: "tindakan",
  harga: 0,
  status: "aktif",
  created_at: 0,
  created_by: "",
});

const new_layanan = ref<layananM>(defaultLayanan());

const data = reactive({
  search: "",
  id_layanan: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,

  headlayanan: [
    {
      title: "No",
      value: "no",
      align: "center",
      width: "50px",
    },
    {
      title: "Nama Layanan",
      value: "nama_layanan",
      sortable: true,
    },
    {
      title: "Kategori",
      value: "kategori_layanan",
      sortable: true,
    },
    {
      title: "Jenis",
      value: "jenis_layanan",
      sortable: true,
    },
    {
      title: "Harga",
      value: "harga",
      sortable: true,
    },
    {
      title: "Durasi",
      value: "durasi_menit",
      sortable: true,
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
    return "TAMBAH LAYANAN";
  } else {
    return "EDIT LAYANAN";
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
  data.dialogAdd = true;
}

async function validate() {
  if (data.addedit == "add") {
    addLayanan();
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
  new_layanan.value.updated_at = moment().unix();
  new_layanan.value.updated_by = useUserStore().getEmail;
  await layananStore.updateMasterLayanan(new_layanan.value);
  data.dialogAdd = false;
  refreshData();
}

function openDialogEdit(item: layananM) {
  data.addedit = "edit";
  new_layanan.value = _.assign({}, item);
  data.dialogAdd = true;
}

async function addLayanan() {
  if (!new_layanan.value.nama_layanan?.trim()) {
    return notificationStore.showError("Nama layanan wajib diisi");
  }

  if (!new_layanan.value.kategori_layanan?.trim()) {
    return notificationStore.showError("Kategori layanan wajib diisi");
  }

  if (!new_layanan.value.jenis_layanan) {
    return notificationStore.showError("Jenis layanan wajib dipilih");
  }

  if (
    new_layanan.value.durasi_menit === null ||
    new_layanan.value.durasi_menit === undefined
  ) {
    return notificationStore.showError("Durasi wajib diisi");
  }

  if (Number(new_layanan.value.durasi_menit) <= 0) {
    return notificationStore.showError("Durasi harus lebih dari 0 menit");
  }

  if (
    new_layanan.value.harga === null ||
    new_layanan.value.harga === undefined
  ) {
    return notificationStore.showError("Harga wajib diisi");
  }

  if (Number(new_layanan.value.harga) < 0) {
    return notificationStore.showError("Harga tidak boleh minus");
  }

  if (!new_layanan.value.status) {
    return notificationStore.showError("Status layanan wajib dipilih");
  }

  // LOGIC KLINIK (penting banget)
  if (
    new_layanan.value.jenis_layanan === "konsultasi" &&
    !new_layanan.value.perlu_dokter
  ) {
    return notificationStore.showError(
      "Layanan konsultasi wajib membutuhkan dokter",
    );
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }

  try {
    new_layanan.value.nama_layanan = new_layanan.value.nama_layanan.trim();

    new_layanan.value.kategori_layanan =
      new_layanan.value.kategori_layanan.trim();

    new_layanan.value.created_at = moment().unix();
    new_layanan.value.created_by = useUserStore().getEmail;

    await layananStore.addMasterLayanan(new_layanan.value);

    notificationStore.showSuccess("Berhasil menambahkan layanan");

    new_layanan.value = defaultLayanan();
    data.dialogAdd = false;
    refreshData();
  } catch (error) {
    console.error(error);
    notificationStore.showError("Gagal menambahkan layanan");
  }
}

function opendialoghapus(id_layanan: string) {
  data.dialoghapus = true;
  data.id_layanan = id_layanan;
  data.nama_id = "";
}

async function hapusLayanan() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_layanan == data.nama_id) {
    layananStore.deleteMasterLayanan(data.id_layanan);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus layanan");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_layanan");
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
