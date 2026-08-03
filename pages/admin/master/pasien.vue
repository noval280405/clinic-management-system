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
        <span class="ml-5">HAPUS DATA PASIEN</span>
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
          <span class="text-red"> "{{ data.id_pasien }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_pasien"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_pasien || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_pasien"
          color="primary"
          variant="flat"
          @click="hapuspasien"
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
                  >mdi-card-account-details</v-icon
                >
                <span
                  class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                >
                  01. Identitas Utama
                </span>
              </div>

              <a-text-field
                label="Nomor NIK (KTP)"
                v-model="new_pasien.nik"
                prepend-inner-icon="mdi-fingerprint"
                variant="outlined"
                density="comfortable"
              />
              <a-text-field
                label="Nama Lengkap Pasien"
                v-model="new_pasien.nama_pasien"
                prepend-inner-icon="mdi-account-box-outline"
                variant="outlined"
                density="comfortable"
              />
              <a-select
                label="Jenis Kelamin"
                v-model="new_pasien.jenis_kelamin"
                :items="['Laki-laki', 'Perempuan']"
                prepend-inner-icon="mdi-gender-male-female"
                variant="outlined"
                density="comfortable"
              />
              <a-date-picker
                label="Tanggal Lahir"
                v-model="new_pasien.tanggal_lahir"
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
                <div class="d-flex align-center ga-2 mb-1">
                  <v-icon color="blue-darken-3" size="18"
                    >mdi-text-box-search-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    02. Kontak & Alamat
                  </span>
                </div>
                <a-text-field
                  label="Nomor HP Aktif"
                  v-model="new_pasien.no_hp"
                  prepend-inner-icon="mdi-phone-outline"
                  variant="outlined"
                  density="comfortable"
                />
                <a-text-field
                  label="Alamat Email"
                  v-model="new_pasien.email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  density="comfortable"
                />
                <a-text-field
                  label="Alamat Domisili Lengkap"
                  v-model="new_pasien.alamat"
                  prepend-inner-icon="mdi-map-marker-outline"
                  variant="outlined"
                  density="comfortable"
                />
              </div>

              <div class="d-flex flex-column ga-2 mt-3">
                <div
                  class="d-flex align-center ga-2 mb-1 pt-2"
                  style="border-top: 1px dashed #e2e8f0"
                >
                  <v-icon color="blue-darken-3" size="17"
                    >mdi-shield-check-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                    style="font-size: 11px"
                  >
                    03. Penjaminan
                  </span>
                </div>
                <a-select
                  label="Kategori Jenis Pasien"
                  v-model="new_pasien.jenis_pasien"
                  :items="['umum', 'bpjs', 'asuransi']"
                  prepend-inner-icon="mdi-badge-account-horizontal-outline"
                  variant="outlined"
                  density="comfortable"
                />
                <a-text-field
                  v-if="new_pasien.jenis_pasien === 'bpjs'"
                  label="Nomor Kartu BPJS Kesehatan"
                  v-model="new_pasien.no_bpjs"
                  prepend-inner-icon="mdi-credit-card-chip-outline"
                  variant="outlined"
                  density="comfortable"
                />
                <a-text-field
                  v-if="new_pasien.jenis_pasien === 'asuransi'"
                  label="Nomor Polis Asuransi Swasta"
                  v-model="new_pasien.no_asuransi"
                  prepend-inner-icon="mdi-credit-card-chip-outline"
                  variant="outlined"
                  density="comfortable"
                />
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column justify-space-between ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center ga-2 mb-1">
                  <v-icon color="blue-darken-3" size="18"
                    >mdi-heart-pulse</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    04. Informasi Medis
                  </span>
                </div>
                <div class="d-flex ga-2">
                  <a-select
                    label="Gol. Darah"
                    v-model="new_pasien.golongan_darah"
                    :items="['A', 'B', 'AB', 'O']"
                    prepend-inner-icon="mdi-water-outline"
                    variant="outlined"
                    density="comfortable"
                    style="width: 105px; flex-grow: 0"
                  />
                  <a-text-field
                    label="Alergi Obat/Makanan"
                    v-model="new_pasien.alergi"
                    placeholder="Tulis nihil jika tidak ada"
                    prepend-inner-icon="mdi-alert-octagon-outline"
                    variant="outlined"
                    density="comfortable"
                    style="flex-grow: 1"
                  />
                </div>
                <a-text-field
                  label="Catatan Penyakit Terdahulu"
                  v-model="new_pasien.riwayat_penyakit"
                  prepend-inner-icon="mdi-file-medical-outline"
                  variant="outlined"
                  density="comfortable"
                />
              </div>

              <div class="d-flex flex-column ga-2 mt-3">
                <div
                  class="d-flex align-center ga-2 mb-1 pt-2"
                  style="border-top: 1px dashed #e2e8f0"
                >
                  <v-icon color="blue-darken-3" size="17"
                    >mdi-account-supervisor-circle-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                    style="font-size: 11px"
                  >
                    05. Kontrol Darurat & Status
                  </span>
                </div>
                <div class="d-flex ga-2">
                  <a-text-field
                    label="Nama Wali"
                    v-model="new_pasien.nama_penanggung_jawab"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    density="comfortable"
                  />
                  <a-text-field
                    label="Hubungan"
                    v-model="new_pasien.hubungan_penanggung"
                    prepend-inner-icon="mdi-account-heart-outline"
                    variant="outlined"
                    density="comfortable"
                    style="width: 130px; flex-grow: 0"
                  />
                </div>
                <a-text-field
                  label="No HP Wali"
                  v-model="new_pasien.no_hp_penanggung"
                  prepend-inner-icon="mdi-phone-alert-outline"
                  variant="outlined"
                  density="comfortable"
                />

                <a-select
                  label="Status Akun Sistem"
                  v-model="new_pasien.status"
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
          <span class="font-weight-medium text-h5"> Master Pasien </span>
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
        Tambah Pasien
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
          Total: {{ pasienStore.getDataPasien.length }} Pasien
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headPasien"
      :search="data.search"
      :items="pasienStore.getDataPasien"
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

      <template v-slot:item.nama_pasien="{ item }">
        <v-chip
          size="small"
          variant="flat"
          color="blue-grey-lighten-5"
          class="text-blue-grey-darken-3 font-weight-bold border"
        >
          <v-avatar start color="blue-grey-darken-1" size="18">
            <span class="text-white" style="font-size: 8px">
              {{ (item.nama_pasien || "-").substring(0, 1).toUpperCase() }}
            </span>
          </v-avatar>

          {{ (item.nama_pasien || "-").toUpperCase() }}
        </v-chip>
      </template>

      <template v-slot:item.no_hp="{ item }">
        <v-chip
          v-if="item.no_hp"
          size="x-small"
          variant="outlined"
          color="success"
          prepend-icon="mdi-phone"
          class="font-weight-medium"
        >
          {{ item.no_hp }}
        </v-chip>

        <span v-else class="text-caption text-grey-lighten-1 font-italic">
          Tidak ada data
        </span>
      </template>

      <template v-slot:item.no_rm="{ item }">
        <v-chip
          size="x-small"
          variant="outlined"
          color="primary"
          class="font-weight-bold"
        >
          {{ item.no_rm || "-" }}
        </v-chip>
      </template>

      <template v-slot:item.jenis_pasien="{ item }">
        <v-chip
          size="x-small"
          :color="
            item.jenis_pasien === 'bpjs'
              ? 'green'
              : item.jenis_pasien === 'asuransi'
                ? 'blue'
                : 'grey'
          "
          variant="flat"
          class="text-white text-uppercase"
        >
          {{ item.jenis_pasien }}
        </v-chip>
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
            @click="opendialoghapus(item.id!)"
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

          <div class="text-body-1">Tidak ada data Pasien</div>
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
                        pasienStore.getDataPasien.length,
                      )
                    }}
                  </strong>
                  <span class="text-grey mx-1">/</span>
                  <strong>{{ pasienStore.getDataPasien.length }}</strong>
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
import { usePasienStores } from "~/stores/master/pasienStore";
import type { pasienM } from "~/types/master/pasienModel";
const pasienStore = usePasienStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("m_pasien");
  await pasienStore.tarikDataPasien();
});

const defaultPasien = (): pasienM => ({
  nik: "",
  nama_pasien: "",
  jenis_kelamin: "L",
  tanggal_lahir: "",

  no_hp: "",
  email: "",
  alamat: "",

  jenis_pasien: "umum",
  no_bpjs: "",
  no_asuransi: "",

  golongan_darah: "O",
  alergi: "",
  riwayat_penyakit: "",

  nama_penanggung_jawab: "",
  hubungan_penanggung: "",
  no_hp_penanggung: "",

  status: "aktif",

  created_at: 0,
  created_by: "",
});

const new_pasien = ref<pasienM>(defaultPasien());

const data = reactive({
  search: "",
  id_pasien: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,

  headPasien: [
    {
      title: "No",
      align: "center" as const,
      value: "no",
      width: "50px",
    },
    {
      title: "Nama Pasien",
      value: "nama_pasien",
      sortable: true,
    },
    {
      title: "No RM",
      value: "no_rm",
      sortable: true,
    },
    {
      title: "No HP",
      value: "no_hp",
      sortable: true,
    },
    {
      title: "Jenis",
      value: "jenis_pasien",
      sortable: true,
    },
    {
      title: "Aksi",
      align: "center" as const,
      value: "aksi",
      width: "80px",
    },
  ],
});

const titleaddedit = computed(() => {
  if (data.addedit == "add") {
    return "TAMBAH PASIEN";
  } else {
    return "EDIT PASIEN";
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
  new_pasien.value = defaultPasien();
  data.addedit = "add";
  data.dialogAdd = true;
}

async function validate() {
  if (data.addedit == "add") {
    addPasien();
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
  new_pasien.value.updated_at = moment().unix();
  new_pasien.value.updated_by = useUserStore().getEmail;
  await pasienStore.updateMasterPasien(new_pasien.value);
  data.dialogAdd = false;
  refreshData();
}

function openDialogEdit(item: pasienM) {
  data.addedit = "edit";
  new_pasien.value = _.assign({}, item);
  data.dialogAdd = true;
}

async function addPasien() {
  if (!new_pasien.value.nik?.trim()) {
    return notificationStore.showError("NIK wajib diisi");
  }

  if (!/^\d{16}$/.test(new_pasien.value.nik)) {
    return notificationStore.showError("NIK harus 16 digit angka");
  }

  if (!new_pasien.value.nama_pasien?.trim()) {
    return notificationStore.showError("Nama pasien wajib diisi");
  }

  if (!new_pasien.value.jenis_kelamin) {
    return notificationStore.showError("Jenis kelamin wajib dipilih");
  }

  if (!new_pasien.value.tanggal_lahir) {
    return notificationStore.showError("Tanggal lahir wajib diisi");
  }

  const today = new Date();
  const tglLahir = new Date(new_pasien.value.tanggal_lahir);

  if (tglLahir > today) {
    return notificationStore.showError("Tanggal lahir tidak valid");
  }

  if (!new_pasien.value.no_hp?.trim()) {
    return notificationStore.showError("Nomor HP wajib diisi");
  }

  if (!/^08\d{8,12}$/.test(new_pasien.value.no_hp)) {
    return notificationStore.showError("Format nomor HP tidak valid");
  }

  if (new_pasien.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(new_pasien.value.email)) {
      return notificationStore.showError("Format email tidak valid");
    }
  }

  if (!new_pasien.value.alamat?.trim()) {
    return notificationStore.showError("Alamat wajib diisi");
  }

  if (!new_pasien.value.jenis_pasien) {
    return notificationStore.showError("Jenis pasien wajib dipilih");
  }

  if (new_pasien.value.jenis_pasien === "bpjs") {
    if (!new_pasien.value.no_bpjs?.trim()) {
      return notificationStore.showError("Nomor BPJS wajib diisi");
    }

    if (!/^\d{13}$/.test(new_pasien.value.no_bpjs)) {
      return notificationStore.showError("Nomor BPJS harus 13 digit");
    }
  }

  if (new_pasien.value.jenis_pasien === "asuransi") {
    if (!new_pasien.value.no_asuransi?.trim()) {
      return notificationStore.showError("Nomor asuransi wajib diisi");
    }
  }

  if (new_pasien.value.no_hp_penanggung) {
    if (!/^08\d{8,12}$/.test(new_pasien.value.no_hp_penanggung)) {
      return notificationStore.showError(
        "Format nomor HP penanggung tidak valid",
      );
    }
  }

  if (!new_pasien.value.status) {
    return notificationStore.showError("Status pasien wajib dipilih");
  }

  // 🔥 VALIDASI DUPLIKAT
  const existingPasien = pasienStore.getDataPasien;

  // cek NIK sama
  const nikExist = existingPasien.find(
    (p: any) => p.nik === new_pasien.value.nik,
  );

  if (nikExist) {
    return notificationStore.showError(
      `NIK sudah terdaftar atas nama ${nikExist.nama_pasien}`,
    );
  }

  // cek nama + NIK sama
  const sameData = existingPasien.find(
    (p: any) =>
      p.nik === new_pasien.value.nik &&
      p.nama_pasien.toLowerCase() ===
        new_pasien.value.nama_pasien.toLowerCase(),
  );

  if (sameData) {
    return notificationStore.showError(
      `Pasien ${new_pasien.value.nama_pasien} dengan NIK tersebut sudah ada`,
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
    new_pasien.value.nama_pasien = new_pasien.value.nama_pasien.trim();

    new_pasien.value.alamat = new_pasien.value.alamat.trim();

    new_pasien.value.created_at = moment().unix();
    new_pasien.value.created_by = useUserStore().getEmail;

    console.log("DATA PASIEN BARU", new_pasien.value);

    const c = await setPasien(new_pasien.value);

    if (c == "ok") {
      notificationStore.showSuccess("Data pasien berhasil ditambahkan");
    } else {
      return notificationStore.showError("Gagal menambahkan data pasien");
    }

    await pasienStore.tarikDataPasien();

    new_pasien.value = defaultPasien();
    data.dialogAdd = false;
    refreshData();
  } catch (error) {
    console.error(error);
    notificationStore.showError("Terjadi kesalahan saat menyimpan data");
  }
}

function opendialoghapus(id_pasien: string) {
  data.dialoghapus = true;
  data.id_pasien = id_pasien;
  data.nama_id = "";
}

async function hapuspasien() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_pasien == data.nama_id) {
    pasienStore.deleteMasterPasien(data.id_pasien);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus pasien");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_pasien");
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
