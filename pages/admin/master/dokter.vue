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
        <span class="ml-5">HAPUS DATA DOKTER</span>
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
          <span class="text-red"> "{{ data.id_dokter }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_dokter"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_dokter || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_dokter"
          color="primary"
          variant="flat"
          @click="hapusdokter"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="data.dialogAdd"
    :width="$vuetify.display.mdAndUp ? '1120px' : '95%'"
    transition="dialog-bottom-transition"
  >
    <v-card
      class="rounded-2xl border-none overflow-hidden pa-0"
      style="
        background-color: #f8fafc;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      "
    >
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

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="4" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <div class="d-flex align-center ga-2 mb-2">
                <v-icon color="blue-darken-3" size="18"
                  >mdi-account-id-card</v-icon
                >
                <span
                  class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                >
                  01. Informasi Utama
                </span>
              </div>

              <a-text-field
                label="Nama Dokter"
                v-model="new_dokter.nama_dokter"
                placeholder="Masukkan nama lengkap beserta gelar"
                prepend-inner-icon="mdi-account-tie-outline"
                variant="outlined"
                density="comfortable"
                :disabled="data.addedit == 'edit'"
              />

              <a-text-field
                label="No Kode Dokter"
                v-model="new_dokter.no_dokter"
                placeholder="Contoh: DKT-001"
                prepend-inner-icon="mdi-identifier"
                variant="outlined"
                density="comfortable"
                :disabled="data.addedit == 'edit'"
              />

              <a-select
                label="Poli / Spesialis"
                v-model="new_dokter.id_poli"
                :items="poliStore.getDataPoli"
                item-title="nama_poli"
                item-value="id"
                prepend-inner-icon="mdi-hospital-building"
                variant="outlined"
                density="comfortable"
              />
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <div class="d-flex align-center ga-2 mb-2">
                <v-icon color="blue-darken-3" size="18"
                  >mdi-card-text-outline</v-icon
                >
                <span
                  class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                >
                  02. Berkas & Kontak
                </span>
              </div>

              <a-text-field
                label="Nomor SIP (Surat Izin Praktik)"
                v-model="new_dokter.sip_number"
                placeholder="Contoh: SIP.Sertifikat/2026/xxxx"
                prepend-inner-icon="mdi-file-certificate-outline"
                variant="outlined"
                density="comfortable"
              />

              <a-text-field
                label="Nomor HP Aktif"
                v-model="new_dokter.no_hp"
                placeholder="Contoh: 0812xxxxxxxx"
                prepend-inner-icon="mdi-phone-outline"
                variant="outlined"
                density="comfortable"
              />

              <a-text-field
                label="Alamat Email Resmi"
                v-model="new_dokter.email"
                placeholder="Contoh: dokter@kliniksehat.com"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                density="comfortable"
              />
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column justify-space-between ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="blue-darken-3" size="18"
                    >mdi-calendar-clock</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    03. Alokasi Jadwal Kerja
                  </span>
                </div>

                <a-text-field
                  label="Hari Kerja Praktik"
                  v-model="hari_praktik_input"
                  placeholder="Contoh: Senin, Selasa, Rabu"
                  prepend-inner-icon="mdi-calendar-range"
                  variant="outlined"
                  density="comfortable"
                />

                <v-row dense>
                  <v-col cols="6">
                    <a-text-field
                      label="Jam Mulai"
                      v-model="new_dokter.jadwal_praktik.jam_mulai"
                      type="time"
                      prepend-inner-icon="mdi-clock-start"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="6">
                    <a-text-field
                      label="Jam Selesai"
                      v-model="new_dokter.jadwal_praktik.jam_selesai"
                      type="time"
                      prepend-inner-icon="mdi-clock-end"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </div>

              <div
                class="d-flex flex-column ga-2 mt-2 pt-2"
                style="border-top: 1px dashed #e2e8f0"
              >
                <a-select
                  label="Status Aktif Dokter"
                  v-model="new_dokter.status"
                  :items="['aktif', 'nonaktif']"
                  prepend-inner-icon="mdi-list-status"
                  variant="outlined"
                  density="comfortable"
                />
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

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
          <span class="font-weight-medium text-h5"> Master Dokter </span>
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
        Tambah Dokter
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
          Total: {{ dokterstore.getDataDokter.length }} Dokter
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headdokter"
      :search="data.search"
      :items="dokterstore.getDataDokter"
      density="compact"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      :hover="true"
      :items-per-page="data.itemsPerPage"
      v-model:page="data.page"
    >
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <template v-slot:item.nama_dokter="{ item }">
        <v-chip
          size="small"
          variant="flat"
          color="blue-grey-lighten-5"
          class="text-blue-grey-darken-3 font-weight-bold border"
        >
          <v-avatar start color="blue-grey-darken-1" size="18">
            <span class="text-white" style="font-size: 8px">
              {{ (item.nama_dokter || "-").substring(0, 1).toUpperCase() }}
            </span>
          </v-avatar>

          {{ (item.nama_dokter || "-").toUpperCase() }}
        </v-chip>
      </template>

      <template v-slot:item.no_dokter="{ item }">
        <v-chip
          v-if="item.no_dokter"
          size="x-small"
          variant="outlined"
          color="success"
          prepend-icon="mdi-phone"
          class="font-weight-medium"
        >
          {{ item.no_dokter }}
        </v-chip>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

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
            class="rounded-lg"
            @click="opendialoghapus(item)"
          >
            <v-icon icon="mdi-trash-can-outline" />
            <v-tooltip activator="parent" location="top">Hapus</v-tooltip>
          </v-btn>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="py-8 text-center text-grey-darken-1">
          <v-icon
            size="48"
            color="grey-lighten-1"
            class="mb-2"
            icon="mdi-domain"
          />

          <div class="text-body-1">Tidak ada data dokter</div>
        </div>
      </template>

      <template v-slot:bottom>
        <v-divider />

        <div class="bg-grey-lighten-5 px-4 py-2">
          <v-row no-gutters align="center">
            <v-col
              cols="12"
              md="8"
              class="d-flex align-center flex-wrap"
              style="gap: 8px"
            >
              <div
                class="d-flex align-center bg-white border rounded-lg px-3 py-1 shadow-sm mr-2"
              >
                <v-icon
                  size="16"
                  color="primary"
                  icon="mdi-database-outline"
                  class="mr-2"
                />
                <span class="text-caption font-weight-medium">
                  <span class="text-grey">Menampilkan</span>
                  <strong class="text-primary ml-1">
                    {{ (data.page - 1) * data.itemsPerPage + 1 }}-{{
                      Math.min(
                        data.page * data.itemsPerPage,
                        dokterstore.getDataDokter.length,
                      )
                    }}
                  </strong>
                  <span class="text-grey mx-1">/</span>
                  <strong>{{ dokterstore.getDataDokter.length }}</strong>
                  <span class="text-grey mx-1">Data</span>
                </span>
              </div>
            </v-col>

            <v-col
              cols="12"
              md="4"
              class="d-flex justify-md-end justify-center mt-2 mt-md-0"
            >
              <div
                class="d-flex align-center bg-white border rounded-lg px-3 py-0"
                style="min-width: 140px; height: 32px"
              >
                <v-icon
                  size="14"
                  color="grey"
                  icon="mdi-layers-outline"
                  class="mr-2"
                />
                <span
                  class="text-caption text-grey-darken-1 mr-2"
                  style="white-space: nowrap"
                  >Tampilkan:</span
                >

                <a-select
                  v-model="data.itemsPerPage"
                  :items="[
                    { title: '10', value: 10 },
                    { title: '25', value: 25 },
                    { title: '50', value: 50 },
                    { title: 'Semua', value: -1 },
                  ]"
                  variant="plain"
                  density="compact"
                  hide-details
                  class="mt-n2"
                  @update:model-value="data.page = 1"
                >
                  <template v-slot:selection="{ item }">
                    <span class="text-caption font-weight-black text-primary">{{
                      item.title
                    }}</span>
                  </template>
                </a-select>
              </div>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import type { dokterM } from "~/types/master/dokterModel";

definePageMeta({
  layout: "admin",
});
const poliStore = usePoliStores();
const dokterstore = useDokterStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
onMounted(async () => {
  await dokterstore.tarikDataDokter();
  sessionStorage.removeItem("m_dokter");
});
const hari_praktik_input = ref("");
const defaultDokter = (): dokterM => ({
  nama_dokter: "",
  no_dokter: "",
  sip_number: "",
  no_hp: "",
  email: "",
  status: "aktif",
  jadwal_praktik: {
    hari: [],
    jam_mulai: "",
    jam_selesai: "",
  },
  created_at: 0,
  created_by: "",
});
const new_dokter = ref<dokterM>(defaultDokter());

const data = reactive({
  search: "",
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,
  id_dokter: "",
  nama_id: "",
  dialoghapus: false,
  detaildokter: {} as dokterM,
  headdokter: [
    {
      title: "No",
      align: "center" as const,
      value: "no",
      width: "50px", // Tetapkan lebar kecil karena nomor pasti pendek
    },
    {
      title: "Nama Dokter",
      value: "nama_dokter",
      sortable: true,
    },
    {
      title: "Spesialis Dokter",
      value: "nama_poli",
      sortable: true,
    },
    {
      title: "No Dokter",
      value: "no_dokter",
      sortable: true,
    },
    {
      title: "Aksi",
      align: "center" as const,
      value: "aksi",
      width: "50px",
    },
  ],
});

watch(
  () => new_dokter.value.id_poli,
  (id) => {
    const poli = poliStore.getDataPoli.find((p) => p.id === id);
    if (poli) {
      new_dokter.value.nama_poli = poli.nama_poli;
    }
  },
);

const titleaddedit = computed(() => {
  if (data.addedit == "add") {
    return "TAMBAH DOKTER";
  } else {
    return "EDIT DOKTER";
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
  await poliStore.tarikDataPoli();
  data.addedit = "add";
  new_dokter.value = defaultDokter();
  data.dialogAdd = true;
}

async function validate() {
  if (data.addedit == "add") {
    adddokter();
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
  parseHari();
  new_dokter.value.updated_at = moment().unix();
  new_dokter.value.updated_by = useUserStore().getEmail;

  await dokterstore.updateMasterDokter(new_dokter.value, data.detaildokter);

  data.dialogAdd = false;
  refreshData();
}

async function openDialogEdit(item: dokterM) {
  await poliStore.tarikDataPoli();
  data.addedit = "edit";
  new_dokter.value = _.assign({}, item);
  data.detaildokter = _.assign({}, item);
  hari_praktik_input.value = item.jadwal_praktik?.hari?.join(",") || "";
  data.dialogAdd = true;
}
async function adddokter() {
  if (!new_dokter.value.nama_dokter?.trim()) {
    return notificationStore.showError("Nama dokter wajib diisi");
  }

  if (!new_dokter.value.no_dokter?.trim()) {
    return notificationStore.showError("No dokter wajib diisi");
  }

  if (!new_dokter.value.id_poli) {
    return notificationStore.showError("Poli / spesialis wajib dipilih");
  }

  if (!new_dokter.value.sip_number?.trim()) {
    return notificationStore.showError("Nomor SIP wajib diisi");
  }

  if (!new_dokter.value.no_hp?.trim()) {
    return notificationStore.showError("Nomor HP wajib diisi");
  }

  if (!new_dokter.value.email?.trim()) {
    return notificationStore.showError("Email wajib diisi");
  }

  // VALIDASI EMAIL SIMPLE
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(new_dokter.value.email)) {
    return notificationStore.showError("Format email tidak valid");
  }

  if (!new_dokter.value.status) {
    return notificationStore.showError("Status dokter wajib dipilih");
  }

  if (!hari_praktik_input.value?.trim()) {
    return notificationStore.showError("Hari praktik wajib diisi");
  }

  if (!new_dokter.value.jadwal_praktik?.jam_mulai) {
    return notificationStore.showError("Jam mulai wajib diisi");
  }

  if (!new_dokter.value.jadwal_praktik?.jam_selesai) {
    return notificationStore.showError("Jam selesai wajib diisi");
  }

  // VALIDASI JAM
  if (
    new_dokter.value.jadwal_praktik.jam_selesai <=
    new_dokter.value.jadwal_praktik.jam_mulai
  ) {
    return notificationStore.showError(
      "Jam selesai harus lebih dari jam mulai",
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
    parseHari();
    new_dokter.value.nama_dokter = new_dokter.value.nama_dokter.trim();
    new_dokter.value.created_at = moment().unix();
    new_dokter.value.created_by = useUserStore().getEmail;
    await dokterstore.addMasterDokter(new_dokter.value);
    notificationStore.showSuccess("Berhasil menambahkan dokter");

    new_dokter.value = defaultDokter();
    data.dialogAdd = false;
    refreshData();
  } catch (error) {
    console.error(error);
    notificationStore.showError("Gagal menambahkan dokter");
  }
}

function opendialoghapus(item: dokterM) {
  data.dialoghapus = true;
  data.detaildokter = item;
  data.id_dokter = item.id!;
  data.nama_id = "";
}

async function hapusdokter() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_dokter == data.nama_id) {
    dokterstore.deleteMasterDokter(data.detaildokter);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus dokter");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_dokter");
  useloadingStore().setLoading(false);
}

function parseHari() {
  new_dokter.value.jadwal_praktik.hari = hari_praktik_input.value
    .split(",")
    .map((h) => h.trim())
    .filter((h) => h);
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
