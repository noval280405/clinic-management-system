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
        <span class="ml-5">HAPUS DATA OBAT</span>
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
          <span class="text-red"> "{{ data.id_obat }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_obat"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_obat || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_obat"
          color="primary"
          variant="flat"
          @click="hapusOBAT"
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
        <!-- IDENTITAS OBAT -->
        <div class="text-caption font-weight-bold mb-2">Informasi Obat</div>

        <v-row dense>
          <v-col cols="6">
            <a-text-field label="Nama Obat" v-model="new_obat.nama_obat" />
          </v-col>

          <v-col cols="12">
            <a-select
              :items="kategoriObatList"
              label="Kategori Obat"
              v-model="new_obat.kategori_obat"
            />
          </v-col>
        </v-row>

        <!-- DETAIL OBAT -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Detail Obat</div>

        <v-row dense>
          <v-col cols="6">
            <a-select
              label="Satuan"
              v-model="new_obat.satuan"
              :items="['tablet', 'kapsul', 'botol', 'tube', 'strip', 'ampul']"
            />
          </v-col>

          <v-col cols="6">
            <a-text-field label="Bentuk Obat" v-model="new_obat.bentuk_obat" />
          </v-col>
        </v-row>

        <!-- STOK & HARGA -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Stok & Harga</div>

        <v-row dense>
          <v-col cols="6">
            <a-text-field label="Stok" type="number" v-model="new_obat.stok" />
          </v-col>

          <v-col cols="6">
            <a-text-field
              label="Stok Minimum"
              type="number"
              v-model="new_obat.stok_minimum"
            />
          </v-col>

          <v-col cols="6">
            <a-text-field
              label="Harga Beli"
              type="number"
              v-model="new_obat.harga_beli"
            />
          </v-col>

          <v-col cols="6">
            <a-text-field
              label="Harga Jual"
              type="number"
              v-model="new_obat.harga_jual"
            />
          </v-col>
        </v-row>

        <!-- EXP & STATUS -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Status Obat</div>

        <v-row dense>
          <v-col cols="6">
            <a-date-picker
              v-model="new_obat.tanggal_kadaluarsa"
              label="Tanggal Kadaluarsa"
            />
          </v-col>

          <v-col cols="6">
            <a-select
              label="Status"
              v-model="new_obat.status"
              :items="['aktif', 'nonaktif']"
            />
          </v-col>
        </v-row>

        <!-- SUPPLIER -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Supplier</div>

        <v-row dense>
          <v-col cols="12">
            <a-select
              label="Supplier"
              v-model="new_obat.id_supplier"
              :items="supplierStore.getDataSuplier"
              item-title="nama_supplier"
              item-value="id"
            />
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
          <span class="font-weight-medium text-h5"> Master Obat </span>
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
        Tambah obat
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
          Total: {{ obatStore.getDataObat.length }} obat
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headObat"
      :items="obatStore.getDataObat"
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

      <!-- NAMA OBAT -->
      <template v-slot:item.nama_obat="{ item }">
        <v-chip
          size="small"
          color="blue-grey-lighten-5"
          class="text-blue-grey-darken-3 font-weight-bold border"
        >
          {{ item.nama_obat }}
        </v-chip>
      </template>

      <!-- STOK -->
      <template v-slot:item.stok="{ item }">
        <v-chip
          :color="item.stok <= item.stok_minimum ? 'red' : 'green'"
          size="x-small"
          class="text-white"
        >
          {{ item.stok }}
        </v-chip>
      </template>

      <!-- HARGA -->
      <template v-slot:item.harga_jual="{ item }">
        <span class="font-weight-medium">
          Rp {{ item.harga_jual.toLocaleString() }}
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
            size="27"
            variant="tonal"
            color="info"
            class="rounded-lg mr-1"
            @click="openDialogEdit(item)"
          >
            <v-icon icon="mdi-pencil-outline" />
            <v-tooltip activator="parent" location="top">Edit</v-tooltip>
          </v-btn>

          <v-btn
            size="27"
            variant="tonal"
            color="error"
            class="rounded-lg mr-1"
            @click="opendialoghapus(item)"
          >
            <v-icon icon="mdi-trash-can-outline" />
            <v-tooltip activator="parent" location="top">Hapus</v-tooltip>
          </v-btn>

          <v-btn
            size="25"
            color="green"
            variant="tonal"
            :to="`/admin/master/obat/${item.id}`"
          >
            <v-icon icon="mdi-eye" />
          </v-btn>
        </div>
      </template>

      <!-- NO DATA -->
      <template v-slot:no-data>
        <div class="text-center py-6 text-grey">
          <v-icon icon="mdi-package-variant" size="40" />
          <div>Data obat tidak ditemukan</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import { useobatStores } from "~/stores/master/obatStore";
import type { obatM } from "~/types/master/obatModel";
const obatStore = useobatStores();
const supplierStore = useSuplierStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("m_obat");
  await obatStore.tarikDataObat();
});

const defaultobat = (): obatM => ({
  id_supplier: "",
  nama_supplier: "",
  nama_obat: "",
  kategori_obat: "",
  satuan: "tablet",
  stok: 0,
  stok_minimum: 0,
  harga_beli: 0,
  harga_jual: 0,
  status: "aktif",
  created_at: 0,
  created_by: "",
});

const kategoriObatList = [
  "Antibiotik",
  "Analgesik (Pereda Nyeri)",
  "Antipiretik (Penurun Demam)",
  "Antihistamin",
  "Vitamin & Suplemen",
  "Obat Batuk",
  "Obat Pencernaan",
  "Obat Kulit (Salep/Topikal)",
  "Obat Mata",
  "Obat Jantung",
];

const new_obat = ref<obatM>(defaultobat());

const data = reactive({
  search: "",
  id_obat: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,
  detailobat: {} as obatM,

  headObat: [
    {
      title: "No",
      value: "no",
      align: "center",
      width: "50px",
    },
    {
      title: "Kode Obat",
      value: "kode_obat",
      sortable: true,
    },
    {
      title: "Nama Obat",
      value: "nama_obat",
      sortable: true,
    },
    {
      title: "Kategori",
      value: "kategori_obat",
      sortable: true,
    },
    {
      title: "Stok",
      value: "stok",
      sortable: true,
    },
    {
      title: "Harga Jual",
      value: "harga_jual",
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
    return "TAMBAH OBAT";
  } else {
    return "EDIT OBAT";
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
  await supplierStore.tarikDataSuplier();
  data.addedit = "add";
  data.dialogAdd = true;
}

async function validate() {
  if (data.addedit == "add") {
    addObat();
  } else {
    saveedit();
  }
}

watch(
  () => new_obat.value.id_supplier,
  async (idsupplier) => {
    const datasupplier = supplierStore.getDataSuplier;
    const b = _.find(datasupplier, (o: any) => o.id == idsupplier);
    if (!_.isUndefined(b)) {
      new_obat.value.nama_supplier = b!.nama_supplier;
    }
  },
);

async function saveedit() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Edit",
    "Anda yakin ingin mengedit data ini?",
  );
  if (!confirmed) {
    return notificationStore.showError("edit data dibatalkan");
  }
  new_obat.value.updated_at = moment().unix();
  new_obat.value.updated_by = useUserStore().getEmail;
  await obatStore.updateMasterObat(new_obat.value, data.detailobat);
  data.dialogAdd = false;
  refreshData();
}

async function openDialogEdit(item: obatM) {
  await supplierStore.tarikDataSuplier();
  data.addedit = "edit";
  new_obat.value = _.assign({}, item);
  data.detailobat = _.assign({}, item);
  data.dialogAdd = true;
}

async function addObat() {
  if (!new_obat.value.nama_obat?.trim()) {
    return notificationStore.showError("Nama obat wajib diisi");
  }

  if (!new_obat.value.kategori_obat) {
    return notificationStore.showError("Kategori obat wajib dipilih");
  }

  if (!new_obat.value.satuan) {
    return notificationStore.showError("Satuan obat wajib dipilih");
  }

  if (!new_obat.value.bentuk_obat) {
    return notificationStore.showError("Bentuk obat wajib diisi");
  }

  if (new_obat.value.stok === null || new_obat.value.stok === undefined) {
    return notificationStore.showError("Stok wajib diisi");
  }

  if (Number(new_obat.value.stok) < 0) {
    return notificationStore.showError("Stok tidak boleh minus");
  }

  if (
    new_obat.value.stok_minimum === null ||
    new_obat.value.stok_minimum === undefined
  ) {
    return notificationStore.showError("Stok minimum wajib diisi");
  }

  if (Number(new_obat.value.stok_minimum) < 0) {
    return notificationStore.showError("Stok minimum tidak boleh minus");
  }

  if (
    new_obat.value.harga_beli === null ||
    new_obat.value.harga_beli === undefined
  ) {
    return notificationStore.showError("Harga beli wajib diisi");
  }

  if (
    new_obat.value.harga_jual === null ||
    new_obat.value.harga_jual === undefined
  ) {
    return notificationStore.showError("Harga jual wajib diisi");
  }

  if (Number(new_obat.value.harga_jual) < Number(new_obat.value.harga_beli)) {
    return notificationStore.showError(
      "Harga jual tidak boleh lebih kecil dari harga beli",
    );
  }

  if (!new_obat.value.tanggal_kadaluarsa) {
    return notificationStore.showError("Tanggal kadaluarsa wajib diisi");
  }

  if (!new_obat.value.status) {
    return notificationStore.showError("Status obat wajib dipilih");
  }

  if (!new_obat.value.id_supplier) {
    return notificationStore.showError("Supplier wajib dipilih");
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }

  try {
    new_obat.value.nama_obat = new_obat.value.nama_obat.trim();
    new_obat.value.created_at = moment().unix();
    new_obat.value.created_by = useUserStore().getEmail;

    const result = await setObat(new_obat.value);

    if (!result) {
      return notificationStore.showError("Gagal menambahkan obat");
    }

    notificationStore.showSuccess("Berhasil menambahkan obat");

    new_obat.value = defaultobat();
    await obatStore.tarikDataObat();
    data.dialogAdd = false;
    refreshData();
  } catch (error) {
    console.error(error);
    notificationStore.showError("Terjadi kesalahan saat menyimpan");
  }
}

function opendialoghapus(item: obatM) {
  data.dialoghapus = true;
  data.detailobat = item;
  data.id_obat = item.id!;
  data.nama_id = "";
}

async function hapusOBAT() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_obat == data.nama_id) {
    obatStore.deleteMasterObat(data.detailobat);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus OBAT");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_obat");
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
