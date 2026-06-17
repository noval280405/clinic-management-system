<template>
  <v-container fluid class="pa-3">
    <ConfirmationDialog ref="confirmationDialog" />

    <!-- HEADER -->
    <v-dialog
      v-model="dialogBayar"
      max-width="440"
      transition="dialog-bottom-transition"
    >
      <v-card
        class="rounded-2xl border-none overflow-hidden bg-white pa-2"
        style="
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        "
      >
        <!-- ================= HEADER: PREMIUM SOLID BLUE GRADIENT ================= -->
        <v-card-title
          class="d-flex justify-space-between align-start pt-4 px-5 pb-4 text-white"
          style="
            background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
            margin: -8px -8px 0 -8px;
          "
        >
          <!-- SISI KIRI: KELOMPOK ICON & JUDUL + SUBTITLE -->
          <div class="d-flex align-center ga-3">
            <v-avatar
              size="38"
              class="rounded-xl elevation-0"
              style="
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(4px);
                border: 1px solid rgba(255, 255, 255, 0.25);
              "
            >
              <v-icon color="white" size="18">mdi-wallet-outline</v-icon>
            </v-avatar>

            <div class="d-flex flex-column">
              <span
                class="text-body-1 font-weight-black text-white"
                style="letter-spacing: -0.3px; line-height: 1.2"
              >
                Form Pelunasan
              </span>
              <span
                class="text-caption text-blue-100 font-weight-medium mt-0.5"
                style="font-size: 11px !important"
              >
                Konfirmasi akhir pelunasan tagihan pasien
              </span>
            </div>
          </div>

          <!-- SISI KANAN: TOMBOL CLOSE GLASSMORPHISM -->
          <v-btn
            variant="text"
            size="30"
            color="white"
            class="rounded-lg"
            style="
              background: rgba(255, 255, 255, 0.15);
              min-width: 30px;
              height: 30px;
              padding: 0;
            "
            @click="dialogBayar = false"
          >
            <v-icon size="16">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4 pt-5">
          <!-- ================= INFO PASIEN MINIMALIS ================= -->
          <div
            class="d-flex justify-space-between align-center pb-3 mb-4"
            style="border-bottom: 1px dashed #e2e8f0"
          >
            <span
              class="text-caption text-grey-darken-1 font-weight-bold text-uppercase tracking-wider"
              >Nama Pasien</span
            >
            <span class="text-body-2 font-weight-black text-slate-900">{{
              selected.nama_pasien
            }}</span>
          </div>

          <!-- ================= RINGKASAN TOTAL TAGIHAN (FINTECH CARD) ================= -->
          <div
            class="pa-4 rounded-xl text-center mb-4"
            style="background: #f8fafc; border: 1px solid #f1f5f9"
          >
            <div
              class="text-caption text-grey-darken-1 font-weight-bold text-uppercase tracking-wider"
              style="font-size: 10px !important"
            >
              Total Nilai Tagihan
            </div>
            <div
              class="text-h4 font-weight-black text-blue-darken-3 mt-1"
              style="
                font-family: monospace, sans-serif !important;
                letter-spacing: -0.5px;
              "
            >
              Rp {{ rupiah(selected.total_tagihan) }}
            </div>
          </div>

          <!-- ================= INPUT FORMS DISABELD (DATA READ ONLY) ================= -->
          <div class="d-flex flex-column ga-1">
            <a-text-field
              disabled
              v-model="selected.metode"
              label="Metode Pembayaran"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-credit-card-outline"
              class="mb-1"
            />

            <a-text-field
              disabled
              v-model.number="selected.jumlah_bayar"
              label="Jumlah Bayar"
              variant="outlined"
              density="comfortable"
              prefix="Rp"
              class="mb-1"
            />
          </div>

          <!-- ================= DYNAMIC ALERTS & STATE INTERACTIVES ================= -->

          <!-- ALERT UANG KURANG -->
          <v-alert
            v-if="selected.metode === 'cash' && selected.bayar < selected.total"
            type="error"
            variant="flat"
            density="compact"
            class="mt-2 rounded-lg text-caption font-weight-bold text-white bg-red-darken-1"
          >
            <v-icon size="14" class="mr-1">mdi-alert-circle-outline</v-icon>
            Nominal uang tunai belum mencukupi tagihan.
          </v-alert>

          <!-- KEMBALIAN (CLEAN LUXURY BLOCK) -->
          <div
            v-if="
              selected.metode === 'cash' && selected.bayar >= selected.total
            "
            class="mt-3 pa-3 rounded-xl d-flex justify-space-between align-center"
            style="background-color: #f0fdf4; border: 1px solid #bbf7d0"
          >
            <div class="d-flex align-center ga-2">
              <v-icon color="green-darken-2" size="18">mdi-cash-refund</v-icon>
              <span class="text-body-2 font-weight-bold text-green-darken-4"
                >Uang Kembalian</span
              >
            </div>
            <div
              class="text-subtitle-1 font-weight-black text-green-darken-2"
              style="font-family: monospace, sans-serif !important"
            >
              Rp {{ rupiah(selected.kembalian) }}
            </div>
          </div>

          <!-- NON CASH STATE INFO -->
          <v-alert
            v-if="selected.metode !== 'cash'"
            type="success"
            variant="flat"
            density="compact"
            class="mt-2 rounded-xl text-caption font-weight-medium text-green-darken-4"
            style="
              background-color: #f0fdf4 !important;
              border: 1px solid #bbf7d0;
            "
          >
            <v-icon size="16" class="mr-1.5" color="green-darken-2"
              >mdi-check-circle-outline</v-icon
            >
            Pembayaran non-cash akan langsung dilunaskan otomatis oleh sistem.
          </v-alert>
        </v-card-text>

        <!-- ================= ACTIONS: ALIGNED & ULTRA SLEEK ================= -->
        <v-card-actions class="px-4 pb-3 pt-0 d-flex justify-end ga-2">
          <!-- BUTTON BATAL -->
          <v-btn
            variant="text"
            color="grey-darken-2"
            style="
              font-weight: 700;
              border-radius: 6px;
              height: 34px;
              text-transform: none;
              letter-spacing: 0;
            "
            class="text-caption px-4"
            @click="dialogBayar = false"
          >
            Batal
          </v-btn>

          <!-- BUTTON LUNASKAN (COMPACT & BOLD) -->
          <v-btn
            color="blue-darken-3"
            variant="flat"
            style="
              font-weight: 700;
              border-radius: 6px;
              height: 34px;
              text-transform: none;
              letter-spacing: 0.2px;
            "
            class="text-caption px-4 text-white"
            :disabled="
              selected.metode === 'cash' && selected.bayar < selected.total
            "
            @click="prosesBayar"
          >
            <v-icon size="14" class="mr-1.5">mdi-check-circle-outline</v-icon>
            Lunaskan Pembayaran
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
            color="success"
            variant="flat"
            rounded="pill"
            size="small"
            prepend-icon="mdi-check-circle"
            class="text-none font-weight-bold btn-lunas"
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
  useloadingStore().setLoading(true);
  const c = await updatePembayaran(selected.value);
  if (c == "ok") {
    notificationStore.showSuccess("Data berhasil di bayar");
  } else {
    notificationStore.showError("Data Error");
  }
  useloadingStore().setLoading(false);
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
