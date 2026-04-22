<template>
  <v-container fluid class="pa-2" v-if="detailResepObat">
    <ConfirmationDialog ref="confirmationDialog" />
    <!-- HEADER -->
    <v-card class="rounded-2xl elevation-3 mb-2 header-gradient">
      <v-card-text
        class="d-flex justify-space-between align-center pa-4 flex-wrap ga-2"
      >
        <div class="d-flex align-center ga-3">
          <div class="icon-wrap">
            <v-icon color="white">mdi-pill</v-icon>
          </div>

          <div>
            <div class="text-h6 font-weight-bold">Detail Resep Obat</div>
            <div class="text-caption text-white-opacity">
              {{ rubahtanggalunix(detailResepObat.created_at) }}
            </div>
          </div>
        </div>

        <v-chip class="chip-glow font-weight-bold" size="small">
          {{ detailResepObat.id_resep }}
        </v-chip>
      </v-card-text>
    </v-card>

    <v-row dense>
      <!-- LEFT -->
      <v-col cols="12" md="8">
        <!-- PATIENT INFO -->
        <v-card class="rounded-2xl elevation-1 mb-2 card-glass">
          <v-card-text class="py-4">
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="label">Pasien</div>
                <div class="value">{{ detailResepObat.nama_pasien }}</div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="label">Dokter</div>
                <div class="value">{{ detailResepObat.nama_dokter }}</div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="label">Poli</div>
                <v-chip size="x-small" class="chip-soft">
                  {{ detailResepObat.nama_poli }}
                </v-chip>
              </v-col>

              <v-col cols="12" class="mt-2">
                <div class="label">Diagnosa</div>
                <div class="value text-red-darken-2">
                  {{ detailResepObat.diagnosa }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- OBAT LIST -->
        <v-card class="rounded-2xl elevation-2">
          <v-card-title class="text-subtitle-2 font-weight-bold">
            Daftar Obat
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-2">
            <v-row dense>
              <v-col
                v-for="(item, i) in detailResepObat.items_obat"
                :key="i"
                cols="12"
                sm="6"
              >
                <v-card class="drug-card rounded-xl pa-3" variant="flat">
                  <!-- HEADER -->
                  <div class="d-flex justify-space-between align-start">
                    <div>
                      <div class="drug-title">
                        {{ item.nama_obat }}
                      </div>
                      <div class="drug-sub">
                        {{ item.id_obat }}
                      </div>
                    </div>

                    <v-chip size="x-small" class="qty-chip">
                      x{{ item.jumlah }}
                    </v-chip>
                  </div>

                  <div class="divider-soft my-2"></div>

                  <!-- DETAIL -->
                  <div class="drug-grid">
                    <div>
                      <span>Dosis</span>
                      <b>{{ item.dosis || "-" }}</b>
                    </div>

                    <div>
                      <span>Harga</span>
                      <b>Rp {{ rupiah(item.harga || 0) }}</b>
                    </div>

                    <div>
                      <span>Subtotal</span>
                      <b class="text-green-darken-2">
                        Rp {{ rupiah(item.subtotal || 0) }}
                      </b>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <div
              v-if="!detailResepObat.items_obat?.length"
              class="text-center text-grey py-6"
            >
              <v-icon size="40">mdi-pill-off</v-icon>
              <div>Belum ada obat</div>
            </div>
          </v-card-text>
          <v-card-actions class="d-flex flex-wrap gap-2 pa-3">
            <v-btn
              color="orange"
              :disabled="detailResepObat.status !== 'Draft'"
              variant="flat"
              size="small"
              prepend-icon="mdi-clock-outline"
              @click="masukkeantrian()"
            >
              Masuk Antrian
            </v-btn>

            <v-btn
              color="blue"
              :disabled="detailResepObat.status !== 'Antrian'"
              variant="flat"
              size="small"
              prepend-icon="mdi-progress-check"
              @click="prosesobat()"
            >
              Proses Obat
            </v-btn>

            <v-btn
              color="green"
              :disabled="detailResepObat.status !== 'Diproses'"
              variant="flat"
              size="small"
              prepend-icon="mdi-check-circle"
              @click="selesai()"
            >
              Selesai
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- RIGHT -->
      <v-col cols="12" md="4">
        <!-- TOTAL -->
        <v-card class="rounded-2xl elevation-3 total-card mb-2">
          <v-card-text class="text-center pa-5">
            <div class="text-caption text-grey">TOTAL BIAYA</div>

            <div class="total-price">
              Rp {{ rupiah(detailResepObat.total_harga || 0) }}
            </div>

            <v-chip class="mt-2 chip-success" size="small">
              READY TO PRINT
            </v-chip>
          </v-card-text>
        </v-card>

        <!-- META -->
        <v-card class="rounded-2xl elevation-1">
          <v-card-title class="text-subtitle-2 font-weight-bold">
            Informasi
          </v-card-title>

          <v-divider />

          <v-card-text class="text-caption pa-3">
            <div class="meta-item">
              <span>ID Pasien</span>
              <b>{{ detailResepObat.id_pasien }}</b>
            </div>

            <div class="meta-item">
              <span>ID Dokter</span>
              <b>{{ detailResepObat.id_dokter }}</b>
            </div>

            <div class="meta-item">
              <span>ID Pemeriksaan</span>
              <b>{{ detailResepObat.id_pemeriksaan }}</b>
            </div>

            <div class="meta-item">
              <span>Created By</span>
              <b>{{ detailResepObat.created_by }}</b>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin" });

const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

const resepStore = useresepObatStores();
const route = useRoute();

onMounted(async () => {
  await resepStore.tarikDetailResepObat(route.params.id as string);
});

const detailResepObat = computed(() => resepStore.getDetailResepObat);

function rupiah(val: number) {
  return new Intl.NumberFormat("id-ID").format(val || 0);
}

async function masukkeantrian() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Masuk Antrian",
    "Anda yakin ingin memasukkan resep ini ke antrian?",
  );

  if (!confirmed) {
    return notificationStore.showError("masuk antrian dibatalkan");
  }
  useloadingStore().setLoading(true);

  const res = await updateStatusResep({
    ...detailResepObat.value,
    status: "Antrian",
  });

  if (res === "ok") {
    notificationStore.showSuccess("Resep masuk antrian apotek");
    await resepStore.tarikDetailResepObat(route.params.id as string);
  } else {
    notificationStore.showError(res);
  }

  useloadingStore().setLoading(false);
}

async function prosesobat() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Proses Obat",
    "Anda yakin ingin memproses obat untuk resep ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("proses obat dibatalkan");
  }
  useloadingStore().setLoading(true);

  const res = await updateStatusResep({
    ...detailResepObat.value,
    status: "Diproses",
  });

  if (res === "ok") {
    notificationStore.showSuccess("Obat sedang diproses");
    await resepStore.tarikDetailResepObat(route.params.id as string);
  } else {
    notificationStore.showError(res);
  }

  useloadingStore().setLoading(false);
}

async function selesai() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Selesai",
    "Anda yakin ingin menandai resep ini sebagai selesai?",
  );

  if (!confirmed) {
    return notificationStore.showError("selesai dibatalkan");
  }
  useloadingStore().setLoading(true);

  const res = await updateStatusResep({
    ...detailResepObat.value,
    status: "Selesai",
  });

  if (res === "ok") {
    notificationStore.showSuccess("Obat sudah diberikan ke pasien");
    await resepStore.tarikDetailResepObat(route.params.id as string);
  } else {
    notificationStore.showError(res);
  }

  useloadingStore().setLoading(false);
}
</script>

<style scoped>
.header-gradient {
  background: linear-gradient(135deg, #7c4dff, #512da8);
  color: white;
}

.icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-white-opacity {
  color: rgba(255, 255, 255, 0.85);
}

.chip-glow {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.card-glass {
  background: #fafafa;
}

.label {
  font-size: 11px;
  color: #888;
}

.value {
  font-weight: 600;
}

.drug-card {
  border: 1px solid #eee;
  transition: 0.2s;
}

.drug-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.drug-title {
  font-weight: 700;
}

.drug-sub {
  font-size: 11px;
  color: #888;
}

.qty-chip {
  background: #e8f5e9 !important;
  color: #2e7d32 !important;
}

.divider-soft {
  height: 1px;
  background: #eee;
}

.drug-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  font-size: 12px;
}

.drug-grid span {
  display: block;
  font-size: 10px;
  color: #888;
}

.total-card {
  background: linear-gradient(135deg, #e8f5e9, #ffffff);
}

.total-price {
  font-size: 24px;
  font-weight: 800;
  color: #2e7d32;
}

.chip-success {
  background: #2e7d32 !important;
  color: white !important;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
</style>
