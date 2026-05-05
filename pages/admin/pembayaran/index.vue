<template>
  <v-container fluid class="pa-3">
    <ConfirmationDialog ref="confirmationDialog" />

    <!-- HEADER -->
    <v-dialog v-model="dialogBayar" max-width="480">
      <v-card class="rounded-xl elevation-3">
        <!-- HEADER -->
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6 font-weight-bold">Pelunasan</span>
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
              Rp {{ rupiah(selected.total_tagihan) }}
            </div>
          </div>

          <!-- METODE -->
          <a-text-field
            disabled
            v-model="selected.metode"
            label="Metode Pembayaran"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-credit-card-outline"
            class="mb-3"
          />

          <!-- INPUT BAYAR -->
          <a-text-field
            disabled
            v-model.number="selected.jumlah_bayar"
            type="number"
            label="Jumlah Bayar"
            variant="outlined"
            density="comfortable"
            prefix="Rp"
            class="mb-2"
          />

          <!-- STATUS -->
          <v-alert
            v-if="selected.bayar && selected.bayar < selected.total"
            type="error"
            variant="tonal"
            density="compact"
            class="mt-2"
          >
            Uang kurang
          </v-alert>

          <!-- KEMBALIAN -->
          <div
            v-if="selected.bayar >= selected.total"
            class="mt-3 pa-3 rounded-lg bg-green-lighten-5"
          >
            <div class="text-caption text-grey">Kembalian</div>
            <div class="text-h6 font-weight-bold text-green-darken-2">
              Rp {{ rupiah(selected.kembalian) }}
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
            :disabled="selected.bayar < selected.total"
            @click="prosesBayar"
          >
            Bayar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                <a-select
                  v-model="filterStatus"
                  :items="['Semua', 'Belum Bayar', 'Lunas']"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="3">
                <a-select
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
            <a-text-field
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
            Lunaskan
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
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
definePageMeta({
  layout: "admin",
});

const pembayaranStore = usePembayaranStore();

const search = ref("");
const filterStatus = ref("Semua");
const filterMetode = ref("Semua");

const dialogBayar = ref(false);
const selected = ref<any>({});

onMounted(async () => {
  await pembayaranStore.tarikDataPembayaran();
});

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

const headers = [
  { title: "ID Billing", key: "id_billing" },
  { title: "Pasien", key: "nama_pasien" },
  { title: "Tanggal", key: "created_at" },
  { title: "Total", key: "total_tagihan" },
  { title: "Status", key: "status" },
  { title: "Aksi", key: "aksi", sortable: false },
];

function rupiah(val: number) {
  return new Intl.NumberFormat("id-ID").format(val || 0);
}

function formatDate(val: number) {
  return new Date(val * 1000).toLocaleString("id-ID");
}

function openBayar(item: any) {
  selected.value = _.cloneDeep(item);
  dialogBayar.value = true;
}

async function prosesBayar() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Lunas",
    "Anda yakin ingin lunasin data pembayaran ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("pelunasan data dibatalkan");
  }
  selected.value.status = "Lunas";
  selected.value.tanggal_bayar = moment().unix();

  dialogBayar.value = false;

  const c = await updatePembayaran(selected.value);
  if (c == "ok") {
    notificationStore.showSuccess("Data berhasil di bayar");
  } else {
    notificationStore.showError("Data Error");
  }
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
