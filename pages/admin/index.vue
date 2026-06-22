<template>
  <v-container fluid class="pa-6 grey lighten-4">
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold deep-purple--text text--darken-4">
          Dashboard Analitik
        </h1>
        <p class="text-subtitle-1 text-secondary">
          Pantau performa klinik dan ketersediaan logistik hari ini.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-5 rounded-xl gradient-blue text-white custom-card" elevation="2">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-uppercase font-weight-medium opacity-75">Pasien</div>
              <div class="text-h4 font-weight-black mt-1">
                {{ pasienStore.getDataPasien.length }}
              </div>
            </div>
            <v-avatar color="rgba(255, 255, 255, 0.2)" size="56" class="rounded-xl">
              <v-icon size="28" color="white">mdi-account-group</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-5 rounded-xl gradient-green text-white custom-card" elevation="2">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-uppercase font-weight-medium opacity-75">Dokter</div>
              <div class="text-h4 font-weight-black mt-1">
                {{ dokterStore.getDataDokter.length }}
              </div>
            </div>
            <v-avatar color="rgba(255, 255, 255, 0.2)" size="56" class="rounded-xl">
              <v-icon size="28" color="white">mdi-doctor</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-5 rounded-xl gradient-purple text-white custom-card" elevation="2">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-uppercase font-weight-medium opacity-75">Varian Obat</div>
              <div class="text-h4 font-weight-black mt-1">
                {{ obatStore.getDataObat.length }}
              </div>
            </div>
            <v-avatar color="rgba(255, 255, 255, 0.2)" size="56" class="rounded-xl">
              <v-icon size="28" color="white">mdi-pill</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-5 rounded-xl gradient-orange text-white custom-card" elevation="2">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-uppercase font-weight-medium opacity-75">Registrasi Hari Ini</div>
              <div class="text-h4 font-weight-black mt-1">
                {{ totalHariIni }}
              </div>
            </div>
            <v-avatar color="rgba(255, 255, 255, 0.2)" size="56" class="rounded-xl">
              <v-icon size="28" color="white">mdi-calendar-check</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" lg="7">
        <v-card class="pa-6 rounded-xl custom-chart-card" elevation="1">
          <div class="d-flex justify-space-between align-center mb-6">
            <div>
              <div class="text-h6 font-weight-bold text-neutral">Tren Pendaftaran</div>
              <div class="text-caption text-secondary">Aktivitas kunjungan pasien 7 hari terakhir</div>
            </div>
            <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold">Mingguan</v-chip>
          </div>
          <div class="chart-container">
            <Bar :data="chartPendaftaran" :options="barOptions" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card class="pa-6 rounded-xl custom-chart-card" elevation="1">
          <div class="d-flex justify-space-between align-center mb-6">
            <div>
              <div class="text-h6 font-weight-bold text-neutral">Top Stok Obat</div>
              <div class="text-caption text-secondary">5 produk dengan kuantitas tertinggi</div>
            </div>
          </div>
          <div class="chart-container doughnut-box">
            <Doughnut :data="chartStok" :options="doughnutOptions" />
          </div>
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
    labels.push(moment(date).format("DD MMM"));

    const count = pendaftaranStore.getDataPendaftaran.filter(
      (item: any) => item.tanggal_kunjungan === date
    ).length;
    data.push(count);
  }

  return {
    labels,
    datasets: [
      {
        label: "Jumlah Pasien",
        data,
        backgroundColor: "rgba(99, 102, 241, 0.85)",
        hoverBackgroundColor: "rgba(99, 102, 241, 1)",
        borderRadius: 8,
        borderSkipped: false,
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
          "#4F46E5",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#06B6D4",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };
});

// =====================
// OPTIONS (MODERNIZED)
// =====================
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Kita sembunyikan default legend bar agar clean
    },
  },
};

const barOptions = {
  ...baseOptions,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: { family: 'Plus Jakarta Sans, sans-serif', size: 11 },
        color: '#64748B'
      }
    },
    y: {
      grid: {
        color: '#F1F5F9',
      },
      ticks: {
        font: { family: 'Plus Jakarta Sans, sans-serif', size: 11 },
        color: '#64748B',
        stepSize: 1
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom" as const,
      labels: {
        boxWidth: 12,
        padding: 15,
        font: { family: 'Plus Jakarta Sans, sans-serif', size: 12 },
        color: '#334155'
      }
    },
  },
  cutout: "75%", // Membuat donut chart lebih tipis dan elegan
};
</script>

<style scoped>
/* Gradient Cards */
.gradient-blue {
  background: linear-gradient(135deg, #2563eb, #6366f1);
}
.gradient-green {
  background: linear-gradient(135deg, #059669, #10b981);
}
.gradient-purple {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
}
.gradient-orange {
  background: linear-gradient(135deg, #ea580c, #f97316);
}

/* Hover Effects & Shadows */
.custom-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px -2px rgba(50, 50, 93, 0.1), 0 2px 8px -1px rgba(0, 0, 0, 0.05) !important;
}
.custom-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -4px rgba(50, 50, 93, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.08) !important;
}

.custom-chart-card {
  border: 1px solid #f1f5f9 !important;
  box-shadow: 0 2px 12px 0 rgba(11, 22, 44, 0.03) !important;
}

.opacity-75 {
  opacity: 0.75;
}

/* Chart heights alignment */
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.doughnut-box {
  padding: 10px 0;
}
</style>