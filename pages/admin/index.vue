<template>
  <v-container fluid>
    <!-- SUMMARY -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-4 rounded-xl gradient-blue text-white">
          <div class="text-caption">Pasien</div>
          <div class="text-h5 font-weight-bold">
            {{ pasienStore.getDataPasien.length }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4 rounded-xl gradient-green text-white">
          <div class="text-caption">Dokter</div>
          <div class="text-h5 font-weight-bold">
            {{ dokterStore.getDataDokter.length }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4 rounded-xl gradient-purple text-white">
          <div class="text-caption">Obat</div>
          <div class="text-h5 font-weight-bold">
            {{ obatStore.getDataObat.length }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4 rounded-xl gradient-orange text-white">
          <div class="text-caption">Pendaftaran Hari Ini</div>
          <div class="text-h5 font-weight-bold">
            {{ totalHariIni }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- CHART -->
    <v-row class="mt-4">
      <!-- BAR CHART -->
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-xl">
          <div class="text-subtitle-2 font-weight-bold mb-3">
            Grafik Pendaftaran (7 Hari)
          </div>

          <Bar :data="chartPendaftaran" :options="chartOptions" />
        </v-card>
      </v-col>

      <!-- DOUGHNUT -->
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-xl">
          <div class="text-subtitle-2 font-weight-bold mb-3">
            Distribusi Stok Obat
          </div>

          <Doughnut :data="chartStok" :options="chartOptions" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import moment from "moment";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "vue-chartjs";

definePageMeta({
  layout: "admin",
});

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const pasienStore = usePasienStores();
const dokterStore = useDokterStores();
const obatStore = useobatStores();
const pendaftaranStore = usePendaftaranStores();

onMounted(async () => {
  await Promise.all([
    pasienStore.tarikDataPasien(),
    dokterStore.tarikDataDokter(),
    obatStore.tarikDataObat(),
    pendaftaranStore.tarikDataPendaftaran(),
  ]);
});

// =====================
// SUMMARY
// =====================
const totalHariIni = computed(() => {
  const today = moment().format("YYYY-MM-DD");

  return pendaftaranStore.getDataPendaftaran.filter(
    (i: any) => i.tanggal_kunjungan === today
  ).length;
});

// =====================
// CHART PENDAFTARAN
// =====================
const chartPendaftaran = computed(() => {
  const labels = [];
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const date = moment().subtract(i, "days").format("YYYY-MM-DD");

    labels.push(moment(date).format("DD/MM"));

    const count = pendaftaranStore.getDataPendaftaran.filter(
      (item: any) => item.tanggal_kunjungan === date
    ).length;

    data.push(count);
  }

  return {
    labels,
    datasets: [
      {
        label: "Pendaftaran",
        data,
        backgroundColor: [
          "#6366F1",
          "#22C55E",
          "#F59E0B",
          "#EF4444",
          "#06B6D4",
          "#8B5CF6",
          "#10B981",
        ],
        borderRadius: 8,
      },
    ],
  };
});

// =====================
// CHART STOK
// =====================
const chartStok = computed(() => {
  const top = [...obatStore.getDataObat]
    .sort((a: any, b: any) => b.stok - a.stok)
    .slice(0, 5);

  return {
    labels: top.map((i: any) => i.nama_obat),
    datasets: [
      {
        data: top.map((i: any) => i.stok),
        backgroundColor: [
          "#6366F1",
          "#22C55E",
          "#F59E0B",
          "#EF4444",
          "#06B6D4",
        ],
      },
    ],
  };
});

// =====================
// OPTIONS
// =====================
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};
</script>

<style scoped>
.gradient-blue {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
}

.gradient-green {
  background: linear-gradient(135deg, #22c55e, #10b981);
}

.gradient-purple {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
}

.gradient-orange {
  background: linear-gradient(135deg, #f59e0b, #f97316);
}
</style>