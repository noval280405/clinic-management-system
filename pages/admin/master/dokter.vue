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

        <v-text-field
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
    :width="$vuetify.display.mdAndUp ? '380px' : '90%'"
  >
    <v-card class="rounded-lg">
      <v-card-title
        class="px-4 text-subtitle-1 font-weight-bold bg-primary pa-3"
      >
        {{ titleaddedit }}
      </v-card-title>

      <v-card-text>
        <!-- BASIC -->
        <div class="text-caption font-weight-bold mb-2">Informasi Utama</div>

        <a-text-field
          label="Nama Dokter"
          v-model="new_dokter.nama_dokter"
          placeholder="Nama Dokter"
          class="mb-3"
          :disabled="data.addedit == 'edit'"
        />

        <a-text-field
          label="No Dokter"
          v-model="new_dokter.no_dokter"
          placeholder="No Dokter"
          class="mb-3"
          :disabled="data.addedit == 'edit'"
        />

        <a-select
          label="Spesialis Dokter"
          v-model="new_dokter.spesialis_dokter"
          placeholder="Spesialis Dokter"
          :items="['Jantung', 'Ginjal']"
          class="mb-4"
          :disabled="data.addedit == 'edit'"
        />

        <!-- DETAIL -->
        <div class="text-caption font-weight-bold mb-2 mt-2">
          Informasi Tambahan
        </div>

        <a-text-field
          label="Nomor SIP"
          v-model="new_dokter.sip_number"
          placeholder="Nomor SIP"
          class="mb-3"
        />

        <a-text-field
          label="No HP"
          v-model="new_dokter.no_hp"
          placeholder="Nomor HP"
          class="mb-3"
        />

        <a-text-field
          label="Email"
          v-model="new_dokter.email"
          placeholder="Email Dokter"
          class="mb-4"
        />

        <v-select
          label="Status Dokter"
          v-model="new_dokter.status"
          :items="['aktif', 'nonaktif']"
          variant="outlined"
          density="comfortable"
          class="mb-4"
        />

        <!-- JADWAL -->
        <div class="text-caption font-weight-bold mb-2">Jadwal Praktik</div>

        <a-text-field
          label="Hari Praktik"
          v-model="hari_praktik_input"
          placeholder="Contoh: Senin,Selasa,Rabu"
          class="mb-3"
        />

        <v-row dense>
          <v-col cols="6">
            <v-text-field
              label="Jam Mulai"
              v-model="new_dokter.jadwal_praktik.jam_mulai"
              type="time"
              density="comfortable"
              variant="outlined"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="Jam Selesai"
              v-model="new_dokter.jadwal_praktik.jam_selesai"
              type="time"
              density="comfortable"
              variant="outlined"
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

                <v-select
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
                </v-select>
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
import type { dokterM } from "~/types/dokterModel";

definePageMeta({
  layout: "admin",
});
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
  spesialis_dokter: "",

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
      value: "spesialis_dokter",
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

function openDialogAdd() {
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
  parseHari();

  new_dokter.value.updated_at = moment().unix();
  new_dokter.value.updated_by = useUserStore().getEmail;

  await dokterstore.updateMasterDokter(new_dokter.value);

  data.dialogAdd = false;
  refreshData();
}

function openDialogEdit(item: dokterM) {
  data.addedit = "edit";
  new_dokter.value = _.assign({}, item);
  hari_praktik_input.value = item.jadwal_praktik?.hari?.join(",") || "";
  data.dialogAdd = true;
}

async function adddokter() {
  parseHari();

  new_dokter.value.created_at = moment().unix();
  new_dokter.value.created_by = useUserStore().getEmail;

  await dokterstore.addMasterDokter(new_dokter.value);

  new_dokter.value = defaultDokter();
  data.dialogAdd = false;
  refreshData();
}

function opendialoghapus(id_dokter: string) {
  data.dialoghapus = true;
  data.id_dokter = id_dokter;
  data.nama_id = "";
}

function hapusdokter() {
  if (data.id_dokter == data.nama_id) {
    dokterstore.deleteMasterDokter(data.id_dokter);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus dokter");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_dokter_erp");
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
