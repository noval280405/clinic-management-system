<template>
  <!-- Background Slate-Light agar kartu di atasnya terlihat pop-out -->
  <v-container
    fluid
    class="pa-6 bg-slate-lighten-5"
    style="background-color: #f8fafc"
    v-if="detailResepObat"
  >
    <ConfirmationDialog ref="confirmationDialog" />

    <!-- ================= MODERN FLOATING HEADER ================= -->
    <v-card
      class="rounded-2xl border-none mb-6 text-white position-relative overflow-hidden"
      style="
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        box-shadow: 0 10px 25px -5px rgba(29, 78, 216, 0.3);
      "
    >
      <!-- Elemen Dekoratif Lingkaran Modern di Background Header -->
      <div
        class="position-absolute"
        style="
          right: -20px;
          top: -20px;
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.08);
          rounded: 50%;
        "
      ></div>

      <v-card-text
        class="pa-6 d-flex justify-space-between align-center flex-wrap ga-4 position-relative"
      >
        <div class="d-flex align-center ga-4">
          <!-- Avatar dengan Efek Kaca Transparan Lembut -->
          <v-avatar
            size="60"
            class="elevation-0"
            style="
              background: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(4px);
            "
          >
            <v-icon color="white" size="28">mdi-pill</v-icon>
          </v-avatar>

          <div>
            <div
              class="text-h5 font-weight-black tracking-wide"
              style="letter-spacing: -0.5px !important"
            >
              Detail Resep Obat
            </div>
            <div
              class="text-body-2 text-blue-100 mt-1 d-flex align-center font-weight-medium"
            >
              <v-icon size="16" class="mr-2" color="blue-200"
                >mdi-calendar-clock</v-icon
              >
              {{ rubahtanggalunix(detailResepObat.created_at) }}
            </div>
          </div>
        </div>

        <!-- ID Resep Bergaya Label Tag Modern -->
        <div class="d-flex flex-column align-end">
          <span
            class="text-caption text-blue-200 font-weight-bold uppercase tracking-wider"
            >NOMOR RESEP</span
          >
          <span
            class="text-h6 font-weight-black px-4 py-1 rounded-xl mt-1 text-white"
            style="background: rgba(0, 0, 0, 0.2)"
          >
            {{ detailResepObat.id_resep }}
          </span>
        </div>
      </v-card-text>
    </v-card>

    <v-row class="ga-0">
      <!-- ================= SISI KIRI (INFO & DROGS LIST) ================= -->
      <v-col cols="12" md="8" class="pa-2">
        <!-- CARD IDENTITAS PASIEN: MODERN CLEAN MINIMALIST -->
        <v-card
          class="rounded-2xl border-none mb-5 bg-white"
          style="box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.03)"
        >
          <v-card-text class="pa-6">
            <v-row class="ga-y-4">
              <v-col cols="12" sm="4" class="d-flex align-center ga-3">
                <v-avatar color="blue-lighten-5" class="rounded-xl" size="48">
                  <v-icon color="blue-darken-2" size="22"
                    >mdi-account-circle-outline</v-icon
                  >
                </v-avatar>
                <div>
                  <div
                    class="text-caption text-grey-darken-1 font-weight-bold text-uppercase tracking-wider"
                  >
                    Pasien
                  </div>
                  <div class="text-h6 font-weight-black text-slate-900 mt-0.5">
                    {{ detailResepObat.nama_pasien }}
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="4" class="d-flex align-center ga-3">
                <v-avatar color="purple-lighten-5" class="rounded-xl" size="48">
                  <v-icon color="purple-darken-2" size="22">mdi-doctor</v-icon>
                </v-avatar>
                <div>
                  <div
                    class="text-caption text-grey-darken-1 font-weight-bold text-uppercase tracking-wider"
                  >
                    Dokter
                  </div>
                  <div class="text-h6 font-weight-bold text-slate-800 mt-0.5">
                    {{ detailResepObat.nama_dokter }}
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="4" class="d-flex align-center ga-3">
                <v-avatar color="indigo-lighten-5" class="rounded-xl" size="48">
                  <v-icon color="indigo-darken-2" size="22"
                    >mdi-office-building-marker-outline</v-icon
                  >
                </v-avatar>
                <div>
                  <div
                    class="text-caption text-grey-darken-1 font-weight-bold text-uppercase tracking-wider"
                  >
                    Poliklinik
                  </div>
                  <div
                    class="text-body-1 font-weight-black text-indigo-darken-3 mt-0.5"
                  >
                    {{ detailResepObat.nama_poli }}
                  </div>
                </div>
              </v-col>

              <!-- Diagnosa dengan Desain Border Kiri Melengkung Premium -->
              <v-col cols="12" class="mt-2">
                <v-card
                  variant="flat"
                  class="rounded-2xl pa-4 text-body-1 text-slate-800 font-weight-medium d-flex align-start ga-3"
                  style="
                    background-color: #fef2f2;
                    border-left: 5px solid #ef4444 !important;
                  "
                >
                  <v-icon color="red-darken-1" size="24" class="mt-0.5"
                    >mdi-shield-alert-outline</v-icon
                  >
                  <div>
                    <div
                      class="text-caption text-red-darken-3 font-weight-black text-uppercase tracking-wide"
                    >
                      Diagnosa Medis
                    </div>
                    <div
                      class="mt-1 font-weight-bold text-red-darken-4"
                      style="line-height: 1.6"
                    >
                      {{
                        detailResepObat.diagnosa ||
                        "Tidak ada data diagnosa terlampir."
                      }}
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- LIST DAFTAR OBAT: ROW CARDS WITH MODERN COMPACT BADGES -->
        <v-card
          class="rounded-2xl border-none bg-white"
          style="box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.03)"
        >
          <div
            class="px-6 pt-5 pb-4 text-h6 font-weight-black text-slate-900 d-flex align-center"
          >
            <v-avatar color="teal-lighten-5" size="32" class="mr-3 rounded-lg">
              <v-icon color="teal-darken-2" size="18">mdi-pill</v-icon>
            </v-avatar>
            Daftar Racikan Obat
          </div>
          <v-divider class="border-opacity-25" />

          <v-card-text class="pa-4 bg-white">
            <v-card
              variant="flat"
              class="rounded-xl overflow-hidden"
              style="border: 1px solid #e2e8f0 !important"
            >
              <v-list
                class="pa-0"
                lines="one"
                v-if="detailResepObat.items_obat?.length"
              >
                <v-list-item
                  v-for="(item, i) in detailResepObat.items_obat"
                  :key="i"
                  class="pa-4 bg-white"
                  style="border-bottom: 1px solid #f1f5f9 !important"
                >
                  <div
                    class="d-flex align-center justify-space-between flex-wrap ga-3 w-100"
                  >
                    <div
                      class="d-flex align-center ga-3"
                      style="min-width: 200px"
                    >
                      <v-avatar
                        color="blue-lighten-5"
                        size="36"
                        class="rounded-lg"
                      >
                        <v-icon color="blue-darken-2" size="18"
                          >mdi-pill</v-icon
                        >
                      </v-avatar>
                      <div>
                        <div
                          class="text-body-1 font-weight-black text-slate-900 leading-tight"
                        >
                          {{ item.nama_obat }}
                        </div>
                        <div
                          class="text-caption text-grey-darken-1 font-weight-medium mt-0.5"
                        >
                          Kode:
                          <span class="font-mono">{{ item.id_obat }}</span>
                        </div>
                      </div>
                    </div>

                    <div style="min-width: 140px">
                      <div
                        class="text-caption text-grey font-weight-bold text-uppercase tracking-wider"
                        style="font-size: 10px !important"
                      >
                        Aturan & Dosis
                      </div>
                      <div
                        class="text-body-2 font-weight-black text-purple-darken-3 d-flex align-center mt-0.5"
                      >
                        <v-icon size="14" class="mr-1" color="purple-darken-2"
                          >mdi-clock-outline</v-icon
                        >
                        {{ item.dosis || "-" }}
                      </div>
                    </div>

                    <div class="text-sm-center" style="min-width: 80px">
                      <div
                        class="text-caption text-grey font-weight-bold text-uppercase tracking-wider"
                        style="font-size: 10px !important"
                      >
                        Jumlah
                      </div>
                      <v-chip
                        size="x-small"
                        color="slate-700"
                        variant="flat"
                        class="font-weight-black text-white px-2 mt-1"
                      >
                        {{ item.jumlah }} Pcs
                      </v-chip>
                    </div>

                    <div class="text-sm-right" style="min-width: 100px">
                      <div
                        class="text-caption text-grey font-weight-bold text-uppercase tracking-wider"
                        style="font-size: 10px !important"
                      >
                        Satuan
                      </div>
                      <div
                        class="text-body-2 font-weight-medium text-slate-600 mt-0.5"
                      >
                        Rp{{ rupiah(item.harga || 0) }}
                      </div>
                    </div>

                    <div class="text-sm-right" style="min-width: 120px">
                      <div
                        class="text-caption text-grey font-weight-bold text-uppercase tracking-wider"
                        style="font-size: 10px !important"
                      >
                        Subtotal
                      </div>
                      <div
                        class="text-body-1 font-weight-black text-slate-900 mt-0.5"
                      >
                        Rp{{ rupiah(item.subtotal || 0) }}
                      </div>
                    </div>
                  </div>
                </v-list-item>

                <!-- ================= BARIS GRAND TOTAL CLEAN LIGHT STYLE ================= -->
                <div
                  class="d-flex justify-space-between align-center pa-4"
                  style="
                    background-color: #f1f5f9;
                    border-top: 2px solid #e2e8f0;
                  "
                >
                  <div class="d-flex align-center ga-3">
                    <!-- Kotak Ikon Halus -->
                    <v-avatar
                      color="green-lighten-5"
                      size="36"
                      class="rounded-lg"
                    >
                      <v-icon color="green-darken-2"
                        >mdi-receipt-text-outline</v-icon
                      >
                    </v-avatar>
                    <div>
                      <div
                        class="text-caption text-grey-darken-1 font-weight-bold text-uppercase tracking-wider"
                        style="font-size: 10px !important; line-height: 1"
                      >
                        Ringkasan Pembayaran
                      </div>
                      <div
                        class="text-body-1 font-weight-black text-slate-900 mt-0.5"
                      >
                        Grand Total Resep
                      </div>
                    </div>
                  </div>

                  <!-- Nominal Uang yang Bersih, Tegas, dan Nyala Proporsional -->
                  <div class="text-right">
                    <h3
                      class="text-h4 black text-green-darken-2"
                      style="
                        font-family: monospace, sans-serif !important;
                        letter-spacing: -1px;
                      "
                    >
                      Rp {{ rupiah(detailResepObat.total_harga || 0) }}
                    </h3>
                  </div>
                </div>
              </v-list>

              <div
                v-else
                class="text-center py-8 bg-white d-flex flex-column align-center justify-center"
              >
                <v-icon size="36" color="grey-lighten-1" class="mb-1"
                  >mdi-tray-minus</v-icon
                >
                <div class="text-body-2 font-weight-bold text-slate-700">
                  Resep Kosong
                </div>
                <div class="text-caption text-grey">
                  Belum ada obat yang diinput ke resep ini.
                </div>
              </div>
            </v-card>
          </v-card-text>

          <v-divider class="border-opacity-25" />

          <v-card-actions
            class="d-flex flex-wrap ga-1.5 pa-3 bg-white rounded-b-xl justify-end"
          >
            <!-- TOMBOL 1: KIRIM KE ANTRIAN -->
            <v-btn
              :disabled="detailResepObat.status !== 'Draft'"
              variant="flat"
              color="orange-darken-3"
              style="
                font-weight: 700;
                border-radius: 6px;
                height: 32px;
                text-transform: none;
                letter-spacing: 0.2px;
              "
              class="text-caption px-3 text-white"
              @click="masukkeantrian()"
            >
              <!-- Menggunakan icon universal mdi-arrow-right-bold-circle-outline -->
              <v-icon size="16" class="mr-1.5"
                >mdi-arrow-right-bold-circle-outline</v-icon
              >
              Kirim ke Antrian
            </v-btn>

            <!-- TOMBOL 2: PROSES RACIK OBAT -->
            <v-btn
              :disabled="detailResepObat.status !== 'Antrian'"
              variant="flat"
              color="blue-darken-3"
              style="
                font-weight: 700;
                border-radius: 6px;
                height: 32px;
                text-transform: none;
                letter-spacing: 0.2px;
              "
              class="text-caption px-3 text-white"
              @click="prosesobat()"
            >
              <!-- Menggunakan icon universal mdi-cached (proses/loop) atau mdi-play-circle-outline -->
              <v-icon size="16" class="mr-1.5">mdi-cached</v-icon>
              Proses Racik Obat
            </v-btn>

            <!-- TOMBOL 3: SELESAI & SERAHKAN -->
            <v-btn
              :disabled="detailResepObat.status !== 'Diproses'"
              variant="flat"
              style="
                background: #10b981 !important;
                color: white !important;
                font-weight: 700;
                border-radius: 6px;
                height: 32px;
                text-transform: none;
                letter-spacing: 0.2px;
              "
              class="text-caption px-3.5"
              @click="selesai()"
            >
              <v-icon size="16" class="mr-1.5">mdi-check-all</v-icon>
              Selesai & Serahkan
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- ================= SISI KANAN (TOTALAN & AUDIT MANIFEST) ================= -->
      <v-col cols="12" md="4" class="pa-2">
        <!-- CARD TOTAL BIAYA: HIGH-END SAAS STYLE CARD -->

        <!-- KOTAK AUDIT DATA METADATA SISTEM -->
        <v-card
          class="rounded-2xl border-none bg-white"
          style="box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.03)"
          variant="flat"
        >
          <div
            class="px-5 pt-5 pb-3 text-subtitle-1 font-weight-black text-slate-900 d-flex align-center"
          >
            <v-icon class="mr-2" color="slate-600" size="20"
              >mdi-fingerprint</v-icon
            >
            Metadata Sistem & Validasi
          </div>
          <v-divider class="border-opacity-25" />

          <v-card-text class="pa-5 text-body-2 text-slate-600">
            <div
              class="d-flex justify-space-between align-center py-3 border-b border-slate-100"
              style="border-bottom: 1px solid #f1f5f9 !important"
            >
              <span class="font-weight-medium text-grey-darken-1"
                >ID Kode Pasien</span
              >
              <span
                class="font-weight-black text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded"
                >{{ detailResepObat.id_pasien }}</span
              >
            </div>

            <div
              class="d-flex justify-space-between align-center py-3 border-b border-slate-100"
              style="border-bottom: 1px solid #f1f5f9 !important"
            >
              <span class="font-weight-medium text-grey-darken-1"
                >ID Penanggung Jawab</span
              >
              <span
                class="font-weight-black text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded"
                >{{ detailResepObat.id_dokter }}</span
              >
            </div>

            <div
              class="d-flex justify-space-between align-center py-3 border-b border-slate-100"
              style="border-bottom: 1px solid #f1f5f9 !important"
            >
              <span class="font-weight-medium text-grey-darken-1"
                >Nomor Sesi Periksa</span
              >
              <span
                class="font-weight-black text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded"
                >{{ detailResepObat.id_pemeriksaan }}</span
              >
            </div>

            <div class="d-flex justify-space-between align-center pt-3">
              <span class="font-weight-medium text-grey-darken-1"
                >Petugas Operator</span
              >
              <span class="font-weight-black text-blue-600">{{
                detailResepObat.created_by
              }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import moment from "moment";

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
  detailResepObat.value.antrian_at = moment().unix();
  detailResepObat.value.antrian_by = useUserStore().getEmail;
  const res = await updateStatusResep({
    ...detailResepObat.value,
    status: "Antrian",
  });

  if (res === "ok") {
    notificationStore.showSuccess("Resep masuk antrian apotek");
    await resepStore.tarikDetailResepObat(route.params.id as string);
    navigateTo("/admin/farmasi/antrian-resep");
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
  detailResepObat.value.proses_at = moment().unix();
  detailResepObat.value.proses_by = useUserStore().getEmail;
  const res = await updateStatusResep({
    ...detailResepObat.value,
    status: "Diproses",
  });

  if (res === "ok") {
    notificationStore.showSuccess("Obat sedang diproses");
    await resepStore.tarikDetailResepObat(route.params.id as string);
    navigateTo("/admin/farmasi/penyerahan-obat");
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
  detailResepObat.value.selesai_at = moment().unix();
  detailResepObat.value.selesai_by = useUserStore().getEmail;
  console.log(detailResepObat.value, "cek data");
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
