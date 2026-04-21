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
        <span class="ml-5">HAPUS DATA SUPLIER</span>
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
          <span class="text-red"> "{{ data.id_Suplier }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_Suplier"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_Suplier || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_Suplier"
          color="primary"
          variant="flat"
          @click="hapusSuplier"
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
        <div class="text-caption font-weight-bold mb-2">Informasi Supplier</div>

        <v-row dense>
          <v-col cols="6">
            <a-text-field
              label="Nama Supplier"
              v-model="new_Suplier.nama_supplier"
            />
          </v-col>
        </v-row>

        <!-- KONTAK -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Kontak</div>

        <v-row dense>
          <v-col cols="6">
            <a-text-field
              label="Nama Kontak"
              v-model="new_Suplier.nama_kontak"
            />
          </v-col>

          <v-col cols="6">
            <a-text-field label="No HP" v-model="new_Suplier.no_hp" />
          </v-col>

          <v-col cols="12">
            <a-text-field label="Email" v-model="new_Suplier.email" />
          </v-col>
        </v-row>

        <!-- ALAMAT -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Alamat</div>

        <v-row dense>
          <v-col cols="12">
            <a-text-field label="Alamat" v-model="new_Suplier.alamat" />
          </v-col>

          <v-col cols="6">
            <a-text-field label="Kota" v-model="new_Suplier.kota" />
          </v-col>
        </v-row>

        <!-- ADMIN -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Administrasi</div>

        <v-row dense>
          <v-col cols="12">
            <a-text-field label="NPWP" v-model="new_Suplier.npwp" />
          </v-col>
        </v-row>

        <!-- STATUS -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Status</div>

        <v-row dense>
          <v-col cols="6">
            <a-select
              label="Status"
              v-model="new_Suplier.status"
              :items="['aktif', 'nonaktif']"
            />
          </v-col>
        </v-row>

        <!-- CATATAN -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Catatan</div>

        <v-row dense>
          <v-col cols="12">
            <a-text-field label="Catatan" v-model="new_Suplier.catatan" />
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
          <span class="font-weight-medium text-h5"> Master Suplier </span>
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
        Tambah Suplier
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
          Total: {{ Suplierstore.getDataSuplier.length }} Suplier
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headSupplier"
      :items="Suplierstore.getDataSuplier"
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

      <!-- NAMA SUPPLIER -->
      <template v-slot:item.nama_supplier="{ item }">
        <v-chip
          size="small"
          color="blue-grey-lighten-5"
          class="font-weight-bold border"
        >
          {{ item.nama_supplier }}
        </v-chip>
      </template>

      <!-- KONTAK -->
      <template v-slot:item.nama_kontak="{ item }">
        <span class="text-caption">
          {{ item.nama_kontak || "-" }}
        </span>
      </template>

      <!-- NO HP -->
      <template v-slot:item.no_hp="{ item }">
        <v-chip
          v-if="item.no_hp"
          size="x-small"
          color="green"
          class="text-white"
        >
          {{ item.no_hp }}
        </v-chip>
        <span v-else class="text-grey text-caption">-</span>
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
          <v-icon icon="mdi-truck-delivery" size="40" />
          <div>Data supplier tidak tersedia</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import { useSuplierStores } from "~/stores/master/suplierStore";
import type { supplierM } from "~/types/master/suplierModel";

definePageMeta({
  layout: "admin",
});
const Suplierstore = useSuplierStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
onMounted(async () => {
  await Suplierstore.tarikDataSuplier();
  sessionStorage.removeItem("m_supplier");
});
const defaultSuplier = (): supplierM => ({
  nama_supplier: "",
  status: "aktif",
  created_at: 0,
  created_by: "",
});
const new_Suplier = ref<supplierM>(defaultSuplier());

const data = reactive({
  search: "",
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,
  id_Suplier: "",
  nama_id: "",
  dialoghapus: false,
  headSupplier: [
    {
      title: "No",
      value: "no",
      align: "center",
      width: "50px",
    },
    {
      title: "Kode Supplier",
      value: "kode_supplier",
      sortable: true,
    },
    {
      title: "Nama Supplier",
      value: "nama_supplier",
      sortable: true,
    },
    {
      title: "Kontak",
      value: "nama_kontak",
      sortable: true,
    },
    {
      title: "No HP",
      value: "no_hp",
      sortable: true,
    },
    {
      title: "Kota",
      value: "kota",
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
    return "TAMBAH SUPLIER";
  } else {
    return "EDIT SUPLIER";
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
  new_Suplier.value = defaultSuplier();

  data.dialogAdd = true;
}

async function validate() {
  if (data.addedit == "add") {
    addSuplier();
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
  new_Suplier.value.updated_at = moment().unix();
  new_Suplier.value.updated_by = useUserStore().getEmail;

  await Suplierstore.updateMasterSuplier(new_Suplier.value);

  data.dialogAdd = false;
  refreshData();
}

function openDialogEdit(item: supplierM) {
  data.addedit = "edit";
  new_Suplier.value = _.assign({}, item);
  data.dialogAdd = true;
}

async function addSuplier() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }
  
  new_Suplier.value.created_at = moment().unix();
  new_Suplier.value.created_by = useUserStore().getEmail;
  await setSupplier(new_Suplier.value);
  new_Suplier.value = defaultSuplier();
  data.dialogAdd = false;
  refreshData();
}

function opendialoghapus(id_Suplier: string) {
  data.dialoghapus = true;
  data.id_Suplier = id_Suplier;
  data.nama_id = "";
}

async function hapusSuplier() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_Suplier == data.nama_id) {
    Suplierstore.deleteMasterSuplier(data.id_Suplier);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus Suplier");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_supplier");
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
