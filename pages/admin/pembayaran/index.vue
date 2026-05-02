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
          <!-- PASIEN -->
          <div class="mb-3">
            <div class="text-caption text-grey">Pasien</div>
            <div class="font-weight-bold">
              {{ selected.nama_pasien }}
            </div>
          </div>

          <!-- TOTAL -->
          <div class="mb-3">
            <div class="text-caption text-grey">Total Tagihan</div>
            <div class="text-h6 font-weight-bold text-primary">
              Rp {{ rupiah(selected.total_tagihan) }}
            </div>
          </div>

          <!-- METODE -->
          <a-text-field
            v-model="selected.metode"
            :items="['Cash', 'Transfer', 'QRIS']"
            label="Metode Pembayaran"
            variant="outlined"
            disabled
          />

          <!-- BAYAR -->
          <a-text-field
            v-model.number="selected.jumlah_bayar"
            type="number"
            label="Jumlah Bayar"
            variant="outlined"
            disabled
          />

          <!-- KEMBALIAN -->
          <div
            v-if="selected.jumlah_bayar >= selected.total_tagihan"
            class="mt-2"
          >
            <div class="text-caption text-grey">Kembalian</div>
            <div class="text-green-darken-2 font-weight-bold">
              Rp {{ rupiah(selected.kembalian) }}
            </div>
          </div>

          <div v-else class="mt-2 text-red text-caption">Uang kurang</div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogBayar = false">Batal</v-btn>

          <v-btn color="primary" :disabled="!isValidBayar" @click="prosesBayar">
            Bayar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- TABLE -->
    <v-card class="mt-3">
      <v-data-table
        :headers="headers"
        :items="pembayaranStore.getDataPembayaran"
      >
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at!) }}
        </template>

        <template #item.total_tagihan="{ item }">
          Rp {{ rupiah(item.total_tagihan) }}
        </template>

        <template #item.aksi="{ item }">
          <v-btn
            size="small"
            color="success"
            @click="openBayar(item)"
            :disabled="item.status === 'Lunas'"
          >
            Bayar
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { ref, computed } from "vue";
import { usePembayaranStore } from "~/stores/pembayaranStore";
import type { pembayaranM } from "~/types/pembayaranModel";
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

const pembayaranStore = usePembayaranStore();

onMounted(async () => {
  await pembayaranStore.tarikDataPembayaran();
});

const dialog = ref(false);
const selected = ref<pembayaranM>({
  id_billing: "",
  id_pasien: "",
  id_dokter: "",
  total_tagihan: 0,
  jumlah_bayar: 0,
  kembalian: 0,
  metode: "",
  status: "",
});

const dialogBayar = ref(false);
// VALIDASI
const isValidBayar = computed(() => {
  return (
    selected.value.metode &&
    selected.value.jumlah_bayar >= selected.value.total_tagihan
  );
});

const form = ref({
  metode: "cash",
  bayar: 0,
});

const headers = [
  { title: "ID Billing", key: "id_billing" },
  { title: "Pasien", key: "nama_pasien" },
  { title: "Tanggal", key: "created_at" },
  { title: "Total", key: "total_tagihan" },
  { title: "Aksi", key: "aksi", sortable: false },
];

function rupiah(val: number) {
  return new Intl.NumberFormat("id-ID").format(val || 0);
}

function formatDate(val: number) {
  return new Date(val * 1000).toLocaleString("id-ID");
}

function openBayar(item: pembayaranM) {
  selected.value.kembalian = item.kembalian || 0;
  selected.value = _.assign({}, item);
  dialogBayar.value = true;
}

async function prosesBayar() {
  try {
    useloadingStore().setLoading(true);

    // 1. simpan pembayaran
    await updatePembayaran({
      id: selected.value.id!,
      id_billing: selected.value.id_billing,
      id_pasien: selected.value.id_pasien,
      id_dokter: selected.value.id_dokter,
      nama_dokter: selected.value.nama_dokter,
      nama_pasien: selected.value.nama_pasien,
      total_tagihan: selected.value.total_tagihan,
      jumlah_bayar: selected.value.jumlah_bayar,
      kembalian: selected.value.kembalian,
      metode: selected.value.metode,
      status: "Lunas",
      tanggal_bayar: moment().unix(),
    });

    dialogBayar.value = false;

    await pembayaranStore.tarikDataPembayaran();

    notificationStore.showSuccess("Pembayaran berhasil");
  } catch (error: any) {
    console.error(error);
    notificationStore.showError(error.message);
  } finally {
    useloadingStore().setLoading(false);
  }
}
</script>
