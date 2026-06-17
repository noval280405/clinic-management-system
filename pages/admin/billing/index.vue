<template>
  <v-container fluid class="pa-3">
    <ConfirmationDialog ref="confirmationDialog" />

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

              <v-col cols="12" sm="3">
                <a-select
                  v-model="filter.status"
                  :items="['Semua', 'Belum Bayar', 'Terbayar']"
                  label="Status"
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

    <!-- DIALOG PEMBAYARAN -->
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
        <!-- ================= HEADER: CLEAN & DROPPED DIVIDER ================= -->
        <v-card-title
          class="d-flex justify-space-between align-start pt-4 px-5 pb-4 text-white"
          style="background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)"
        >
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
                Form Pembayaran
              </span>
              <span
                class="text-caption text-blue-100 font-weight-medium mt-0.5"
                style="font-size: 11px !important"
              >
                Selesaikan transaksi resep obat pasien
              </span>
            </div>
          </div>

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

        <v-card-text class="pa-4 pt-4">
          <!-- ================= INFO PASIEN MINIMALIS ================= -->
          <div
            class="d-flex justify-space-between align-center pb-3 mb-4 style-border"
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
              Rp {{ rupiah(selected.total) }}
            </div>
          </div>

          <!-- ================= INPUT FORMS METODE ================= -->
          <div class="d-flex flex-column ga-1">
            <a-select
              v-model="form.metode"
              :items="metodeList"
              item-title="title"
              item-value="value"
              label="Metode Pembayaran"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-credit-card-outline"
              class="mb-1 rounded-xl"
            />

            <!-- CASH INPUT -->
            <a-text-field
              v-if="form.metode === 'cash'"
              v-model.number="form.bayar"
              type="number"
              label="Jumlah Uang Tunai"
              variant="outlined"
              density="comfortable"
              prefix="Rp"
              class="mb-1"
            />
          </div>

          <!-- ================= DYNAMIC ALERTS & STATE INTERACTIVES ================= -->

          <!-- ALERT UANG KURANG -->
          <v-alert
            v-if="
              form.metode === 'cash' &&
              form.bayar &&
              form.bayar < selected.total
            "
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
              form.metode === 'cash' &&
              form.bayar &&
              form.bayar >= selected.total
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
              Rp {{ rupiah(kembalian) }}
            </div>
          </div>

          <!-- QRIS STATE INFO -->
          <v-alert
            v-if="form.metode === 'qris'"
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
              >mdi-qrcode-scan</v-icon
            >
            Silakan arahkan pasien scan monitor QRIS statis / dinamis.
          </v-alert>

          <!-- TRANSFER STATE INFO -->
          <v-alert
            v-if="form.metode === 'transfer'"
            type="info"
            variant="flat"
            density="compact"
            class="mt-2 rounded-xl text-caption font-weight-medium text-blue-darken-4"
            style="
              background-color: #f0f9ff !important;
              border: 1px solid #bae6fd;
            "
          >
            <v-icon size="16" class="mr-1.5" color="blue-darken-2"
              >mdi-bank-transfer</v-icon
            >
            Pastikan mutasi rekening sesuai angka tagihan di atas.
          </v-alert>
        </v-card-text>

        <!-- ================= ACTIONS: ALIGNED & ULTRA SLEEK ================= -->
        <v-card-actions class="px-4 pb-3 pt-0 d-flex justify-end ga-2">
          <!-- BUTTON BATAL RAMPING -->
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
              !form.metode ||
              (form.metode === 'cash' && form.bayar < selected.total)
            "
            @click="prosesBayar"
          >
            <v-icon size="14" class="mr-1.5">mdi-check-circle-outline</v-icon>
            Lunaskan Pembayaran
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
            color="yellow"
            variant="elevated"
            rounded="pill"
            size="small"
            prepend-icon="mdi-cash-check"
            class="text-none font-weight-bold px-3"
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
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
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
  metode: "Cash",
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
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Bayar",
    "Anda yakin ingin membayar data billing ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("edit data dibatalkan");
  }
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
