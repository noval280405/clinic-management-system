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
    :width="$vuetify.display.mdAndUp ? '940px' : '95%'"
    transition="dialog-bottom-transition"
  >
    <!-- Main Container Card dengan Background Soft Gray Premium -->
    <v-card
      class="rounded-2xl border-none overflow-hidden pa-0"
      style="
        background-color: #f8fafc;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      "
    >
      <!-- ================= HEADER: PREMIUM SOLID BLUE GRADIENT ================= -->
      <v-card-title
        class="d-flex justify-space-between align-start pt-5 px-6 pb-4 text-white"
        style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)"
      >
        <div class="d-flex align-center ga-3">
          <div class="d-flex flex-column">
            <span
              class="text-body-1 font-weight-black text-white tracking-wide"
              style="line-height: 1; font-size: 1.5rem !important"
            >
              {{ titleaddedit }}
            </span>
          </div>
        </div>

        <v-btn
          variant="text"
          size="32"
          color="white"
          class="rounded-lg"
          style="
            background: rgba(255, 255, 255, 0.12);
            min-width: 32px;
            height: 32px;
            padding: 0;
          "
          @click="data.dialogAdd = false"
        >
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- ================= BODY: DUAL-COLUMN INDEPENDENT WHITE BOXES ================= -->
      <v-card-text class="pa-6">
        <v-row>
          <!-- === KOLOM 1: IDENTITAS PERUSAHAAN & KONTAK === -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column justify-space-between ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <!-- Sub-Blok Info Utama Vendor -->
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="blue-darken-3" size="18">mdi-domain</v-icon>
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    01. Profil Pemasok / Supplier
                  </span>
                </div>

                <a-text-field
                  label="Nama Perusahaan Supplier"
                  v-model="new_Suplier.nama_supplier"
                  placeholder="Contoh: PT. Pharmaceutica Utama"
                  prepend-inner-icon="mdi-office-building"
                  variant="outlined"
                  density="comfortable"
                />
              </div>

              <!-- Sub-Blok PIC Personel Kontak -->
              <div
                class="d-flex flex-column ga-2 mt-3 pt-2"
                style="border-top: 1px dashed #e2e8f0"
              >
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="blue-darken-3" size="18"
                    >mdi-account-box-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    02. Kontak Personel (PIC)
                  </span>
                </div>

                <v-row dense>
                  <v-col cols="12" sm="6">
                    <a-text-field
                      label="Nama Kontak PIC"
                      v-model="new_Suplier.nama_kontak"
                      placeholder="Contoh: Budi Santoso"
                      prepend-inner-icon="mdi-account-card-details-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <a-text-field
                      label="Nomor Handphone"
                      v-model="new_Suplier.no_hp"
                      placeholder="Contoh: 0812xxxxxxxx"
                      prepend-inner-icon="mdi-phone-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12">
                    <a-text-field
                      label="Alamat Email Korespondensi"
                      v-model="new_Suplier.email"
                      placeholder="Contoh: marketing@vendori.com"
                      prepend-inner-icon="mdi-email-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>

          <!-- === KOLOM 2: ALAMAT, ADMINISTRASI & STATUS === -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column justify-space-between ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <!-- Sub-Blok Alamat Operasional -->
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="blue-darken-3" size="18"
                    >mdi-map-marker-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    03. Alamat Distribusi fisik
                  </span>
                </div>

                <v-row dense>
                  <v-col cols="12">
                    <a-text-field
                      label="Alamat Lengkap Kantor/Gudang"
                      v-model="new_Suplier.alamat"
                      placeholder="Tulis nama jalan, blok, nomor ruko/gudang"
                      prepend-inner-icon="mdi-map-legend"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <a-text-field
                      label="Kota / Kabupaten"
                      v-model="new_Suplier.kota"
                      placeholder="Contoh: Jakarta Barat"
                      prepend-inner-icon="mdi-city-variant-outline"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Sub-Blok Administrasi Legal & Status -->
              <div
                class="d-flex flex-column ga-2 mt-3 pt-2"
                style="border-top: 1px dashed #e2e8f0"
              >
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="blue-darken-3" size="18"
                    >mdi-file-certificate-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    04. Regulasi Legalitas & Catatan
                  </span>
                </div>

                <v-row dense>
                  <v-col cols="12" sm="6">
                    <a-text-field
                      label="Nomor NPWP Badan Usaha"
                      v-model="new_Suplier.npwp"
                      placeholder="00.000.000.0-000.000"
                      prepend-inner-icon="mdi-card-text-outline"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <a-select
                      label="Status Kerjasama"
                      v-model="new_Suplier.status"
                      :items="['aktif', 'nonaktif']"
                      prepend-inner-icon="mdi-list-status"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12">
                    <a-text-field
                      label="Catatan Internal Tambahan"
                      v-model="new_Suplier.catatan"
                      placeholder="Tulis termin pembayaran atau informasi khusus lainnya di sini"
                      prepend-inner-icon="mdi-notebook-edit-outline"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- ================= ACTIONS: COMPACT FINTECH BUTTONS ================= -->
      <v-card-actions
        class="px-6 pb-4 pt-2 d-flex justify-end ga-2"
        style="background-color: #f1f5f9; border-top: 1px solid #e2e8f0"
      >
        <v-btn
          variant="text"
          color="grey-darken-3"
          style="
            font-weight: 700;
            border-radius: 6px;
            height: 36px;
            text-transform: none;
            letter-spacing: 0;
          "
          class="text-caption px-5"
          @click="data.dialogAdd = false"
        >
          Batal
        </v-btn>

        <v-btn
          color="blue-darken-3"
          variant="flat"
          style="
            font-weight: 700;
            border-radius: 6px;
            height: 36px;
            text-transform: none;
            letter-spacing: 0.2px;
          "
          class="text-caption px-5 text-white"
          @click="validate"
        >
          <v-icon size="14" class="mr-1.5"
            >mdi-content-save-check-outline</v-icon
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
  new_Suplier.value = defaultSuplier();
  data.addedit = "add";
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
  if (!new_Suplier.value.nama_supplier?.trim()) {
    return notificationStore.showError("Nama supplier wajib diisi");
  }

  if (!new_Suplier.value.nama_kontak?.trim()) {
    return notificationStore.showError("Nama kontak wajib diisi");
  }

  if (!new_Suplier.value.no_hp?.trim()) {
    return notificationStore.showError("Nomor HP wajib diisi");
  }

  if (!/^08\d{8,12}$/.test(new_Suplier.value.no_hp)) {
    return notificationStore.showError("Format nomor HP tidak valid");
  }

  if (new_Suplier.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(new_Suplier.value.email)) {
      return notificationStore.showError("Format email tidak valid");
    }
  }

  if (!new_Suplier.value.alamat?.trim()) {
    return notificationStore.showError("Alamat wajib diisi");
  }

  if (!new_Suplier.value.kota?.trim()) {
    return notificationStore.showError("Kota wajib diisi");
  }

  // 🔥 NPWP opsional tapi kalau diisi harus valid
  if (new_Suplier.value.npwp) {
    const npwpClean = new_Suplier.value.npwp.replace(/[^0-9]/g, "");

    if (npwpClean.length !== 15) {
      return notificationStore.showError("NPWP harus 15 digit angka");
    }
  }

  if (!new_Suplier.value.status) {
    return notificationStore.showError("Status supplier wajib dipilih");
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }

  try {
    // 🔥 bersihin data
    new_Suplier.value.nama_supplier = new_Suplier.value.nama_supplier.trim();

    new_Suplier.value.nama_kontak = new_Suplier.value.nama_kontak.trim();

    new_Suplier.value.alamat = new_Suplier.value.alamat.trim();

    new_Suplier.value.kota = new_Suplier.value.kota.trim();

    new_Suplier.value.created_at = moment().unix();
    new_Suplier.value.created_by = useUserStore().getEmail;

    const c = await setSupplier(new_Suplier.value);

    if (c) {
      notificationStore.showSuccess("Berhasil menambahkan supplier");
    } else {
      return notificationStore.showError("Gagal menambahkan supplier");
    }

    await Suplierstore.tarikDataSuplier();

    new_Suplier.value = defaultSuplier();
    data.dialogAdd = false;
    refreshData();
  } catch (error) {
    console.error(error);
    notificationStore.showError("Terjadi kesalahan saat menyimpan data");
  }
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
