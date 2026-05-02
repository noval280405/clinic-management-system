<template>
  <v-container fluid class="pa-4">
    <!-- HEADER -->
    <v-row align="center" class="mb-2">
      <v-col cols="12" md="6">
        <div class="text-h5 font-weight-bold">Pembayaran</div>
        <div class="text-caption text-grey">
          Kelola dan proses pembayaran pasien
        </div>
      </v-col>

      <!-- SEARCH -->
      <v-col cols="12" md="6">
        <a-text-field
          v-model="search"
          placeholder="Cari pasien / ID billing..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
        />
      </v-col>
    </v-row>

    <!-- FILTER -->
    <v-row class="mb-2">
      <v-col cols="12" md="3">
        <v-select
          v-model="filterStatus"
          :items="['Semua', 'Belum Bayar', 'Lunas']"
          label="Filter Status"
          variant="outlined"
          density="comfortable"
        />
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filterMetode"
          :items="['Semua', 'Cash', 'Transfer', 'QRIS']"
          label="Filter Metode"
          variant="outlined"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <!-- TABLE -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredData"
        :search="search"
        class="rounded-xl"
      >
        <!-- TANGGAL -->
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
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
            variant="flat"
            @click="openBayar(item)"
            :disabled="item.status === 'Lunas'"
          >
            Bayar
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG PEMBAYARAN -->
    <v-dialog v-model="dialogBayar" max-width="500">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold">
          Pembayaran
        </v-card-title>

        <v-divider />

        <v-card-text>
          <!-- PASIEN -->
          <div class="mb-3">
            <div class="text-caption text-grey">Pasien</div>
            <div class="font-weight-bold">
              {{ selected.nama_pasien }}
            </div>
          </div>

          <!-- TOTAL -->
          <div class="mb-3">
            <div class="text-caption text-grey">Total Tagihan</div>
            <div class="text-h6 font-weight-bold text-primary">
              Rp {{ rupiah(selected.total_tagihan) }}
            </div>
          </div>

          <!-- METODE -->
          <v-text-field
            v-model="selected.metode"
            label="Metode"
            variant="outlined"
            disabled
          />

          <!-- BAYAR -->
          <v-text-field
            v-model.number="selected.jumlah_bayar"
            type="number"
            label="Jumlah Bayar"
            variant="outlined"
            disabled
          />

          <!-- KEMBALIAN -->
          <div
            v-if="selected.jumlah_bayar >= selected.total_tagihan"
            class="mt-2"
          >
            <div class="text-caption text-grey">Kembalian</div>
            <div class="text-green-darken-2 font-weight-bold">
              Rp {{ rupiah(selected.kembalian) }}
            </div>
          </div>

          <div v-else class="mt-2 text-red text-caption">Uang kurang</div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogBayar = false"> Batal </v-btn>

          <v-btn color="primary" :disabled="!isValidBayar" @click="prosesBayar">
            Bayar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
