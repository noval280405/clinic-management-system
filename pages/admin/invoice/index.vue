<template>
  <v-container fluid class="pa-3">
    <!-- HEADER -->
    <v-row align="center">
      <v-col cols="9">
        <div class="text-h5 font-weight-bold">Invoice</div>
      </v-col>
    </v-row>

    <!-- TABLE -->
    <v-card class="mt-3">
      <v-data-table
        :headers="headers"
        :items="invoiceList"
        density="comfortable"
      >
        <template #item.tanggal_bayar="{ item }">
          {{ formatDate(item.tanggal_bayar) }}
        </template>

        <template #item.jumlah_bayar="{ item }">
          Rp {{ rupiah(item.jumlah_bayar) }}
        </template>

        <template #item.metode="{ item }">
          <v-chip size="small" color="primary" variant="flat">
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
          <!-- 🔥 PRINT AREA -->
          <div ref="printArea" class="invoice">
            <!-- HEADER -->
            <div class="row between mb-16">
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

            <!-- INFO -->
            <div class="row mb-16">
              <div>
                <b>Pasien</b><br />
                {{ selected.nama_pasien }}<br />
                <span class="small">{{ selected.id_pasien }}</span>
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

            <!-- TABLE -->
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

            <!-- TOTAL -->
            <div class="total-box">
              <div>Total Tagihan</div>
              <div>Rp {{ rupiah(selected.total_tagihan) }}</div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
              Terima kasih 🙏 <br />
              Dicetak: {{ new Date().toLocaleString("id-ID") }}
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Tutup</v-btn>
          <v-btn color="primary" @click="printInvoice"> Print </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePembayaranStore } from "~/stores/pembayaranStore";

const pembayaranStore = usePembayaranStore();

onMounted(async () => {
  await pembayaranStore.tarikDataPembayaran();
});

definePageMeta({
  layout: "admin",
});

const dialog = ref(false);
const selected = ref<any>({});
const printArea = ref();

const invoiceList = computed(() =>
  pembayaranStore.getDataPembayaran.filter(
    (item: any) => item.status === "Lunas",
  ),
);

const headers = [
  { title: "ID", key: "id_pembayaran" },
  { title: "Pasien", key: "nama_pasien" },
  { title: "Tanggal", key: "tanggal_bayar" },
  { title: "Metode", key: "metode" },
  { title: "Total", key: "jumlah_bayar" },
  { title: "Aksi", key: "aksi" },
];

function openInvoice(item: any) {
  selected.value = item;
  dialog.value = true;
}

function rupiah(val: number) {
  return new Intl.NumberFormat("id-ID").format(val || 0);
}

function formatDate(val: number) {
  return new Date(val * 1000).toLocaleString("id-ID");
}

/* 🔥 PRINT FIX */
function printInvoice() {
  const printContents = printArea.value.innerHTML;

  const win = window.open("", "", "width=800,height=700");

  win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding:20px }

          .row { display:flex; justify-content:space-between }
          .between { justify-content:space-between }
          .mb-16 { margin-bottom:16px }

          .title { font-size:18px; font-weight:bold }
          .small { font-size:12px; color:#777 }
          .right { text-align:right }

          .status {
            background:#4caf50;
            color:white;
            padding:3px 8px;
            font-size:11px;
            border-radius:5px;
            display:inline-block;
            margin-top:4px;
          }

          table {
            width:100%;
            border-collapse:collapse;
            margin-top:10px;
          }

          th, td {
            border:1px solid #ddd;
            padding:8px;
          }

          th {
            background:#f5f5f5;
          }

          .green { color:green }

          .total-box {
            margin-top:15px;
            padding:10px;
            background:#f5f5f5;
            display:flex;
            justify-content:space-between;
            font-weight:bold;
          }

          .footer {
            margin-top:20px;
            text-align:center;
            font-size:12px;
            color:#777;
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);

  win.document.close();
  win.print();
}
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
  margin-top: 4px;
  display: inline-block;
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

th {
  background: #f5f5f5;
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
