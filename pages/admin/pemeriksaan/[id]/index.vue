<template>
  <v-container fluid class="pa-3" v-if="detailPemeriksaan">
    <ConfirmationDialog ref="confirmationDialog" />

    <!-- HEADER -->
    <v-card class="rounded-xl mb-3 elevation-2 pa-3">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="48" class="mr-3">
            <v-icon color="white">mdi-stethoscope</v-icon>
          </v-avatar>

          <div>
            <div class="text-h6 font-weight-bold">Pemeriksaan Pasien</div>
            <div class="text-caption text-grey">
              {{ detailPemeriksaan.tanggal_pemeriksaan }}
            </div>
          </div>
        </div>

        <v-chip color="primary" class="font-weight-bold">
          #{{ detailPemeriksaan.no_pemeriksaan }}
        </v-chip>
      </div>
    </v-card>

    <!-- STATUS ALERT -->
    <v-alert
      v-if="detailPemeriksaan.status === 'Resep'"
      type="success"
      variant="tonal"
      class="mb-3"
    >
      Resep sudah dibuat ✔️
    </v-alert>

    <v-row dense>
      <!-- LEFT -->
      <v-col cols="12" md="8">
        <!-- IDENTITAS -->
        <v-card class="rounded-xl mb-3 elevation-2">
          <v-card-text>
            <v-row dense>
              <v-col cols="6">
                <div class="text-caption text-grey">Pasien</div>
                <div class="font-weight-bold">
                  {{ detailPemeriksaan.nama_pasien }}
                </div>
              </v-col>

              <v-col cols="6">
                <div class="text-caption text-grey">Dokter</div>
                <div>
                  {{ detailPemeriksaan.nama_dokter }}
                </div>
              </v-col>

              <v-col cols="6">
                <div class="text-caption text-grey">Poli</div>
                <v-chip color="indigo" variant="tonal" size="small">
                  {{ detailPemeriksaan.nama_poli }}
                </v-chip>
              </v-col>

              <v-col cols="6">
                <div class="text-caption text-grey">Status</div>
                <v-chip
                  size="small"
                  :color="
                    {
                      Diperiksa: 'orange',
                      Resep: 'purple',
                      Selesai: 'green',
                    }[detailPemeriksaan.status] || 'grey'
                  "
                  class="text-white"
                >
                  {{ detailPemeriksaan.status }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- PEMERIKSAAN FISIK -->
        <v-card class="rounded-xl mb-3 elevation-2">
          <v-card-title class="font-weight-bold">
            🩺 Pemeriksaan Fisik
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-row dense>
              <v-col cols="6" md="3">
                <v-card variant="tonal" class="pa-2 text-center">
                  <div class="text-caption">TD</div>
                  <div class="font-weight-bold">
                    {{ detailPemeriksaan.tekanan_darah || "-" }}
                  </div>
                </v-card>
              </v-col>

              <v-col cols="6" md="3">
                <v-card variant="tonal" class="pa-2 text-center">
                  <div class="text-caption">Suhu</div>
                  <div class="font-weight-bold">
                    {{ detailPemeriksaan.suhu_tubuh || "-" }}
                  </div>
                </v-card>
              </v-col>

              <v-col cols="6" md="3">
                <v-card variant="tonal" class="pa-2 text-center">
                  <div class="text-caption">BB</div>
                  <div class="font-weight-bold">
                    {{ detailPemeriksaan.berat_badan || "-" }}
                  </div>
                </v-card>
              </v-col>

              <v-col cols="6" md="3">
                <v-card variant="tonal" class="pa-2 text-center">
                  <div class="text-caption">TB</div>
                  <div class="font-weight-bold">
                    {{ detailPemeriksaan.tinggi_badan || "-" }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- DIAGNOSA -->
        <v-card class="rounded-xl mb-3 elevation-2">
          <v-card-title class="font-weight-bold">
            🧠 Diagnosa & Tindakan
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-alert variant="tonal" type="info" class="mb-2">
              {{ detailPemeriksaan.diagnosa || "-" }}
            </v-alert>

            <v-alert variant="tonal" type="success">
              {{ detailPemeriksaan.tindakan || "-" }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- RIGHT -->
      <v-col cols="12" md="4">
        <!-- KALAU SUDAH RESEP -->
        <v-card
          v-if="detailPemeriksaan.status === 'Resep'"
          class="rounded-xl elevation-2 pa-4 text-center"
        >
          <v-icon size="60" color="green">mdi-check-circle</v-icon>

          <div class="mt-2 font-weight-bold">Resep Sudah Dibuat</div>

          <div class="text-caption text-grey">Lanjut ke proses pembayaran</div>

          <v-btn color="primary" class="mt-3" block @click="goToBilling">
            💰 Ke Billing
          </v-btn>
        </v-card>

        <!-- INPUT OBAT -->
        <template v-else>
          <v-card class="rounded-xl elevation-2">
            <v-card-title class="font-weight-bold">
              💊 Input Obat
            </v-card-title>

            <v-divider />

            <v-card-text>
              <a-select
                :items="obatStore.getDataObat"
                item-title="nama_obat"
                item-value="id"
                v-model="obat.id_obat"
                label="Pilih Obat"
              />

              <a-text-field v-model="obat.dosis" label="Dosis" class="mt-2" />

              <a-text-field
                v-model.number="obat.jumlah"
                label="Jumlah"
                type="number"
                class="mt-2"
              />

              <v-alert
                variant="tonal"
                type="info"
                density="compact"
                class="mt-2"
              >
                Stok tersedia: {{ obat.stok }}
              </v-alert>

              <v-btn block color="primary" class="mt-3" @click="addObat">
                + Tambah Obat
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- LIST OBAT -->
          <v-card class="rounded-xl mt-3 elevation-2">
            <v-card-title class="font-weight-bold">
              📋 Daftar Obat
            </v-card-title>

            <v-divider />

            <v-list>
              <v-list-item v-for="(item, i) in form.obat" :key="i">
                <v-list-item-title>
                  {{ item.nama_obat }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ item.dosis }} • {{ item.jumlah }}
                </v-list-item-subtitle>

                <template #append>
                  <v-btn icon @click="removeObat(i)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <v-divider />

            <v-card-text class="d-flex justify-space-between">
              <span>Total</span>
              <span class="font-weight-bold">
                Rp {{ new Intl.NumberFormat("id-ID").format(totalObat) }}
              </span>
            </v-card-text>
          </v-card>

          <v-btn block color="primary" class="mt-3" @click="savePemeriksaan">
            Simpan & Selesai
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
