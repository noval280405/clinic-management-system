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
        <span class="ml-5">HAPUS DATA RESEP</span>
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
          <span class="text-red"> "{{ data.id_resep }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_resep"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_resep || 'ID tidak cocok',
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
          :disabled="data.nama_id != data.id_resep"
          color="primary"
          variant="flat"
          @click="hapusresep"
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
          <span class="font-weight-medium text-h5"> Resep Obat</span>
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
              <v-select
                v-model="filter.status"
                :items="['Semua', 'Antrian', 'Diproses', 'Selesai']"
                label="Status"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- POLI -->
            <v-col cols="12" sm="3">
              <v-select
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
              <v-select
                v-model="filter.dokter"
                :items="listDokter"
                label="Dokter"
                variant="outlined"
                density="comfortable"
                clearable
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
          Total: {{ resepStore.getDataResepObat.length }} resep
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headresep"
      :items="filteredData"
      :search="data.search"
      density="compact"
      class="text-caption"
    >
      <!-- NO -->
      <template v-slot:item.no="{ index }">
        <span class="text-grey-darken-1 font-weight-bold">
          {{ index + 1 }}
        </span>
      </template>

      <!-- ID RESEP -->
      <template v-slot:item.id_resep="{ item }">
        <v-chip size="x-small" color="primary" class="font-weight-bold">
          {{ item.id_resep }}
        </v-chip>
      </template>

      <!-- PASIEN -->
      <template v-slot:item.nama_pasien="{ item }">
        <div class="font-weight-medium">
          {{ item.nama_pasien }}
        </div>
      </template>

      <!-- DOKTER -->
      <template v-slot:item.nama_dokter="{ item }">
        <span class="text-grey-darken-1">
          {{ item.nama_dokter }}
        </span>
      </template>

      <!-- POLI -->
      <template v-slot:item.nama_poli="{ item }">
        <v-chip size="x-small" color="indigo">
          {{ item.nama_poli }}
        </v-chip>
      </template>

      <!-- DIAGNOSA -->
      <template v-slot:item.diagnosa="{ item }">
        <span class="text-caption text-grey-darken-2">
          {{ item.diagnosa || "-" }}
        </span>
      </template>

      <!-- TOTAL -->
      <template v-slot:item.total_harga="{ item }">
        <span class="font-weight-bold text-green-darken-2">
          Rp {{ item.total_harga?.toLocaleString() || 0 }}
        </span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          size="small"
          variant="flat"
          :color="
            {
              Antrian: 'grey',
              Diproses: 'orange',
              Selesai: 'green',
            }[item.status] || 'default'
          "
          class="text-white font-weight-medium"
          label
        >
          <v-icon start size="14">
            {{
              {
                Antrian: "mdi-account-clock",
                Diproses: "mdi-progress-clock",
                Selesai: "mdi-check-circle",
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
            :to="`/admin/resep-obat/${item.id_resep}`"
          >
            <v-icon size="16">mdi-eye</v-icon>
          </v-btn>

          <v-btn size="25" color="warning" variant="tonal" class="mr-1">
            <v-icon size="16">mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            size="25"
            color="error"
            variant="tonal"
            @click="opendialoghapus(item.id)"
          >
            <v-icon size="16">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>

      <!-- EMPTY -->
      <template v-slot:no-data>
        <div class="text-center py-6 text-grey">
          <v-icon size="40">mdi-pill</v-icon>
          <div>Belum ada data resep obat</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";

const resepStore = useresepObatStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("resep_obat");
  await resepStore.tarikDataResepObat();
});

const data = reactive({
  search: "",
  id_resep: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,

  headresep: [
    { title: "No", value: "no", width: "60px", align: "center" },
    { title: "ID Resep", value: "id_resep" },
    { title: "Pasien", value: "nama_pasien" },
    { title: "Dokter", value: "nama_dokter" },
    { title: "Poli", value: "nama_poli" },
    { title: "Diagnosa", value: "diagnosa" },
    { title: "Total", value: "total_harga", align: "end" },
    { title: "Status", value: "status" },
    { title: "Aksi", value: "aksi", align: "center", width: "120px" },
  ],
});

const showFilter = ref(false);

const filter = reactive({
  status: "Semua",
  poli: "",
  dokter: "",
});

/* AUTO LIST */
const listPoli = computed(() => {
  const set = new Set(resepStore.getDataResepObat.map((i: any) => i.nama_poli));
  return ["Semua", ...Array.from(set)];
});

const listDokter = computed(() => {
  const set = new Set(
    resepStore.getDataResepObat.map((i: any) => i.nama_dokter),
  );
  return ["Semua", ...Array.from(set)];
});

/* FILTER */
const filteredData = computed(() => {
  return resepStore.getDataResepObat.filter((item: any) => {
    const matchStatus =
      filter.status === "Semua" || item.status === filter.status;

    const matchPoli =
      !filter.poli || filter.poli === "Semua" || item.nama_poli === filter.poli;

    const matchDokter =
      !filter.dokter ||
      filter.dokter === "Semua" ||
      item.nama_dokter === filter.dokter;

    return matchStatus && matchPoli && matchDokter;
  });
});

/* RESET */
function resetFilter() {
  filter.status = "Semua";
  filter.poli = "";
  filter.dokter = "";
  data.search = "";
}

function opendialoghapus(id_resep: string) {
  data.dialoghapus = true;
  data.id_resep = id_resep;
  data.nama_id = "";
}

async function hapusresep() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_resep == data.nama_id) {
    resepStore.deleteResepObat(data.id_resep);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus resep");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_resep_erp");
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
