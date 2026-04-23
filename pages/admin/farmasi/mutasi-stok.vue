<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <!-- Main Content -->
  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5">Mutasi Stok Obat</span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="3">
      <v-btn
        size="28"
        variant="outlined"
        color="grey-darken-1"
        class="border mr-3"
        @click="refreshData"
      >
        <v-icon size="18" icon="mdi-refresh" />
        <v-tooltip activator="parent" location="top"> Refresh Data </v-tooltip>
      </v-btn>
    </v-col>
  </v-row>

  <v-card class="border rounded-lg" flat>
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col cols="12" sm="10">
          <a-text-field
            v-model="data.search"
            placeholder="Search"
            style="max-width: 280px"
          />
        </v-col>

        <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
          Total: {{ mutasstokobatStore.getDataMutasiStokObat.length }} mutasi
          stok
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <!-- TABLE -->
    <v-data-table
      :headers="data.headresep"
      :items="mutasstokobatStore.getDataMutasiStokObat"
      :search="data.search"
      density="comfortable"
      class="modern-table"
    >
      <!-- TANGGAL -->
      <template #item.created_at="{ item }">
        <div class="text-caption">
          {{ rubahtanggalunix(item.created_at) }}
        </div>
      </template>

      <!-- OBAT -->
      <template #item.nama_obat="{ item }">
        <div class="font-weight-medium">
          {{ item.nama_obat }}
        </div>
        <div class="text-caption text-grey">
          {{ item.id_obat }}
        </div>
      </template>

      <!-- TIPE -->
      <template #item.tipe="{ item }">
        <v-chip
          size="x-small"
          :color="item.tipe === 'masuk' ? 'green' : 'red'"
          variant="flat"
          class="font-weight-bold"
        >
          {{ item.tipe === "masuk" ? "MASUK" : "KELUAR" }}
        </v-chip>
      </template>

      <!-- JUMLAH -->
      <template #item.jumlah="{ item }">
        <span
          :class="
            item.tipe === 'masuk'
              ? 'text-green-darken-2 font-weight-bold'
              : 'text-red-darken-2 font-weight-bold'
          "
        >
          {{ item.tipe === "masuk" ? "+" : "-" }}
          {{ item.jumlah }}
        </span>
      </template>

      <!-- STOK -->
      <template #item.stok_sebelum="{ item }">
        <span class="text-grey">
          {{ item.stok_sebelum }}
        </span>
      </template>

      <template #item.stok_sesudah="{ item }">
        <span class="font-weight-bold">
          {{ item.stok_sesudah }}
        </span>
      </template>

      <!-- REFERENSI -->
      <template #item.referensi="{ item }">
        <v-chip size="x-small" variant="outlined">
          {{ item.referensi || "-" }}
        </v-chip>
      </template>

      <!-- EMPTY -->
      <template #no-data>
        <div class="text-center py-6 text-grey">
          <v-icon size="40">mdi-database-off-outline</v-icon>
          <div>Tidak ada data mutasi</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import { useMutasiStokObatStore } from "~/stores/mutasiStokObatStore";
import type { resepObatM } from "~/types/resepObatModel";
const mutasstokobatStore = useMutasiStokObatStore();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("resep_obat");
  await mutasstokobatStore.tarikDataMutasiStokObat();
});

const data = reactive({
  search: "",
  id_resep: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,

  headresep: [
    { title: "Tanggal", key: "created_at" },
    { title: "Obat", key: "nama_obat" },
    { title: "Tipe", key: "tipe" },
    { title: "Jumlah", key: "jumlah" },
    { title: "Stok Sebelum", key: "stok_sebelum" },
    { title: "Stok Sesudah", key: "stok_sesudah" },
    { title: "Referensi", key: "referensi" },
    // { title: "Aksi", key: "aksi", sortable: false },
  ],
});

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_resep_erp");
  useloadingStore().setLoading(false);
}
</script>

<style scoped>
:deep() thead th {
  font-weight: bold !important;
  border: 1px solid #cbcbcb !important;
  background-color: #dddddd !important;
}

:deep() tbody td {
  border-right: 1px solid #e0e0e0 !important;
}
</style>
