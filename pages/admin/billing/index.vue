<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <!-- HEADER -->
  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5">Billing</span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="3" class="text-right">
      <v-btn
        size="small"
        variant="outlined"
        color="grey-darken-1"
        @click="refreshData"
      >
        <v-icon size="18">mdi-refresh</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <!-- CARD -->
  <v-card class="rounded-xl elevation-2">
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col cols="12" sm="8">
          <v-text-field
            v-model="data.search"
            placeholder="Cari pasien / billing..."
            density="compact"
            variant="outlined"
            hide-details
            prepend-inner-icon="mdi-magnify"
          />
        </v-col>

        <v-col cols="12" sm="4" class="text-right text-caption text-grey">
          Total: {{ billingStore.getDataBilling.length }} billing
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <!-- TABLE -->
    <v-data-table
      :headers="data.headers"
      :items="billingStore.getDataBilling"
      :search="data.search"
      density="comfortable"
      class="modern-table"
    >
      <!-- TANGGAL -->
      <template #item.created_at="{ item }">
        <span class="text-caption">
          {{ rubahtanggalunix(item.created_at) }}
        </span>
      </template>

      <!-- BILLING -->
      <template #item.id_billing="{ item }">
        <div class="font-weight-bold">
          {{ item.id_billing }}
        </div>
        <div class="text-caption text-grey">
          {{ item.id_resep }}
        </div>
      </template>

      <!-- PASIEN -->
      <template #item.nama_pasien="{ item }">
        <div class="font-weight-medium">
          {{ item.nama_pasien }}
        </div>
      </template>

      <!-- TOTAL -->
      <template #item.total="{ item }">
        <span class="font-weight-bold text-green-darken-2">
          Rp {{ rupiah(item.total) }}
        </span>
      </template>

      <!-- STATUS -->
      <template #item.status="{ item }">
        <v-chip
          size="x-small"
          class="font-weight-bold"
          :color="
            item.status === 'Lunas'
              ? 'green'
              : item.status === 'Siap Bayar'
              ? 'orange'
              : 'red'
          "
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- AKSI -->
      <template #item.aksi="{ item }">
        <v-btn
          size="x-small"
          color="green"
          variant="flat"
          @click="bayar(item)"
          :disabled="item.status === 'Lunas'"
        >
          Bayar
        </v-btn>
      </template>

      <!-- EMPTY -->
      <template #no-data>
        <div class="text-center py-6 text-grey">
          <v-icon size="40">mdi-cash-remove</v-icon>
          <div>Tidak ada data billing</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useBillingStore } from "~/stores/billingStore";

const billingStore = useBillingStore();
const confirmationDialog = ref(null);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  await billingStore.tarikDataBilling();
});

const data = reactive({
  search: "",
  headers: [
    { title: "Tanggal", key: "created_at" },
    { title: "Billing", key: "id_billing" },
    { title: "Pasien", key: "nama_pasien" },
    { title: "Total", key: "total" },
    { title: "Status", key: "status" },
    { title: "Aksi", key: "aksi", sortable: false },
  ],
});

function rupiah(val: number) {
  return new Intl.NumberFormat("id-ID").format(val || 0);
}

function rubahtanggalunix(ts: number) {
  if (!ts) return "-";
  return new Date(ts * 1000).toLocaleString("id-ID");
}

// =============================
// ACTION BAYAR
// =============================
async function bayar(item: any) {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi",
    `Bayar billing ${item.id_billing}?`
  );

  if (!confirmed) return;

  await billingStore.updateStatusBilling(item.id_billing, "Lunas");
}

function refreshData() {
  billingStore.tarikDataBilling();
}
</script>

<style scoped>
.modern-table {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.v-data-table-header) {
  background: #f5f5f5;
  font-weight: bold;
}

:deep(.v-data-table tbody tr:hover) {
  background: #fafafa;
  transition: 0.2s;
}
</style>