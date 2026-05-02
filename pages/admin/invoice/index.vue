<template>
  <v-container fluid class="pa-3">
    <!-- HEADER -->
    <v-row align="center">
      <v-col cols="12" md="6">
        <div class="text-h5 font-weight-bold">Invoice</div>
      </v-col>
    </v-row>

    <!-- FILTER -->
    <v-card class="mt-3 pa-3 rounded-xl">
      <v-row dense>
        <!-- SEARCH -->
        <v-col cols="12" md="3">
          <a-text-field
            v-model="search"
            label="Cari ID / Pasien"
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </v-col>

        <!-- METODE -->
        <v-col cols="12" md="3">
          <a-select
            v-model="filterMetode"
            :items="['Cash', 'Transfer', 'QRIS']"
            label="Filter Metode"
            clearable
          />
        </v-col>

        <!-- TGL AWAL -->
        <v-col cols="12" md="2">
          <a-date-picker v-model="dateStart" label="Tanggal Awal" type="date" />
        </v-col>

        <!-- TGL AKHIR -->
        <v-col cols="12" md="2">
          <a-date-picker v-model="dateEnd" label="Tanggal Akhir" type="date" />
        </v-col>

        <!-- RESET -->
        <v-col cols="12" md="2">
          <v-btn block color="grey" @click="resetFilter"> Reset </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- TABLE -->
    <v-card class="mt-3">
      <v-data-table :headers="headers" :items="filteredInvoice">
        <template #item.tanggal_bayar="{ item }">
          {{ formatDate(item.tanggal_bayar) }}
        </template>

        <template #item.jumlah_bayar="{ item }">
          Rp {{ rupiah(item.jumlah_bayar) }}
        </template>

        <template #item.metode="{ item }">
          <v-chip size="small" color="primary">
            {{ item.metode }}
          </v-chip>
        </template>

        <template #item.aksi="{ item }">
          <v-btn size="small" color="primary" @click="openInvoice(item)">
            Lihat
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card>
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
              <div>
                <b>Pasien</b><br />
                {{ selected.nama_pasien }}
              </div>

              <div>
                <b>Dokter</b><br />
                {{ selected.nama_dokter }}
              </div>

              <div>
                <b>Tanggal</b><br />
                {{ formatDate(selected.tanggal_bayar) }}
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
</style>
