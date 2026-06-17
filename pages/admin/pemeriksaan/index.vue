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
        <span class="ml-5">HAPUS DATA PEMERIKSAAN</span>
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
          <span class="text-red"> "{{ data.id_pemeriksaan }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_pemeriksaan"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_pemeriksaan || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_pemeriksaan"
          color="primary"
          variant="flat"
          @click="hapuspemeriksaan"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Main Content -->
  <v-row align="center">
    <v-col cols="11">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5"> Pemeriksaan </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="1">
      <v-btn
        size="small"
        variant="outlined"
        color="grey-darken-1"
        class="border mr-3"
        @click="refreshData"
      >
        <v-icon size="18" icon="mdi-refresh" />
        refresh
        <v-tooltip activator="parent" location="top"> Refresh Data </v-tooltip>
      </v-btn>
    </v-col>
  </v-row>

  <v-card class="mb-3">
    <v-card-text>
      <!-- HEADER -->
      <v-row align="center" justify="space-between" class="mb-2">
        <v-col cols="auto">
          <div class="text-body-1 font-weight-medium text-grey-darken-1">
            Filter Pencarian
          </div>
        </v-col>

        <v-col cols="auto">
          <v-btn
            size="small"
            color="primary"
            variant="flat"
            rounded="xl"
            @click="showFilter = !showFilter"
          >
            <v-icon>
              {{ showFilter ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider />

      <!-- CONTENT -->
      <v-expand-transition>
        <div v-show="showFilter">
          <v-row class="mt-3" align="end">
            <!-- STATUS -->
            <v-col cols="12" sm="3">
              <a-select
                v-model="filter.status"
                :items="['Semua', 'Draft', 'Diperiksa', 'Resep']"
                label="Status"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- POLI -->
            <v-col cols="12" sm="3">
              <a-select
                v-model="filter.poli"
                :items="listPoli"
                label="Poli"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>

            <!-- DOKTER -->
            <v-col cols="12" sm="3">
              <a-select
                v-model="filter.dokter"
                :items="listDokter"
                label="Dokter"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>

            <!-- TANGGAL -->
            <v-col cols="12" sm="3">
              <a-date-picker
                v-model="filter.start"
                label="Tanggal Awal"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12" sm="3">
              <a-date-picker
                v-model="filter.end"
                label="Tanggal Akhir"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- RESET -->
            <v-col cols="12" sm="3">
              <v-btn color="grey" variant="tonal" block @click="resetFilter">
                Reset Filter
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>

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
          Total: {{ pemeriksaanStore.getDataPemeriksaan.length }} Pemeriksaan
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headPemeriksaan"
      :items="filteredData"
      :search="data.search"
      density="compact"
      :items-per-page="data.itemsPerPage"
      v-model:page="data.page"
    >
      <!-- NO -->
      <!-- NO -->
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <!-- KODE RM
      <template v-slot:item.kode_rm="{ item }">
        <v-chip size="x-small" color="primary" class="font-weight-bold">
          {{ item.kode_rm }}
        </v-chip>
      </template> -->

      <!-- PASIEN -->
      <template v-slot:item.nama_pasien="{ item }">
        <span class="font-weight-medium">
          {{ item.nama_pasien }}
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

      <!-- DIAGNOSA -->
      <template v-slot:item.diagnosa="{ item }">
        <span class="text-caption">
          {{ item.diagnosa || "-" }}
        </span>
      </template>

      <!-- TANGGAL -->
      <template v-slot:item.tanggal_pemeriksaan="{ item }">
        <span class="text-caption">
          {{ item.tanggal_pemeriksaan }}
        </span>
      </template>

      <!-- STATUS -->
      <template v-slot:item.status="{ item }">
        <v-chip
          size="small"
          :color="
            {
              Draft: 'grey',
              Diperiksa: 'blue',
              Resep: 'green',
            }[item.status] || 'default'
          "
          class="text-white font-weight-medium"
          label
        >
          <v-icon start size="14">
            {{
              {
                Draft: "mdi-file-document-outline",
                Diperiksa: "mdi-stethoscope",
                Resep: "mdi-pill",
              }[item.status] || "mdi-help-circle"
            }}
          </v-icon>

          {{ item.status || "-" }}
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
            :to="`/admin/pemeriksaan/${item.id}`"
          >
            <v-icon icon="mdi-eye" />
          </v-btn>

          <v-btn size="25" color="warning" variant="tonal" class="mr-1">
            <v-icon icon="mdi-pencil" />
          </v-btn>

          <v-btn
            size="25"
            color="error"
            variant="tonal"
            @click="opendialoghapus(item.id)"
          >
            <v-icon icon="mdi-delete" />
          </v-btn>
        </div>
      </template>

      <!-- NO DATA -->
      <template v-slot:no-data>
        <div class="text-center py-6 text-grey">
          <v-icon icon="mdi-file-document-outline" size="40" />
          <div>Tidak ada data rekam medis</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import { usePemeriksaanStores } from "~/stores/pemeriksaanStore";
import type { pemeriksaanM } from "~/types/pemeriksaanModel";
const pemeriksaanStore = usePemeriksaanStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("m_pemeriksaan");
  await pemeriksaanStore.tarikDataPemeriksaan();
});

const data = reactive({
  search: "",
  id_pemeriksaan: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,

  headPemeriksaan: [
    { title: "No", value: "no", align: "center", width: "50px" },
    { title: "Kode RM", value: "id_pemeriksaan" },
    { title: "Pasien", value: "nama_pasien", sortable: true },
    { title: "Poli", value: "nama_poli" },
    { title: "Dokter", value: "nama_dokter" },
    { title: "Diagnosa", value: "diagnosa" },
    { title: "Tanggal", value: "tanggal_pemeriksaan" },
    { title: "Status", value: "status" },
    { title: "Aksi", value: "aksi", align: "center", width: "100px" },
  ],
});

const showFilter = ref(false);

const filter = reactive({
  status: "Semua",
  poli: "",
  dokter: "",
  start: "",
  end: "",
});

/* AUTO LIST */
const listPoli = computed(() => {
  const set = new Set(
    pemeriksaanStore.getDataPemeriksaan.map((i: any) => i.nama_poli),
  );
  return ["Semua", ...Array.from(set)];
});

const listDokter = computed(() => {
  const set = new Set(
    pemeriksaanStore.getDataPemeriksaan.map((i: any) => i.nama_dokter),
  );
  return ["Semua", ...Array.from(set)];
});

/* FILTER DATA */
const filteredData = computed(() => {
  return pemeriksaanStore.getDataPemeriksaan.filter((item: any) => {
    const matchStatus =
      filter.status === "Semua" || item.status === filter.status;

    const matchPoli =
      !filter.poli || filter.poli === "Semua" || item.nama_poli === filter.poli;

    const matchDokter =
      !filter.dokter ||
      filter.dokter === "Semua" ||
      item.nama_dokter === filter.dokter;

    // FILTER TANGGAL
    let matchTanggal = true;

    if (filter.start || filter.end) {
      const tgl = new Date(item.tanggal_pemeriksaan);

      if (filter.start) {
        const start = new Date(filter.start);
        start.setHours(0, 0, 0, 0);
        if (tgl < start) matchTanggal = false;
      }

      if (filter.end) {
        const end = new Date(filter.end);
        end.setHours(23, 59, 59, 999);
        if (tgl > end) matchTanggal = false;
      }
    }

    return matchStatus && matchPoli && matchDokter && matchTanggal;
  });
});

/* RESET */
function resetFilter() {
  filter.status = "Semua";
  filter.poli = "";
  filter.dokter = "";
  filter.start = "";
  filter.end = "";
  data.search = "";
}

function opendialoghapus(id_pemeriksaan: string) {
  data.dialoghapus = true;
  data.id_pemeriksaan = id_pemeriksaan;
  data.nama_id = "";
}

async function hapuspemeriksaan() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_pemeriksaan == data.nama_id) {
    pemeriksaanStore.deletePemeriksaan(data.id_pemeriksaan);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus pemeriksaan");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_Pemeriksaan_erp");
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
