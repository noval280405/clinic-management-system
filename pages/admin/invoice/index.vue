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
        <!-- TANGGAL -->
        <template #item.tanggal_bayar="{ item }">
          {{ formatDate(item.tanggal_bayar) }}
        </template>

        <!-- TOTAL -->
        <template #item.jumlah_bayar="{ item }">
          Rp {{ rupiah(item.jumlah_bayar) }}
        </template>

        <!-- METODE -->
        <template #item.metode="{ item }">
          <v-chip size="small" color="primary" variant="flat">
            {{ item.metode?.toUpperCase() }}
          </v-chip>
        </template>

        <!-- AKSI -->
        <template #item.aksi="{ item }">
          <v-btn size="small" color="primary" @click="openInvoice(item)">
            Lihat
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG INVOICE -->
    <v-dialog v-model="dialog" max-width="800">
      <v-card>
        <v-card-text>
          <div ref="printArea" class="invoice-paper">
            
            <!-- HEADER -->
            <div class="invoice-header">
              <div>
                <div class="text-h6 font-weight-bold">KLINIK SEHAT</div>
                <div class="text-caption">Jl. Contoh No.123</div>
              </div>
              <div class="text-right">
                <div class="text-h6 font-weight-bold">INVOICE</div>
                <div class="text-caption">
                  {{ selected.id_pembayaran }}
                </div>
              </div>
            </div>

            <v-divider class="my-2" />

            <!-- INFO -->
            <div class="invoice-info">
              <div><b>Pasien:</b> {{ selected.nama_pasien }}</div>
              <div><b>Metode:</b> {{ selected.metode }}</div>
              <div><b>Tanggal:</b> {{ formatDate(selected.tanggal_bayar) }}</div>
            </div>

            <v-divider class="my-2" />

            <!-- TABLE -->
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Deskripsi</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Tagihan</td>
                  <td>Rp {{ rupiah(selected.total_tagihan) }}</td>
                </tr>
                <tr>
                  <td>Jumlah Bayar</td>
                  <td>Rp {{ rupiah(selected.jumlah_bayar) }}</td>
                </tr>
                <tr>
                  <td>Kembalian</td>
                  <td>Rp {{ rupiah(selected.kembalian) }}</td>
                </tr>
              </tbody>
            </table>

            <v-divider class="my-2" />

            <!-- TOTAL -->
            <div class="text-right font-weight-bold text-h6">
              Dibayar: Rp {{ rupiah(selected.jumlah_bayar) }}
            </div>

            <!-- FOOTER -->
            <div class="invoice-footer">
              Terima kasih atas kunjungan Anda 🙏
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="dialog = false">Tutup</v-btn>
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

const dialog = ref(false);
const selected = ref<any>({});
const printArea = ref();

const headers = [
  { title: "ID Pembayaran", key: "id_pembayaran" },
  { title: "Pasien", key: "nama_pasien" },
  { title: "Tanggal", key: "tanggal_bayar" },
  { title: "Metode", key: "metode" },
  { title: "Total", key: "jumlah_bayar" },
  { title: "Aksi", key: "aksi", sortable: false },
];

// 🔥 ambil dari pembayaran (SUDAH FINAL)
const invoiceList = computed(() =>
  pembayaranStore.getDataPembayaran
);

function openInvoice(item: any) {
  selected.value = item;
  dialog.value = true;
}

function rupiah(val: number) {
  return new Intl.NumberFormat("id-ID").format(val || 0);
}

function formatDate(val: number) {
  if (!val) return "-";
  return new Date(val * 1000).toLocaleString("id-ID");
}

function printInvoice() {
  const printContents = printArea.value.innerHTML;
  const win = window.open("", "", "width=900,height=700");

  win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding:20px }
          table { width:100%; border-collapse: collapse }
          th, td { border:1px solid #ddd; padding:8px }
          th { background:#f5f5f5 }
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `);

  win.document.close();
  win.print();
}
</script>

<style scoped>
.invoice-paper {
  font-size: 14px;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
}

.invoice-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.invoice-table {
  width: 100%;
  margin-top: 10px;
}

.invoice-table th,
.invoice-table td {
  border: 1px solid #ddd;
  padding: 6px;
}

.invoice-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
}
</style>