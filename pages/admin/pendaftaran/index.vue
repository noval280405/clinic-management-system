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
        <span class="ml-5">HAPUS DATA PENDAFTARAN</span>
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
          <span class="text-red"> "{{ data.id_pendaftaran }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_pendaftaran"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_pendaftaran || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_pendaftaran"
          color="primary"
          variant="flat"
          @click="hapuspendaftaran"
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
        <!-- PASIEN -->
        <div class="text-caption font-weight-bold mb-2">Data Pasien</div>

        <v-row dense>
          <v-col cols="12">
            <a-autocomplete
              label="Pilih Pasien"
              v-model="new_pendaftaran.id_pasien"
              :items="pasienStore.getDataPasien"
              item-title="nama_pasien"
              item-value="id"
              clearable
            />
          </v-col>

          <!-- INFO PASIEN AUTO -->
          <v-col cols="12" v-if="selectedPasien">
            <v-alert type="info" variant="tonal" density="compact">
              <div class="text-caption">
                {{ selectedPasien.nama_pasien }} •
                {{ selectedPasien.jenis_kelamin }} •
                {{ selectedPasien.no_hp || "-" }}
              </div>
            </v-alert>
          </v-col>
        </v-row>

        <!-- POLI & DOKTER -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Poli & Dokter</div>

        <v-row dense>
          <v-col cols="6">
            <a-select
              label="Poli"
              v-model="new_pendaftaran.id_poli"
              :items="poliStore.getDataPoli"
              item-title="nama_poli"
              item-value="id"
              clearable
            />
          </v-col>

          <v-col cols="6">
            <a-select
              label="Dokter"
              v-model="new_pendaftaran.id_dokter"
              :items="dokterStore.getDataDokter"
              item-title="nama_dokter"
              item-value="id"
              clearable
            />
          </v-col>
        </v-row>

        <!-- INFO ANTRIAN -->
        <div class="text-caption font-weight-bold mb-2 mt-4">
          Informasi Antrian
        </div>

        <v-row dense>
          <!-- <v-col cols="6">
            <a-text-field
              label="Nomor Antrian"
              v-model="new_pendaftaran.nomor_antrian"
              readonly
            />
          </v-col> -->

          <v-col cols="6">
            <a-date-picker
              label="Tanggal Kunjungan"
              v-model="new_pendaftaran.tanggal_kunjungan"
            />
          </v-col>
        </v-row>

        <!-- ADMINISTRASI -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Administrasi</div>

        <v-row dense>
          <v-col cols="6">
            <a-select
              label="Jenis Pasien"
              v-model="new_pendaftaran.jenis_pasien"
              :items="['umum', 'bpjs', 'asuransi']"
            />
          </v-col>

          <v-col cols="6" v-if="new_pendaftaran.jenis_pasien === 'bpjs'">
            <a-text-field label="No BPJS" v-model="new_pendaftaran.no_bpjs" />
          </v-col>
        </v-row>

        <!-- KELUHAN -->
        <div class="text-caption font-weight-bold mb-2 mt-4">Keluhan Awal</div>

        <v-row dense>
          <v-col cols="12">
            <a-text-field
              label="Keluhan Pasien"
              v-model="new_pendaftaran.keluhan"
              placeholder="Contoh: Demam, batuk, dll"
            />
          </v-col>
        </v-row>

        <!-- STATUS -->
        <!-- <div class="text-caption font-weight-bold mb-2 mt-4">Status</div> -->

        <!-- <v-row dense>
          <v-col cols="6">
            <a-select
              label="Status"
              v-model="new_pendaftaran.status"
              :items="['menunggu', 'diproses', 'selesai', 'batal']"
            />
          </v-col>
        </v-row> -->
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
          <span class="font-weight-medium text-h5">Pendaftaran </span>
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
        Tambah Pendaftaran
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
          Total: {{ pendaftaranStore.getDataPendaftaran.length }} Pendaftaran
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headPendaftaran"
      :items="pendaftaranStore.getDataPendaftaran"
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

      <!-- ANTRIAN -->
      <template v-slot:item.nomor_antrian="{ item }">
        <v-chip color="primary" size="small" class="font-weight-bold">
          {{ item.nomor_antrian }}
        </v-chip>
      </template>

      <!-- PASIEN -->
      <template v-slot:item.nama_pasien="{ item }">
        <span class="font-weight-medium">
          {{ item.nama_pasien || "-" }}
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

      <!-- STATUS -->
      <template v-slot:item.status="{ item }">
        <v-chip
          size="x-small"
          :color="
            item.status === 'menunggu'
              ? 'orange'
              : item.status === 'diproses'
                ? 'blue'
                : item.status === 'selesai'
                  ? 'green'
                  : 'grey'
          "
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
            :to="'/admin/pendaftaran/' + item.id"
          >
            <v-icon icon="mdi-eye" />
          </v-btn>

          <!-- <v-btn
            size="25"
            color="error"
            variant="tonal"
            @click="opendialoghapus(item.id!)"
            class="mr-1"
          >
            <v-icon icon="mdi-delete" />
          </v-btn> -->
        </div>
      </template>

      <!-- NO DATA -->
      <template v-slot:no-data>
        <div class="text-center py-6 text-grey">
          <v-icon icon="mdi-account-clock-outline" size="40" />
          <div>Tidak ada antrian pasien</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import { usePendaftaranStores } from "~/stores/pendaftaranStore";
import type { pendaftaranM } from "~/types/pendaftaranModel";
const pasienStore = usePasienStores();
const poliStore = usePoliStores();
const dokterStore = useDokterStores();
const pendaftaranStore = usePendaftaranStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("m_pendaftaran");
  await pendaftaranStore.tarikDataPendaftaran();
});

const defaultPendaftaran = (): pendaftaranM => ({
  id_pasien: "",
  id_dokter: "",
  id_poli: "",
  nama_pasien: "",
  nama_dokter: "",
  nama_poli: "",
  tanggal_kunjungan: "",
  status: "menunggu",
  created_at: 0,
  created_by: "",
});

const new_pendaftaran = ref<pendaftaranM>(defaultPendaftaran());

const data = reactive({
  search: "",
  id_pendaftaran: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,

  headPendaftaran: [
    {
      title: "No",
      value: "no",
      align: "center",
      width: "50px",
    },
    {
      title: "Antrian",
      value: "no_antrian",
      sortable: true,
    },
    {
      title: "Pasien",
      value: "nama_pasien",
      sortable: true,
    },
    {
      title: "Poli",
      value: "nama_poli",
      sortable: true,
    },
    {
      title: "Dokter",
      value: "nama_dokter",
      sortable: true,
    },
    {
      title: "Status",
      value: "status",
      sortable: true,
    },
    {
      title: "Tanggal",
      value: "tanggal_kunjungan",
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

watch(
  () => new_pendaftaran.value.id_pasien,
  async (idpasien) => {
    const datapasien = pasienStore.getDataPasien;
    const b = _.find(datapasien, (o: any) => o.id == idpasien);
    if (!_.isUndefined(b)) {
      new_pendaftaran.value.nama_pasien = b!.nama_pasien;
    }
  },
);

watch(
  () => new_pendaftaran.value.id_poli,
  async (idpoli) => {
    const datapoli = poliStore.getDataPoli;
    const b = _.find(datapoli, (o: any) => o.id == idpoli);
    if (!_.isUndefined(b)) {
      new_pendaftaran.value.nama_poli = b!.nama_poli;
      await dokterStore.tarikDataDokterByPoli(b.id!);
    }
  },
);

watch(
  () => new_pendaftaran.value.id_dokter,
  async (iddokter) => {
    const datadokter = dokterStore.getDataDokter;
    const b = _.find(datadokter, (o: any) => o.id == iddokter);
    if (!_.isUndefined(b)) {
      new_pendaftaran.value.nama_dokter = b!.nama_dokter;
    }
  },
);

const selectedPasien = computed(() =>
  pasienStore.getDataPasien.find(
    (p) => p.id === new_pendaftaran.value.id_pasien,
  ),
);

const titleaddedit = computed(() => {
  if (data.addedit == "add") {
    return "TAMBAH PENDAFTARAN";
  } else {
    return "EDIT PENDAFTARAN";
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
  await pasienStore.tarikDataPasien();
  await poliStore.tarikDataPoli();
  await dokterStore.tarikDataDokter();
  new_pendaftaran.value = defaultPendaftaran();
  data.addedit = "add";
  data.dialogAdd = true;
}

async function validate() {
  if (data.addedit == "add") {
    addPendaftaran();
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
  new_pendaftaran.value.updated_at = moment().unix();
  new_pendaftaran.value.updated_by = useUserStore().getEmail;
  const c = await updatePendaftaran(new_pendaftaran.value);
  if (c == "ok") {
    notificationStore.showSuccess("Data pendaftaran berhasil diedit");
  } else {
    notificationStore.showError("Gagal mengedit data pendaftaran");
    return;
  }
  data.dialogAdd = false;
  refreshData();
}

function openDialogEdit(item: pendaftaranM) {
  data.addedit = "edit";
  new_pendaftaran.value = _.assign({}, item);
  data.dialogAdd = true;
}

async function addPendaftaran() {
  if (!new_pendaftaran.value.id_pasien) {
    return notificationStore.showError("Pasien wajib dipilih");
  }

  if (!new_pendaftaran.value.id_poli) {
    return notificationStore.showError("Poli wajib dipilih");
  }

  if (!new_pendaftaran.value.id_dokter) {
    return notificationStore.showError("Dokter wajib dipilih");
  }

  if (!new_pendaftaran.value.tanggal_kunjungan) {
    return notificationStore.showError("Tanggal kunjungan wajib diisi");
  }

  if (!new_pendaftaran.value.jenis_pasien) {
    return notificationStore.showError("Jenis pasien wajib dipilih");
  }

  if (
    new_pendaftaran.value.jenis_pasien === "bpjs" &&
    !new_pendaftaran.value.no_bpjs
  ) {
    return notificationStore.showError("No BPJS wajib diisi");
  }

  if (!new_pendaftaran.value.keluhan) {
    return notificationStore.showError("Keluhan pasien wajib diisi");
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }

  new_pendaftaran.value.created_at = moment().unix();
  new_pendaftaran.value.created_by = useUserStore().getEmail;

  const c = await setPendaftaran(new_pendaftaran.value);

  if (c == "ok") {
    notificationStore.showSuccess("Data pendaftaran berhasil ditambahkan");
  } else {
    notificationStore.showError("Gagal menambahkan data pendaftaran");
    return;
  }

  await pendaftaranStore.tarikDataPendaftaran();
  data.dialogAdd = false;
  refreshData();
}
function opendialoghapus(id_pendaftaran: string) {
  data.dialoghapus = true;
  data.id_pendaftaran = id_pendaftaran;
  data.nama_id = "";
}

async function hapuspendaftaran() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_pendaftaran == data.nama_id) {
    await deletePendaftaran(data.id_pendaftaran);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus pendaftaran");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_Pendaftaran_erp");
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
