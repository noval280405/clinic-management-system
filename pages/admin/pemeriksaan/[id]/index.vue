<template>
  <v-container fluid class="pa-4 bg-grey-lighten-4" v-if="detailPemeriksaan">
    <ConfirmationDialog ref="confirmationDialog" />

    <!-- ================= HEADER SOLID & BOLD ================= -->
    <v-card
      class="rounded-xl mb-4 text-white elevation-3"
      style="background: linear-gradient(135deg, #0d47a1 0%, #1e88e5 100%)"
    >
      <v-card-text
        class="pa-4 d-flex justify-space-between align-center flex-wrap gap-3"
      >
        <div class="d-flex align-center">
          <v-avatar color="white" size="44" class="mr-3 elevation-2">
            <v-icon color="blue-darken-3" size="22">mdi-stethoscope</v-icon>
          </v-avatar>

          <div>
            <div class="text-subtitle-1 font-weight-black">
              Pemeriksaan Pasien
            </div>
            <div
              class="text-caption text-blue-lighten-4 mt-0.5 d-flex align-center"
            >
              <v-icon size="14" class="mr-1">mdi-calendar-clock</v-icon>
              {{ detailPemeriksaan.tanggal_pemeriksaan }}
            </div>
          </div>
        </div>

        <v-chip
          color="amber-darken-2"
          variant="flat"
          class="font-weight-black text-white px-4 elevation-1"
        >
          #{{ detailPemeriksaan.no_pemeriksaan }}
        </v-chip>
      </v-card-text>
    </v-card>

    <!-- STATUS ALERT SOLID -->
    <v-alert
      v-if="detailPemeriksaan.status === 'Resep'"
      type="success"
      variant="flat"
      density="comfortable"
      class="rounded-xl mb-4 elevation-1 font-weight-medium"
      icon="mdi-check-circle"
    >
      Resep obat sudah berhasil disimpan dan diteruskan ke apotek ✔️
    </v-alert>

    <v-row dense>
      <!-- ================= SISI KIRI (DATA MEDIS SOLID) ================= -->
      <v-col cols="12" md="8" class="pa-1">
        <!-- CARD IDENTITAS PASIEN -->
        <v-card
          class="rounded-xl mb-3 elevation-1 bg-white border-sm"
          style="border-color: #e0e0e0 !important"
        >
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="6" sm="3">
                <div class="text-caption text-grey-darken-1 font-weight-bold">
                  Pasien
                </div>
                <div
                  class="text-body-2 font-weight-black text-grey-darken-4 mt-1"
                >
                  {{ detailPemeriksaan.nama_pasien }}
                </div>
              </v-col>

              <v-col cols="6" sm="3">
                <div class="text-caption text-grey-darken-1 font-weight-bold">
                  Dokter Pemeriksa
                </div>
                <div
                  class="text-body-2 font-weight-bold text-grey-darken-3 mt-1"
                >
                  {{ detailPemeriksaan.nama_dokter }}
                </div>
              </v-col>

              <v-col cols="6" sm="3">
                <div
                  class="text-caption text-grey-darken-1 font-weight-bold mb-1"
                >
                  Poliklinik
                </div>
                <v-chip
                  color="indigo-darken-3"
                  variant="flat"
                  size="small"
                  class="font-weight-black text-white"
                >
                  {{ detailPemeriksaan.nama_poli }}
                </v-chip>
              </v-col>

              <v-col cols="6" sm="3">
                <div
                  class="text-caption text-grey-darken-1 font-weight-bold mb-1"
                >
                  Status Rekam
                </div>
                <v-chip
                  size="small"
                  variant="flat"
                  :color="
                    {
                      Diperiksa: 'orange-darken-3',
                      Resep: 'purple-darken-2',
                      Selesai: 'green-darken-2',
                    }[detailPemeriksaan.status] || 'grey-darken-2'
                  "
                  class="text-white font-weight-black"
                >
                  {{ detailPemeriksaan.status }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- CARD PEMERIKSAAN FISIK (TTV - SOLID BORDER) -->
        <v-card
          class="rounded-xl mb-3 elevation-1 bg-white border-sm"
          style="border-color: #e0e0e0 !important"
        >
          <div
            class="px-4 pt-3 pb-2 text-subtitle-2 font-weight-black text-grey-darken-4 d-flex align-center"
          >
            <v-icon class="mr-2" color="blue-darken-3" size="18"
              >mdi-heart-pulse</v-icon
            >
            Pemeriksaan Fisik & Tanda Vital
          </div>
          <v-divider />

          <v-card-text class="pa-3 bg-grey-lighten-5">
            <v-row dense>
              <v-col cols="6" sm="3" class="pa-1">
                <v-card
                  variant="flat"
                  class="pa-3 text-center bg-white border-md rounded-lg"
                  style="border-color: #1e88e5 !important"
                >
                  <div
                    class="text-caption text-blue-darken-3 font-weight-black"
                  >
                    Tekanan Darah
                  </div>
                  <div
                    class="text-h6 font-weight-black text-grey-darken-4 mt-1"
                  >
                    {{ detailPemeriksaan.tekanan_darah || "-" }}
                    <span
                      class="text-caption font-weight-bold text-grey-darken-1"
                      >mmHg</span
                    >
                  </div>
                </v-card>
              </v-col>

              <v-col cols="6" sm="3" class="pa-1">
                <v-card
                  variant="flat"
                  class="pa-3 text-center bg-white border-md rounded-lg"
                  style="border-color: #f4511e !important"
                >
                  <div
                    class="text-caption text-deep-orange-darken-3 font-weight-black"
                  >
                    Suhu Tubuh
                  </div>
                  <div
                    class="text-h6 font-weight-black text-grey-darken-4 mt-1"
                  >
                    {{ detailPemeriksaan.suhu_tubuh || "-" }}
                    <span
                      class="text-caption font-weight-bold text-grey-darken-1"
                      >°C</span
                    >
                  </div>
                </v-card>
              </v-col>

              <v-col cols="6" sm="3" class="pa-1">
                <v-card
                  variant="flat"
                  class="pa-3 text-center bg-white border-md rounded-lg"
                  style="border-color: #00897b !important"
                >
                  <div
                    class="text-caption text-teal-darken-3 font-weight-black"
                  >
                    Berat Badan
                  </div>
                  <div
                    class="text-h6 font-weight-black text-grey-darken-4 mt-1"
                  >
                    {{ detailPemeriksaan.berat_badan || "-" }}
                    <span
                      class="text-caption font-weight-bold text-grey-darken-1"
                      >kg</span
                    >
                  </div>
                </v-card>
              </v-col>

              <v-col cols="6" sm="3" class="pa-1">
                <v-card
                  variant="flat"
                  class="pa-3 text-center bg-white border-md rounded-lg"
                  style="border-color: #3949ab !important"
                >
                  <div
                    class="text-caption text-indigo-darken-3 font-weight-black"
                  >
                    Tinggi Badan
                  </div>
                  <div
                    class="text-h6 font-weight-black text-grey-darken-4 mt-1"
                  >
                    {{ detailPemeriksaan.tinggi_badan || "-" }}
                    <span
                      class="text-caption font-weight-bold text-grey-darken-1"
                      >cm</span
                    >
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- CARD DIAGNOSA & TINDAKAN (SOLID & TEGAS) -->
        <v-card
          class="rounded-xl mb-3 elevation-1 bg-white border-sm"
          style="border-color: #e0e0e0 !important"
        >
          <div
            class="px-4 pt-3 pb-2 text-subtitle-2 font-weight-black text-grey-darken-4 d-flex align-center"
          >
            <v-icon class="mr-2" color="red-darken-2" size="20"
              >mdi-text-box-search-outline</v-icon
            >
            Hasil Analisis Klinis Dokter
          </div>
          <v-divider />

          <v-card-text class="pa-4">
            <div
              class="text-caption text-grey-darken-3 font-weight-black mb-1.5 d-flex align-center"
            >
              <v-icon size="16" class="mr-1" color="amber-darken-4"
                >mdi-alert-circle</v-icon
              >
              Diagnosa / Gejala Pasien
            </div>
            <!-- Alert diganti dengan Background Solid Putih ber-border Tebal Jingga -->
            <v-card
              variant="flat"
              class="rounded-xl border-l-lg pa-3 mb-4 text-body-2 text-grey-darken-4"
              style="
                border-left-color: #ffb300 !important;
                background-color: #fffde7 !important;
              "
            >
              {{
                detailPemeriksaan.diagnosa ||
                "Tidak ada riwayat diagnosa tercatat."
              }}
            </v-card>

            <div
              class="text-caption text-grey-darken-3 font-weight-black mb-1.5 d-flex align-center"
            >
              <v-icon size="16" class="mr-1" color="green-darken-3"
                >mdi-medical-bag</v-icon
              >
              Tindakan / Terapi Medis
            </div>
            <!-- Alert diganti dengan Background Solid Putih ber-border Tebal Hijau -->
            <v-card
              variant="flat"
              class="rounded-xl border-l-lg pa-3 text-body-2 text-grey-darken-4"
              style="
                border-left-color: #43a047 !important;
                background-color: #e8f5e9 !important;
              "
            >
              {{ detailPemeriksaan.tindakan || "Tidak ada catatan tindakan." }}
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ================= SISI KANAN (INPUT OBAT & AKSI SOLID) ================= -->
      <v-col cols="12" md="4" class="pa-1">
        <!-- JIKA STATUS SUDAH RESEP -->
        <v-card
          v-if="detailPemeriksaan.status === 'Resep'"
          class="rounded-xl elevation-2 pa-6 text-center h-100 d-flex flex-column align-center justify-center bg-white border-sm"
          style="border-color: #e0e0e0 !important"
        >
          <v-avatar
            color="green-darken-1"
            size="72"
            class="mb-4 text-white elevation-2"
          >
            <v-icon size="42" color="white">mdi-check-bold</v-icon>
          </v-avatar>
          <div class="text-subtitle-1 font-weight-black text-grey-darken-4">
            Resep Selesai Dibuat
          </div>
          <div class="text-caption text-grey-darken-2 px-2 mt-2">
            Data resep telah dikunci. Silakan klik tombol di bawah untuk
            memproses invoice pembayaran pasien.
          </div>
          <!-- Tombol Kasir yang Bold Nyala -->
          <v-btn
            color="amber-darken-3"
            variant="elevated"
            size="large"
            class="mt-6 rounded-xl font-weight-black text-white text-capitalize px-6 w-100"
            elevation="3"
            prepend-icon="mdi-credit-card-outline"
            @click="goToBilling"
          >
            Buka Billing Kasir (Rp)
          </v-btn>
        </v-card>

        <!-- FORM INPUT RESEP UTAMA -->
        <template v-else>
          <v-card
            class="rounded-xl elevation-1 bg-white border-sm mb-3"
            style="border-color: #e0e0e0 !important"
          >
            <div
              class="px-4 pt-3 pb-2 text-subtitle-2 font-weight-black text-grey-darken-4 d-flex align-center"
            >
              <v-icon class="mr-2" color="purple-darken-2" size="18"
                >mdi-pill</v-icon
              >
              Input Obat Pasien
            </div>
            <v-divider />

            <v-card-text class="pa-4">
              <a-select
                :items="obatStore.getDataObat"
                item-title="nama_obat"
                item-value="id"
                v-model="obat.id_obat"
                label="Cari & Pilih Obat"
                variant="outlined"
              />

              <a-text-field
                v-model="obat.dosis"
                label="Dosis & Aturan Pakai"
                class="mt-3"
                variant="outlined"
              />

              <a-text-field
                v-model.number="obat.jumlah"
                label="Jumlah Batang/Botol"
                type="number"
                class="mt-3"
                variant="outlined"
              />

              <!-- Pengingat Stok dengan Warna Solid Tegas -->
              <v-alert
                variant="flat"
                color="blue-darken-3"
                density="comfortable"
                class="rounded-xl mt-3 text-caption font-weight-bold text-white elevation-1"
                icon="mdi-package-variant-closed"
              >
                Sisa Stok Gudang:
                <span
                  class="text-subtitle-2 font-weight-black text-amber-lighten-3 ml-1"
                >
                  {{ obat.stok || 0 }} item
                </span>
              </v-alert>

              <!-- Tombol Tambah yang Solid Ungu Pekat (Bukan Tonal) -->
              <v-btn
                block
                color="purple-darken-2"
                variant="elevated"
                elevation="2"
                class="mt-4 rounded-xl font-weight-black text-capitalize text-white"
                prepend-icon="mdi-plus"
                @click="addObat"
              >
                Tambah Ke Daftar Obat
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- DAFTAR RESEP YANG BERHASIL DITAMBAH -->
          <v-card
            class="rounded-xl elevation-1 bg-white border-sm"
            style="border-color: #e0e0e0 !important"
          >
            <div
              class="px-4 pt-3 pb-2 text-subtitle-2 font-weight-black text-grey-darken-4 d-flex align-center"
            >
              <v-icon class="mr-2" color="blue-grey-darken-2" size="18"
                >mdi-format-list-bulleted</v-icon
              >
              Daftar Resep Sementara
            </div>
            <v-divider />

            <v-list class="pa-0" lines="two">
              <template v-if="form.obat && form.obat.length > 0">
                <v-list-item
                  v-for="(item, i) in form.obat"
                  :key="i"
                  class="border-b py-2"
                >
                  <template #prepend>
                    <v-avatar
                      color="purple-darken-2"
                      size="32"
                      class="mr-2 text-white font-weight-bold"
                    >
                      <v-icon size="16">mdi-pill</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title
                    class="font-weight-black text-body-2 text-grey-darken-4"
                  >
                    {{ item.nama_obat }}
                  </v-list-item-title>

                  <v-list-item-subtitle
                    class="text-caption text-grey-darken-2 font-weight-medium mt-0.5"
                  >
                    Aturan: {{ item.dosis }} •
                    <span class="text-purple-darken-3 font-weight-bold"
                      >Qty: {{ item.jumlah }}</span
                    >
                  </v-list-item-subtitle>

                  <template #append>
                    <v-btn
                      icon="mdi-delete"
                      variant="flat"
                      color="red-lighten-5"
                      class="text-red-darken-3"
                      size="small"
                      @click="removeObat(i)"
                    ></v-btn>
                  </template>
                </v-list-item>
              </template>

              <div
                v-else
                class="text-center py-6 text-caption text-grey-darken-1 bg-grey-lighten-5"
              >
                <v-icon size="32" color="grey-darken-1" class="mb-1"
                  >mdi-basket-minus-outline</v-icon
                >
                <div class="font-weight-medium">
                  Belum ada resep obat ditambahkan
                </div>
              </div>
            </v-list>

            <v-divider />

            <!-- TOTAL ESTIMASI BIAYA SOLID -->
            <v-card-text
              class="d-flex justify-space-between align-center pa-4 bg-blue-darken-4 text-white rounded-b-xl elevation-1"
            >
              <div class="d-flex align-center">
                <v-icon color="blue-lighten-3" class="mr-2" size="20"
                  >mdi-calculator-variant</v-icon
                >
                <span class="text-body-2 font-weight-black text-blue-lighten-4"
                  >Total Estimasi Obat:</span
                >
              </div>
              <span class="text-h6 font-weight-black text-amber-lighten-3">
                Rp {{ new Intl.NumberFormat("id-ID").format(totalObat) }}
              </span>
            </v-card-text>
          </v-card>

          <!-- BUTTON SIMPAN UTAMA (SOLID NYALA) -->
          <v-btn
            block
            color="green-darken-2"
            size="large"
            variant="elevated"
            elevation="3"
            class="mt-4 rounded-xl font-weight-black text-capitalize text-white"
            prepend-icon="mdi-check-all"
            :disabled="!form.obat || form.obat.length === 0"
            @click="savePemeriksaan"
          >
            Simpan & Selesai Diperiksa
          </v-btn>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from "vue";
import moment from "moment";
import _ from "lodash";

const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);
definePageMeta({
  layout: "admin",
});
const obatStore = useobatStores();
const pemeriksaanStore = usePemeriksaanStores();
const route = useRoute();

onMounted(async () => {
  await pemeriksaanStore.tarikDetailPemeriksaan(route.params.id as string);
  await obatStore.tarikDataObat();
});

const detailPemeriksaan = computed(() => {
  return pemeriksaanStore.getDetailPemeriksaan;
});

/* =========================
   FORM
========================= */
const form = reactive({
  obat: [] as any[],
});

/* =========================
   INPUT OBAT
========================= */
const obat = reactive({
  id_obat: "",
  harga_obat: 0,
  nama_obat: "",
  dosis: "",
  jumlah: 0,
  stok: 0,
});

/* =========================
   AUTO FILL OBAT
========================= */
watch(
  () => obat.id_obat,
  (id) => {
    const data = obatStore.getDataObat;
    const found = _.find(data, (o: any) => o.id === id);

    if (found) {
      obat.nama_obat = found.nama_obat;
      obat.harga_obat = found.harga_jual || 0;
      obat.stok = found.stok || 0;
    }
  },
);

/* =========================
   TOTAL BIAYA
========================= */
const totalObat = computed(() => {
  return form.obat.reduce((t, o) => t + o.harga * o.jumlah, 0);
});

/* =========================
   ADD OBAT
========================= */
function addObat() {
  if (!obat.id_obat) {
    return notificationStore.showError("Pilih obat terlebih dahulu");
  }

  if (!obat.jumlah || obat.jumlah <= 0) {
    return notificationStore.showError("Jumlah harus diisi");
  }

  if (obat.jumlah > obat.stok) {
    return notificationStore.showError("Stok tidak mencukupi");
  }

  const exist = form.obat.find((o) => o.id_obat === obat.id_obat);

  if (exist) {
    if (exist.jumlah + obat.jumlah > obat.stok) {
      return notificationStore.showError("Stok tidak mencukupi");
    }

    exist.jumlah += obat.jumlah;
  } else {
    form.obat.push({
      id_obat: obat.id_obat,
      nama_obat: obat.nama_obat,
      dosis: obat.dosis,
      jumlah: Number(obat.jumlah),
      harga: obat.harga_obat,
    });
  }

  // reset
  obat.id_obat = "";
  obat.nama_obat = "";
  obat.dosis = "";
  obat.jumlah = 0;
  obat.stok = 0;
}

/* =========================
   REMOVE OBAT
========================= */
function removeObat(index: number) {
  form.obat.splice(index, 1);
}

/* =========================
   SAVE
========================= */
async function savePemeriksaan() {
  if (form.obat.length === 0) {
    return notificationStore.showError("Tambahkan minimal 1 obat");
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi",
    "Simpan resep & selesaikan pemeriksaan?",
  );

  if (!confirmed) return;

  useloadingStore().setLoading(true);

  try {
    const payload = {
      id_pemeriksaan: detailPemeriksaan.value.id_pemeriksaan,
      id_pendaftaran: detailPemeriksaan.value.id_pendaftaran,
      id_pasien: detailPemeriksaan.value.id_pasien,
      id_dokter: detailPemeriksaan.value.id_dokter,
      id_poli: detailPemeriksaan.value.id_poli,
      nama_pasien: detailPemeriksaan.value.nama_pasien,
      nama_dokter: detailPemeriksaan.value.nama_dokter,
      nama_poli: detailPemeriksaan.value.nama_poli,
      diagnosa: detailPemeriksaan.value.diagnosa,
      items_obat: form.obat,
    };

    const res = await saveResepObat(payload);

    if (res === "ok") {
      form.obat = [];
      notificationStore.showSuccess("Berhasil disimpan");
      navigateTo("/admin/resep-obat");
      await pemeriksaanStore.tarikDetailPemeriksaan(route.params.id as string);
    } else {
      notificationStore.showError(res);
    }
  } catch (err) {
    console.error(err);
    notificationStore.showError("Terjadi kesalahan");
  } finally {
    useloadingStore().setLoading(false);
  }
}

function goToBilling() {
  navigateTo("/admin/resep-obat");
}
</script>
