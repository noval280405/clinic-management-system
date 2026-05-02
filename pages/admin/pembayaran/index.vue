<template>
  <v-container fluid class="pa-3">
    <!-- HEADER -->
    <v-row align="center">
      <v-col cols="6">
        <div class="text-h5 font-weight-bold">Pembayaran</div>
      </v-col>
    </v-row>

    <!-- FILTER CARD -->
    <v-card>
      <v-card-text>
        <!-- HEADER FILTER -->
        <v-row align="center" justify="space-between" class="mb-2">
          <v-col cols="auto">
            <h3 class="text-body-1 font-weight-medium text-grey-darken-1">
              Filter Pencarian
            </h3>
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

        <!-- CONTENT FILTER -->
        <v-expand-transition>
          <div v-show="showFilter">
            <v-row class="mt-3" align="end">
              <v-col cols="12" sm="3">
                <v-select
                  v-model="filterStatus"
                  :items="['Semua', 'Belum Bayar', 'Lunas']"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="3">
                <v-select
                  v-model="filterMetode"
                  :items="['Semua', 'Cash', 'Transfer', 'QRIS']"
                  label="Metode"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="3" class="d-flex justify-end">
                <v-btn color="grey" variant="tonal" block @click="resetFilter">
                  Reset Filter
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>

    <!-- TABLE -->
    <v-card class="border rounded-lg mt-5" flat>
      <!-- SEARCH PINDAH KE SINI -->
      <v-card-title class="pa-3">
        <v-row align="center">
          <v-col cols="12" sm="10">
            <v-text-field
              v-model="search"
              placeholder="Cari pasien / billing..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              style="max-width: 300px"
            />
          </v-col>

          <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
            Total: {{ filteredData.length }} data
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        density="comfortable"
        class="modern-table mt-2"
        :headers="headers"
        :items="filteredData"
        :search="search"
      >
        <!-- TANGGAL -->
        <template #item.created_at="{ item }">
          <div class="text-caption">
            {{ formatDate(item.created_at) }}
          </div>
        </template>

        <!-- TOTAL -->
        <template #item.total_tagihan="{ item }">
          Rp {{ rupiah(item.total_tagihan) }}
        </template>

        <!-- STATUS -->
        <template #item.status="{ item }">
          <v-chip
            size="small"
            :color="item.status === 'Lunas' ? 'green' : 'orange'"
            variant="flat"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- AKSI -->
        <template #item.aksi="{ item }">
          <v-btn
            size="small"
            color="success"
            @click="openBayar(item)"
            :disabled="item.status === 'Lunas'"
          >
            Bayar
          </v-btn>
        </template>

        <!-- EMPTY -->
        <template #no-data>
          <div class="text-center py-6 text-grey">
            <v-icon size="40">mdi-database-off-outline</v-icon>
            <div>Tidak ada data pembayaran</div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { ref, computed, onMounted } from "vue";
import { usePembayaranStore } from "~/stores/pembayaranStore";

definePageMeta({
  layout: "admin",
});

const pembayaranStore = usePembayaranStore();

/* =========================
   STATE
========================= */
const search = ref("");
const filterStatus = ref("Semua");
const filterMetode = ref("Semua");

const dialogBayar = ref(false);
const selected = ref<any>({});

/* =========================
   LOAD DATA
========================= */
onMounted(async () => {
  await pembayaranStore.tarikDataPembayaran();
});

/* =========================
   FILTER LOGIC
========================= */
const filteredData = computed(() => {
  return pembayaranStore.getDataPembayaran.filter((item: any) => {
    const matchStatus =
      filterStatus.value === "Semua" || item.status === filterStatus.value;

    const matchMetode =
      filterMetode.value === "Semua" || item.metode === filterMetode.value;

    const matchSearch =
      item.nama_pasien?.toLowerCase().includes(search.value.toLowerCase()) ||
      item.id_billing?.toLowerCase().includes(search.value.toLowerCase());

    return matchStatus && matchMetode && matchSearch;
  });
});

const showFilter = ref(false);

function resetFilter() {
  filterStatus.value = "Semua";
  filterMetode.value = "Semua";
  search.value = "";
}

/* =========================
   TABLE
========================= */
const headers = [
  { title: "ID Billing", key: "id_billing" },
  { title: "Pasien", key: "nama_pasien" },
  { title: "Tanggal", key: "created_at" },
  { title: "Total", key: "total_tagihan" },
  { title: "Status", key: "status" },
  { title: "Aksi", key: "aksi", sortable: false },
];

/* =========================
   FORMAT
========================= */
function rupiah(val: number) {
  return new Intl.NumberFormat("id-ID").format(val || 0);
}

function formatDate(val: number) {
  return new Date(val * 1000).toLocaleString("id-ID");
}

/* =========================
   ACTION
========================= */
function openBayar(item: any) {
  selected.value = _.cloneDeep(item);
  dialogBayar.value = true;
}

/* =========================
   VALIDASI
========================= */
const isValidBayar = computed(() => {
  return (
    selected.value.metode &&
    selected.value.jumlah_bayar >= selected.value.total_tagihan
  );
});

/* =========================
   PROSES BAYAR
========================= */
async function prosesBayar() {
  selected.value.status = "Lunas";
  selected.value.tanggal_bayar = moment().unix();

  dialogBayar.value = false;

  await pembayaranStore.tarikDataPembayaran();
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
