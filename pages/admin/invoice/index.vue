<template>
  <v-container fluid class="pa-3">
    <!-- HEADER -->
    <v-row align="center">
      <v-col cols="6">
        <div class="text-h5 font-weight-bold">Invoice</div>
      </v-col>
    </v-row>

    <!-- FILTER -->
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
                  v-model="filterMetode"
                  :items="['Cash', 'Transfer', 'QRIS']"
                  label="Metode"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </v-col>

              <v-col cols="12" sm="3">
                <a-date-picker
                  v-model="dateStart"
                  label="Tanggal Awal"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="3">
                <a-date-picker
                  v-model="dateEnd"
                  label="Tanggal Akhir"
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
      <!-- SEARCH -->
      <v-card-title class="pa-3">
        <v-row align="center">
          <v-col cols="12" sm="10">
            <a-text-field
              v-model="search"
              placeholder="Cari pasien / invoice..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              style="max-width: 300px"
            />
          </v-col>

          <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
            Total: {{ filteredInvoice.length }} data
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        density="comfortable"
        class="modern-table mt-2"
        :headers="headers"
        :items="filteredInvoice"
        :search="search"
      >
        <!-- TANGGAL -->
        <template #item.tanggal_bayar="{ item }">
          <div class="text-caption">
            {{ formatDate(item.tanggal_bayar) }}
          </div>
        </template>

        <!-- TOTAL -->
        <template #item.jumlah_bayar="{ item }">
          Rp {{ rupiah(item.jumlah_bayar) }}
        </template>

        <!-- METODE -->
        <template #item.metode="{ item }">
          <v-chip size="small" color="primary" variant="tonal">
            {{ item.metode }}
          </v-chip>
        </template>

        <!-- AKSI -->
        <template #item.aksi="{ item }">
          <v-btn
            color="primary"
            variant="elevated"
            rounded="pill"
            size="small"
            prepend-icon="mdi-file-document-outline"
            class="text-none font-weight-bold px-4"
            @click="openInvoice(item)"
          >
            Invoice
          </v-btn>
        </template>

        <!-- EMPTY -->
        <template #no-data>
          <div class="text-center py-6 text-grey">
            <v-icon size="40">mdi-database-off-outline</v-icon>
            <div>Tidak ada data invoice</div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card class="rounded-xl elevation-3">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6 font-weight-bold">Invoice</span>
          <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div ref="printArea" class="invoice">
            <div class="row mb-16">
              <div>
                <div class="title">KLINIK SEHAT</div>
                <div class="small">Jl. Contoh No.123</div>
              </div>

              <div class="right">
                <div class="title">INVOICE</div>
                <div class="small">{{ selected.id_pembayaran }}</div>
                <div class="status">LUNAS</div>
              </div>
            </div>

            <div class="row mb-16">
              <div><b>Pasien</b><br />{{ selected.nama_pasien }}</div>
              <div><b>Dokter</b><br />{{ selected.nama_dokter }}</div>
              <div>
                <b>Tanggal</b><br />{{ formatDate(selected.tanggal_bayar) }}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Deskripsi</th>
                  <th class="right">Jumlah</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Total Tagihan</td>
                  <td class="right">Rp {{ rupiah(selected.total_tagihan) }}</td>
                </tr>

                <tr>
                  <td>Dibayar</td>
                  <td class="right">Rp {{ rupiah(selected.jumlah_bayar) }}</td>
                </tr>

                <tr>
                  <td>Kembalian</td>
                  <td class="right green">
                    Rp {{ rupiah(selected.kembalian) }}
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="total-box">
              <div>Total Tagihan</div>
              <div>Rp {{ rupiah(selected.total_tagihan) }}</div>
            </div>

            <div class="footer">
              Terima kasih 🙏 <br />
              Dicetak: {{ new Date().toLocaleString("id-ID") }}
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Tutup</v-btn>
          <v-btn color="primary" @click="printInvoice">Print</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePembayaranStore } from "~/stores/pembayaranStore";

definePageMeta({
  layout: "admin",
});
const showFilter = ref(false);

const pembayaranStore = usePembayaranStore();

onMounted(async () => {
  await pembayaranStore.tarikDataPembayaran();
});

/* STATE */
const dialog = ref(false);
const selected = ref<any>({});
const printArea = ref();

const search = ref("");
const filterMetode = ref("");
const dateStart = ref("");
const dateEnd = ref("");

/* FILTER DATA (FIX BUG TANGGAL DISINI) */
const filteredInvoice = computed(() => {
  return pembayaranStore.getDataPembayaran.filter((item: any) => {
    if (item.status !== "Lunas") return false;

    // SEARCH
    const s = search.value.toLowerCase();
    const matchSearch =
      !search.value ||
      item.id_pembayaran?.toLowerCase().includes(s) ||
      item.nama_pasien?.toLowerCase().includes(s);

    // METODE
    const matchMetode =
      !filterMetode.value || item.metode === filterMetode.value;

    // 🔥 FIX TANGGAL
    let matchTanggal = true;

    if (dateStart.value || dateEnd.value) {
      const tgl = new Date(item.tanggal_bayar * 1000);

      if (dateStart.value) {
        const start = new Date(dateStart.value);
        start.setHours(0, 0, 0, 0); // awal hari
        if (tgl < start) matchTanggal = false;
      }

      if (dateEnd.value) {
        const end = new Date(dateEnd.value);
        end.setHours(23, 59, 59, 999); // akhir hari
        if (tgl > end) matchTanggal = false;
      }
    }

    return matchSearch && matchMetode && matchTanggal;
  });
});

/* RESET */
function resetFilter() {
  search.value = "";
  filterMetode.value = "";
  dateStart.value = "";
  dateEnd.value = "";
}

/* ACTION */
function openInvoice(item: any) {
  selected.value = item;
  dialog.value = true;
}

/* FORMAT */
function rupiah(val: number) {
  return new Intl.NumberFormat("id-ID").format(val || 0);
}

function formatDate(val: number) {
  return new Date(val * 1000).toLocaleString("id-ID");
}

/* PRINT */
function printInvoice() {
  const content = printArea.value.innerHTML;

  const win = window.open("", "", "width=800,height=700");

  win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding:20px }
          .row { display:flex; justify-content:space-between }
          .mb-16 { margin-bottom:16px }
          .title { font-size:18px; font-weight:bold }
          .small { font-size:12px; color:#777 }
          .right { text-align:right }
          .status { background:#4caf50; color:white; padding:4px 8px; border-radius:5px }
          table { width:100%; border-collapse:collapse }
          th, td { border:1px solid #ddd; padding:8px }
          th { background:#f5f5f5 }
          .total-box { margin-top:15px; padding:10px; background:#f5f5f5; display:flex; justify-content:space-between }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);

  win.document.close();
  win.print();
}

/* HEADER */
const headers = [
  { title: "ID", key: "id_pembayaran" },
  { title: "Pasien", key: "nama_pasien" },
  { title: "Tanggal", key: "tanggal_bayar" },
  { title: "Metode", key: "metode" },
  { title: "Total", key: "jumlah_bayar" },
  { title: "Aksi", key: "aksi" },
];
</script>

<style scoped>
.invoice {
  font-size: 14px;
}
.row {
  display: flex;
  justify-content: space-between;
}
.mb-16 {
  margin-bottom: 16px;
}
.title {
  font-weight: bold;
  font-size: 18px;
}
.small {
  font-size: 12px;
  color: #777;
}
.right {
  text-align: right;
}
.status {
  background: #4caf50;
  color: white;
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  border: 1px solid #ddd;
}
.total-box {
  margin-top: 15px;
  padding: 10px;
  background: #f5f5f5;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.footer {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #777;
}

:deep() thead th {
  font-weight: bold !important;
  border: 1px solid #cbcbcb !important;
  background-color: #dddddd !important;
}

:deep() tbody td {
  border-right: 1px solid #e0e0e0 !important;
}
</style>
