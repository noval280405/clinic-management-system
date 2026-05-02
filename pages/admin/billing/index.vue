<template>
  <v-container fluid class="pa-3">
    <!-- HEADER -->
    <v-row align="center">
      <v-col cols="9">
        <div class="text-h5 font-weight-bold">Pembayaran</div>
      </v-col>
    </v-row>

    <!-- DIALOG PEMBAYARAN -->
    <v-dialog v-model="dialogBayar" max-width="500">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold">
          Pembayaran
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div class="mb-3">
            <div class="text-caption text-grey">Pasien</div>
            <div class="font-weight-bold">
              {{ selected.nama_pasien }}
            </div>
          </div>

          <div class="mb-3">
            <div class="text-caption text-grey">Total Tagihan</div>
            <div class="text-h6 font-weight-bold text-primary">
              Rp {{ rupiah(selected.total) }}
            </div>
          </div>

          <!-- METODE -->
          <a-select
            v-model="form.metode"
            :items="['Cash', 'Transfer', 'QRIS']"
            label="Metode Pembayaran"
            variant="outlined"
            density="comfortable"
          />

          <!-- JUMLAH BAYAR -->
          <a-text-field
            v-model.number="form.bayar"
            type="number"
            label="Jumlah Bayar"
            variant="outlined"
            density="comfortable"
          />

          <!-- KEMBALIAN -->
          <div v-if="form.bayar >= selected.total" class="mt-2">
            <div class="text-caption text-grey">Kembalian</div>
            <div class="text-green-darken-2 font-weight-bold">
              Rp {{ rupiah(kembalian) }}
            </div>
          </div>

          <div v-else class="mt-2 text-red text-caption">Uang kurang</div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="dialogBayar = false"> Batal </v-btn>

          <v-btn
            color="primary"
            :disabled="form.bayar < selected.total"
            @click="prosesBayar"
          >
            Bayar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          <v-btn size="small" color="success" @click="openBayar(item)" :disabled="item.status == 'Invoice'">
            Bayar
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import moment from "moment";
import { ref, computed } from "vue";
import { useBillingStore } from "~/stores/billingStore";
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

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

const dialogBayar = ref(false);

const form = ref({
  metode: "cash",
  bayar: 0,
});

const metodeList = [
  { title: "Cash", value: "cash" },
  { title: "Transfer", value: "transfer" },
  { title: "QRIS", value: "qris" },
];

const kembalian = computed(() => {
  return (form.value.bayar || 0) - (selected.value.total || 0);
});

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

function openBayar(item: any) {
  selected.value = item;
  form.value.bayar = item.total;
  form.value.metode = "cash";
  dialogBayar.value = true;
}

async function prosesBayar() {
  try {
    useloadingStore().setLoading(true);

    // 1. simpan pembayaran
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
      status: "Terbayar"
    });

    // 2. update billing
    await updateBilling(selected.value.id_billing, {
      status: "Terbayar",
      tanggal_bayar: moment().unix(),
    });

    dialogBayar.value = false;

    await billingStore.tarikDataBilling();

    notificationStore.showSuccess("Pembayaran berhasil");
  } catch (error: any) {
    console.error(error);
    notificationStore.showError(error.message);
  } finally {
    useloadingStore().setLoading(false);
  }
}
</script>
