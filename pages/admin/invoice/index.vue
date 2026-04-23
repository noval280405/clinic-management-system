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
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at!) }}
        </template>

        <template #item.total="{ item }">
          Rp {{ rupiah(item.total) }}
        </template>

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
                <div class="text-caption">{{ selected.id_billing }}</div>
              </div>
            </div>

            <v-divider class="my-2" />

            <!-- INFO -->
            <div class="invoice-info">
              <div><b>Pasien:</b> {{ selected.nama_pasien }}</div>
              <div><b>Dokter:</b> {{ selected.nama_dokter }}</div>
              <div><b>Tanggal:</b> {{ formatDate(selected.created_at) }}</div>
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
                  <td>Layanan</td>
                  <td>Rp {{ rupiah(selected.total_layanan) }}</td>
                </tr>
                <tr>
                  <td>Obat</td>
                  <td>Rp {{ rupiah(selected.total_obat) }}</td>
                </tr>
              </tbody>
            </table>

            <v-divider class="my-2" />

            <!-- TOTAL -->
            <div class="text-right font-weight-bold text-h6">
              Total: Rp {{ rupiah(selected.total) }}
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
import { ref, computed } from "vue";
import { useBillingStore } from "~/stores/billingStore";

definePageMeta({
  layout: "admin",
});

const billingStore = useBillingStore();

onMounted(async () => {
  await billingStore.tarikDataBilling();
});

const dialog = ref(false);
const selected = ref<any>({});
const printArea = ref();

const headers = [
  { title: "ID Billing", key: "id_billing" },
  { title: "Pasien", key: "nama_pasien" },
  { title: "Tanggal", key: "created_at" },
  { title: "Total", key: "total" },
  { title: "Aksi", key: "aksi", sortable: false },
];

// 🔥 hanya ambil yang lunas
const invoiceList = computed(() =>
  billingStore.getDataBilling.filter((item: any) => item.status === "Lunas"),
);

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
