<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <!-- Main Content -->
  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5">Antrian Resep </span>
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
          Total: {{ resepStore.getDataResepObat.length }} resep
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headresep"
      :items="resepStore.getDataResepObat"
      :search="data.search"
      density="compact"
      class="text-caption"
    >
      <!-- NO -->
      <template v-slot:item.no="{ index }">
        <span class="text-grey-darken-1 font-weight-bold">
          {{ index + 1 }}
        </span>
      </template>

      <!-- ID RESEP -->
      <template v-slot:item.id_resep="{ item }">
        <v-chip size="x-small" color="primary" class="font-weight-bold">
          {{ item.id_resep }}
        </v-chip>
      </template>

      <!-- PASIEN -->
      <template v-slot:item.nama_pasien="{ item }">
        <div class="font-weight-medium">
          {{ item.nama_pasien }}
        </div>
      </template>

      <!-- DOKTER -->
      <template v-slot:item.nama_dokter="{ item }">
        <span class="text-grey-darken-1">
          {{ item.nama_dokter }}
        </span>
      </template>

      <!-- POLI -->
      <template v-slot:item.nama_poli="{ item }">
        <v-chip size="x-small" color="indigo">
          {{ item.nama_poli }}
        </v-chip>
      </template>

      <!-- DIAGNOSA -->
      <template v-slot:item.diagnosa="{ item }">
        <span class="text-caption text-grey-darken-2">
          {{ item.diagnosa || "-" }}
        </span>
      </template>

      <!-- TOTAL -->
      <template v-slot:item.total_harga="{ item }">
        <span class="font-weight-bold text-green-darken-2">
          Rp {{ item.total_harga?.toLocaleString() || 0 }}
        </span>
      </template>

      <!-- AKSI -->
      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            size="25"
            color="info"
            variant="tonal"
            class="mr-1"
            :to="`/admin/resep-obat/${item.id_resep}`"
          >
            <v-icon size="16">mdi-eye</v-icon>
          </v-btn>
        </div>
      </template>

      <!-- EMPTY -->
      <template v-slot:no-data>
        <div class="text-center py-6 text-grey">
          <v-icon size="40">mdi-pill</v-icon>
          <div>Belum ada data resep obat</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import type { resepObatM } from "~/types/resepObatModel";
const resepStore = useresepObatStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("resep_obat");
  await resepStore.tarikDataResepObatByStatus("Antrian");
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
    { title: "No", value: "no", width: "60px", align: "center" },
    { title: "ID Resep", value: "id_resep" },
    { title: "Pasien", value: "nama_pasien" },
    { title: "Dokter", value: "nama_dokter" },
    { title: "Poli", value: "nama_poli" },
    { title: "Diagnosa", value: "diagnosa" },
    { title: "Total", value: "total_harga", align: "end" },
    { title: "Status", value: "status" },
    { title: "Aksi", value: "aksi", align: "center", width: "120px" },
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
