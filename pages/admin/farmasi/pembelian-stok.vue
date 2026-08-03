<template>
  <v-container fluid class="pa-6">
    <!-- HEADER -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h5 font-weight-bold text-slate-800">Stok Masuk (Pembelian Supplier)</h1>
          <p class="text-caption text-grey">Pencatatan faktur barang masuk untuk sinkronisasi stok obat.</p>
        </div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="rounded-lg text-capitalize font-weight-bold shadow-sm"
          @click="openDialog"
        >
          Tambah Transaksi
        </v-btn>
      </v-col>
    </v-row>

    <!-- MAIN TABLE -->
    <v-card class="rounded-xl border-smooth shadow-sm" variant="flat">
      <v-data-table
        :headers="headers"
        :items="pembelianList"
        :loading="loading"
        hover
      >
        <!-- Custom Tampilan Tanggal -->
        <template v-slot:item.tanggal="{ item }">
          {{ formatDate(item.tanggal) }}
        </template>

        <!-- Custom Total Biaya -->
        <template v-slot:item.total_bayar="{ item }">
          <span class="font-weight-bold text-slate-700">
            {{ formatRupiah(item.total_bayar) }}
          </span>
        </template>

        <!-- Status Pembayaran Faktur -->
        <template v-slot:item.status="{ item }">
          <v-chip
            size="small"
            :color="item.status === 'Lunas' ? 'green-lighten-4 text-green-darken-3' : 'amber-lighten-4 text-amber-darken-3'"
            variant="flat"
            class="font-weight-bold"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Aksi -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye-outline"
            variant="text"
            color="slate-600"
            size="small"
            @click="viewDetail(item)"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG FORM TAMBAH STOK MASUK -->
    <v-dialog v-model="dialogForm" max-width="800px" persistent>
      <v-card class="rounded-xl pa-2">
        <v-card-title class="d-flex justify-space-between align-center px-4 pt-4">
          <span class="text-h6 font-weight-bold">Form Transaksi Pasokan Baru</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="dialogForm = false" />
        </v-card-title>

        <v-card-text class="px-4">
          <v-form ref="formRef">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-select
                  label="Pilih Supplier"
                  variant="outlined"
                  density="comfortable"
                  :items="['PT. Kimia Farma Trading', 'PT. Enseval', 'PT. Mensa Binamulia']"
                  v-model="form.supplier"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Nomor Faktur / Surat Jalan"
                  variant="outlined"
                  density="comfortable"
                  v-model="form.no_faktur"
                />
              </v-col>
            </v-row>

            <div class="text-subtitle-2 font-weight-bold mb-3 mt-2 text-primary">Detail Item Obat</div>
            
            <!-- Dinamis Input Item Obat -->
            <v-row dense v-for="(item, index) in form.items" :key="index" class="align-center mb-1">
              <v-col cols="12" sm="4">
                <v-select
                  label="Pilih Obat"
                  variant="outlined"
                  density="compact"
                  :items="['Paracetamol 500mg', 'Amoxicillin 250mg', 'Cough Syrup']"
                  v-model="item.nama_obat"
                />
              </v-col>
              <v-col cols="4" sm="2">
                <v-text-field
                  label="Qty"
                  type="number"
                  variant="outlined"
                  density="compact"
                  v-model.number="item.qty"
                />
              </v-col>
              <v-col cols="8" sm="3">
                <v-text-field
                  label="Harga Beli (Pcs)"
                  prefix="Rp"
                  variant="outlined"
                  density="compact"
                  v-model.number="item.harga_beli"
                />
              </v-col>
              <v-col cols="11" sm="2" class="text-right text-body-2 font-weight-bold text-slate-700">
                {{ formatRupiah(item.qty * item.harga_beli) }}
              </v-col>
              <v-col cols="1" class="text-center">
                <v-btn icon="mdi-delete-outline" color="red" variant="text" size="x-small" @click="removeItem(index)" :disabled="form.items.length === 1"/>
              </v-col>
            </v-row>

            <v-btn variant="tonal" size="small" prepend-icon="mdi-plus" class="mt-2 text-capitalize rounded-lg" color="primary" @click="addItem">
              Tambah Baris Obat
            </v-btn>
          </v-form>
        </v-card-text>

        <v-divider class="mt-4" />
        <v-card-actions class="pa-4 d-flex justify-space-between align-center">
          <div>
            <span class="text-caption text-grey d-block">Estimasi Total Pengeluaran:</span>
            <span class="text-h6 font-weight-black text-primary">{{ formatRupiah(calculatedTotal) }}</span>
          </div>
          <div class="d-flex gap-2">
            <v-btn variant="tonal" class="rounded-lg text-capitalize px-4" @click="dialogForm = false">Batal</v-btn>
            <v-btn color="primary" variant="elevated" class="rounded-lg text-capitalize px-5" @click="simpanTransaksi">Simpan & Masuk Stok</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
definePageMeta({
  layout: "admin",
}); 
const dialogForm = ref(false);
const loading = ref(false);

const headers = [
  { title: 'Tanggal', key: 'tanggal' },
  { title: 'No. Faktur', key: 'no_faktur' },
  { title: 'Supplier', key: 'supplier' },
  { title: 'Total Pembelian', key: 'total_bayar' },
  { title: 'Status', key: 'status' },
  { title: 'Aksi', key: 'actions', sortable: false, align: 'end' as const },
];

const pembelianList = ref([
  { tanggal: '2026-06-20', no_faktur: 'INV/2026/0192', supplier: 'PT. Kimia Farma Trading', total_bayar: 2450000, status: 'Lunas' },
  { tanggal: '2026-06-18', no_faktur: 'SJ/ENS-99122', supplier: 'PT. Enseval', total_bayar: 4120000, status: 'Kredit' },
]);

const form = ref({
  supplier: '',
  no_faktur: '',
  items: [{ nama_obat: '', qty: 1, harga_beli: 0 }]
});

const calculatedTotal = computed(() => {
  return form.value.items.reduce((acc, item) => acc + (item.qty * item.harga_beli), 0);
});

const openDialog = () => {
  form.value = { supplier: '', no_faktur: '', items: [{ nama_obat: '', qty: 1, harga_beli: 0 }] };
  dialogForm.value = true;
};

const addItem = () => form.value.items.push({ nama_obat: '', qty: 1, harga_beli: 0 });
const removeItem = (index: number) => form.value.items.splice(index, 1);

const simpanTransaksi = () => {
  // Integrasikan logika penyimpanan ke Firebase Firestore Anda di sini
  dialogForm.value = false;
};

const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
const formatDate = (dateStr: string) => dateStr; // Ganti dengan parser moment() jika perlu
</script>

<style scoped>
.border-smooth { border: 1px solid #e2e8f0 !important; }
.gap-2 { gap: 8px; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
</style>