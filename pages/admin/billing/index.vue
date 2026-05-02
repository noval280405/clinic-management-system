<template>
  <v-container fluid class="pa-3">
    <!-- HEADER -->
    <v-row align="center">
      <v-col cols="6">
        <div class="text-h5 font-weight-bold">Pembayaran</div>
      </v-col>
    </v-row>

    <v-card>
      <v-card-text>
        <!-- Header -->
        <v-row align="center" justify="space-between" class="mb-2">
          <v-col cols="auto">
            <h3 class="text-body-1 font-weight-medium text-grey-darken-1">
              Filter Pencarian
            </h3>
          </v-col>

          <v-col cols="auto">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="small"
                  color="primary"
                  variant="flat"
                  rounded="xl"
                  class="d-flex align-center"
                  @click="showFilter = !showFilter"
                >
                  <v-icon size="x-large">
                    {{ showFilter ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
              </template>
              <span>Tampilkan / Sembunyikan Filter</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-divider />

        <!-- Filter -->
        <v-expand-transition>
          <div v-show="showFilter">
            <v-row class="mt-3" align="end">
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="filter.start"
                  type="date"
                  label="Tanggal Awal"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="filter.end"
                  type="date"
                  label="Tanggal Akhir"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="3">
                <v-select
                  v-model="filter.status"
                  :items="['Semua', 'Belum Bayar', 'Terbayar']"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="3" class="d-flex justify-end">
                <v-btn
                  color="grey"
                  class="mb-7"
                  variant="tonal"
                  block
                  @click="resetFilter"
                >
                  Reset Filter
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>

    <!-- DIALOG PEMBAYARAN -->
    <v-dialog v-model="dialogBayar" max-width="480">
      <v-card class="rounded-xl elevation-3">
        <!-- HEADER -->
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6 font-weight-bold">Pembayaran</span>
          <v-btn icon="mdi-close" variant="text" @click="dialogBayar = false" />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <!-- PASIEN -->
          <div class="mb-4">
            <div class="text-caption text-grey">Pasien</div>
            <div class="font-weight-bold text-body-1">
              {{ selected.nama_pasien }}
            </div>
          </div>

          <!-- TOTAL -->
          <div class="mb-4 pa-3 rounded-lg bg-grey-lighten-4">
            <div class="text-caption text-grey">Total Tagihan</div>
            <div class="text-h5 font-weight-bold text-primary">
              Rp {{ rupiah(selected.total) }}
            </div>
          </div>

          <!-- METODE -->
          <a-select
            v-model="form.metode"
            :items="metodeList"
            item-title="title"
            item-value="value"
            label="Metode Pembayaran"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-credit-card-outline"
            class="mb-3"
          />

          <!-- INPUT BAYAR -->
          <a-text-field
            v-model.number="form.bayar"
            type="number"
            label="Jumlah Bayar"
            variant="outlined"
            density="comfortable"
            prefix="Rp"
            class="mb-2"
          />

          <!-- STATUS -->
          <v-alert
            v-if="form.bayar && form.bayar < selected.total"
            type="error"
            variant="tonal"
            density="compact"
            class="mt-2"
          >
            Uang kurang
          </v-alert>

          <!-- KEMBALIAN -->
          <div
            v-if="form.bayar >= selected.total"
            class="mt-3 pa-3 rounded-lg bg-green-lighten-5"
          >
            <div class="text-caption text-grey">Kembalian</div>
            <div class="text-h6 font-weight-bold text-green-darken-2">
              Rp {{ rupiah(kembalian) }}
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- ACTION -->
        <v-card-actions class="pa-3">
          <v-btn variant="text" @click="dialogBayar = false"> Batal </v-btn>

          <v-spacer />

          <v-btn
            color="primary"
            size="large"
            class="px-6"
            :disabled="form.bayar < selected.total"
            @click="prosesBayar"
          >
            Bayar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- TABLE -->
    <v-card class="border rounded-lg mt-5" flat>
      <v-card-title class="pa-3">
        <v-row align="center">
          <v-col cols="12" sm="10">
            <a-text-field
              v-model="search"
              placeholder="Search"
              style="max-width: 280px"
            />
          </v-col>

          <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
            Total: {{ billingStore.getDataBilling.length }} mutasi stok
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        density="comfortable"
        class="modern-table mt-5"
        :headers="headers"
        :items="filteredData"
        :search="search"
      >
        <!-- TANGGAL -->
        <template #item.created_at="{ item }">
          <div class="text-caption">
            {{ rubahtanggalunix(item.created_at) }}
          </div>
        </template>

        <!-- OBAT -->

        <template #item.total="{ item }">
          Rp {{ rupiah(item.total) }}
        </template>

        <template #item.status="{ item }">
          <v-chip
            size="small"
            :color="item.status === 'Terbayar' ? 'green' : 'orange'"
            variant="flat"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.aksi="{ item }">
          <v-btn
            size="small"
            color="success"
            @click="openBayar(item)"
            :disabled="item.status === 'Terbayar'"
          >
            Bayar
          </v-btn>
        </template>

        <!-- EMPTY -->
        <template #no-data>
          <div class="text-center py-6 text-grey">
            <v-icon size="40">mdi-database-off-outline</v-icon>
            <div>Tidak ada data mutasi</div>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <!-- <v-data-table
        :headers="headers"
        :items="filteredData"
        :search="search"
        density="comfortable"
      >
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #item.total="{ item }">
          Rp {{ rupiah(item.total) }}
        </template>

        <template #item.status="{ item }">
          <v-chip
            size="small"
            :color="item.status === 'Terbayar' ? 'green' : 'orange'"
            variant="flat"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.aksi="{ item }">
          <v-btn
            size="small"
            color="success"
            @click="openBayar(item)"
            :disabled="item.status === 'Terbayar'"
          >
            Bayar
          </v-btn>
        </template>
      </v-data-table> -->
  </v-container>
</template>

<script setup lang="ts">
import moment from "moment";
import { ref, computed, onMounted } from "vue";
import { useBillingStore } from "~/stores/billingStore";

definePageMeta({
  layout: "admin",
});

const billingStore = useBillingStore();

/* =========================
   STATE
========================= */
const dialogBayar = ref(false);
const selected = ref<any>({});

const search = ref("");
const showFilter = ref(false);

const filter = ref({
  start: "",
  end: "",
  status: "Semua",
});

const form = ref({
  metode: "cash",
  bayar: 0,
});

const metodeList = [
  { title: "Cash", value: "cash" },
  { title: "Transfer", value: "transfer" },
  { title: "QRIS", value: "qris" },
];

/* =========================
   FETCH DATA
========================= */
onMounted(async () => {
  await billingStore.tarikDataBilling();
});

/* =========================
   COMPUTED
========================= */
const kembalian = computed(() => {
  return (form.value.bayar || 0) - (selected.value.total || 0);
});

/* 🔥 FILTER UTAMA */
const filteredData = computed(() => {
  return billingStore.getDataBilling.filter((item: any) => {
    const itemDate = new Date(item.created_at * 1000);

    // START DATE
    const start = filter.value.start ? new Date(filter.value.start) : null;

    // END DATE (FIX BUG penting)
    const end = filter.value.end
      ? new Date(filter.value.end + "T23:59:59")
      : null;

    // FILTER TANGGAL
    const matchDate =
      (!start || itemDate >= start) && (!end || itemDate <= end);

    // FILTER STATUS
    const matchStatus =
      filter.value.status === "Semua" || item.status === filter.value.status;

    return matchDate && matchStatus;
  });
});

/* =========================
   TABLE
========================= */
const headers = [
  { title: "ID Billing", key: "id_billing" },
  { title: "Pasien", key: "nama_pasien" },
  { title: "Tanggal", key: "created_at" },
  { title: "Total", key: "total" },
  { title: "Status", key: "status" },
  { title: "Aksi", key: "aksi", sortable: false },
];

/* =========================
   ACTION
========================= */
function openBayar(item: any) {
  selected.value = item;
  form.value.bayar = item.total;
  form.value.metode = "cash";
  dialogBayar.value = true;
}

function resetFilter() {
  filter.value = {
    start: "",
    end: "",
    status: "Semua",
  };
  search.value = "";
}

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
   PROSES BAYAR
========================= */
async function prosesBayar() {
  try {
    useloadingStore().setLoading(true);

    await addPembayaran({
      id_billing: selected.value.id_billing,
      id_pasien: selected.value.id_pasien,
      id_dokter: selected.value.id_dokter,
      nama_dokter: selected.value.nama_dokter,
      nama_pasien: selected.value.nama_pasien,
      total_tagihan: selected.value.total,
      jumlah_bayar: form.value.bayar,
      kembalian: kembalian.value,
      metode: form.value.metode,
      tanggal_bayar: moment().unix(),
      status: "Terbayar",
    });

    await updateBilling(selected.value.id_billing, {
      status: "Terbayar",
      tanggal_bayar: moment().unix(),
    });

    dialogBayar.value = false;

    await billingStore.tarikDataBilling();

    useNotificationStore().showSuccess("Pembayaran berhasil");
  } catch (error: any) {
    console.error(error);
    useNotificationStore().showError(error.message);
  } finally {
    useloadingStore().setLoading(false);
  }
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
