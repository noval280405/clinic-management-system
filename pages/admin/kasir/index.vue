<template>
  <v-container fluid class="pa-6">
    <v-row>
      <!-- SISI KIRI: ANTRIAN BILLING KLINIK -->
      <v-col cols="12" md="7">
        <div class="mb-4">
          <h1 class="text-h5 font-weight-bold text-slate-800">Kasir Utama</h1>
          <p class="text-caption text-grey">Selesaikan pembayaran billing kunjungan pasien dan penebusan obat.</p>
        </div>

        <v-card class="rounded-xl border-smooth shadow-sm pa-4 bg-white" variant="flat">
          <div class="text-subtitle-1 font-weight-bold mb-3">Antrian Tagihan Aktif</div>
          
          <v-list class="pa-0 d-flex flex-column gap-2 bg-transparent">
            <v-list-item
              v-for="billing in billingQueue"
              :key="billing.id"
              class="rounded-xl border-smooth pa-3 position-relative cursor-pointer transition-all"
              :class="{ 'selected-billing': selectedBilling?.id === billing.id }"
              @click="selectBilling(billing)"
            >
              <div class="d-flex justify-space-between align-center w-100">
                <div class="d-flex align-center">
                  <v-avatar color="primary-lighten-5" class="rounded-lg mr-3" size="40">
                    <v-icon color="indigo" size="20">mdi-card-account-details-outline</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-body-2 font-weight-bold text-slate-800">{{ billing.nama_pasien }}</div>
                    <div class="text-caption text-grey">{{ billing.no_rm }} • {{ billing.poli }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-body-2 font-weight-black text-indigo-darken-2">{{ formatRupiah(billing.total) }}</div>
                  <v-chip size="x-small" color="amber-darken-2" variant="tonal" class="font-weight-bold mt-1">Unpaid</v-chip>
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- SISI KANAN: RINCIAN & AKSI PEMBAYARAN -->
      <v-col cols="12" md="5">
        <v-card class="rounded-xl border-smooth shadow-md pa-5 bg-white h-100" variant="flat" :disabled="!selectedBilling">
          <div v-if="!selectedBilling" class="d-flex flex-column align-center justify-center text-center py-12 h-100 text-grey-lighten-1">
            <v-icon size="64">mdi-cash-register</v-icon>
            <div class="text-body-2 font-weight-medium mt-2">Pilih antrian tagihan di sebelah kiri<br>untuk memproses pembayaran</div>
          </div>

          <div v-else>
            <div class="d-flex justify-space-between align-center mb-4">
              <span class="text-subtitle-1 font-weight-black">Rincian Komponen Biaya</span>
              <v-btn size="x-small" icon="mdi-close" variant="text" @click="selectedBilling = null" />
            </div>

            <!-- Manifes Biaya -->
            <div class="billing-manifest pa-3 rounded-xl bg-slate-50 mb-4 border-smooth">
              <div class="d-flex justify-space-between text-body-2 mb-2">
                <span class="text-grey">Biaya Jasa Dokter & Poli</span>
                <span class="font-weight-bold text-slate-700">{{ formatRupiah(selectedBilling.biaya_tindakan) }}</span>
              </div>
              <div class="d-flex justify-space-between text-body-2 mb-2">
                <span class="text-grey">Total Pembelian Obat</span>
                <span class="font-weight-bold text-slate-700">{{ formatRupiah(selectedBilling.biaya_obat) }}</span>
              </div>
              <v-divider class="my-2" />
              <div class="d-flex justify-space-between text-subtitle-1 font-weight-black mt-1">
                <span class="text-slate-800">Total Tagihan</span>
                <span class="text-indigo-darken-3">{{ formatRupiah(selectedBilling.total) }}</span>
              </div>
            </div>

            <!-- Form input pembayaran -->
            <v-select
              label="Metode Pembayaran"
              variant="outlined"
              density="comfortable"
              :items="['Tunai', 'Debit / EDC', 'QRIS', 'Transfer Bank']"
              v-model="paymentMethod"
              class="mb-2"
            />

            <v-text-field
              label="Nominal Uang Diterima"
              prefix="Rp"
              variant="outlined"
              density="comfortable"
              type="number"
              v-model.number="cashReceived"
              class="mb-2"
            />

            <!-- Kembalian -->
            <div class="d-flex justify-space-between align-center pa-3 rounded-xl bg-grey-lighten-4 mb-5">
              <span class="text-caption text-grey font-weight-bold">Uang Kembalian:</span>
              <span class="text-h6 font-weight-black" :class="changeAmount >= 0 ? 'text-green-darken-2' : 'text-red'">
                {{ formatRupiah(changeAmount) }}
              </span>
            </div>

            <v-btn
              block
              size="large"
              color="green-darken-2"
              variant="elevated"
              class="rounded-xl font-weight-bold text-capitalize"
              prepend-icon="mdi-printer"
              :disabled="changeAmount < 0 || !paymentMethod"
              @click="submitPayment"
            >
              Proses & Cetak Nota
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
definePageMeta({
  layout: "admin",
});
interface BillingItem {
  id: string;
  nama_pasien: string;
  no_rm: string;
  poli: string;
  biaya_tindakan: number;
  biaya_obat: number;
  total: number;
}

const selectedBilling = ref<BillingItem | null>(null);
const paymentMethod = ref('Tunai');
const cashReceived = ref<number>(0);

const billingQueue = ref<BillingItem[]>([
  { id: '1', nama_pasien: 'Ahmad Subarjo', no_rm: 'RM-00921', poli: 'Poli Umum', biaya_tindakan: 75000, biaya_obat: 124000, total: 199000 },
  { id: '2', nama_pasien: 'Siti Aminah', no_rm: 'RM-00925', poli: 'Poli Gigi', biaya_tindakan: 250000, biaya_obat: 45000, total: 295000 },
]);

const changeAmount = computed(() => {
  if (!selectedBilling.value) return 0;
  return cashReceived.value - selectedBilling.value.total;
});

const selectBilling = (billing: BillingItem) => {
  selectedBilling.value = billing;
  cashReceived.value = billing.total; // Default disamakan agar pas uangnya
};

const submitPayment = () => {
  // Tambah transaksi ke Firebase & update status pendaftaran/billing menjadi 'Lunas'
  alert(`Pembayaran berhasil diproses menggunakan ${paymentMethod.value}!`);
  if (selectedBilling.value) {
    billingQueue.value = billingQueue.value.filter(b => b.id !== selectedBilling.value?.id);
    selectedBilling.value = null;
  }
};

const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
</script>

<style scoped>
.border-smooth { border: 1px solid #e2e8f0 !important; }
.bg-slate-50 { background-color: #f8fafc !important; }
.gap-2 { gap: 8px; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.transition-all { transition: all 0.2s ease-in-out; }

.selected-billing {
  background-color: #f0f5ff !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08) !important;
}
</style>