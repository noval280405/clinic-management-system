<template>
  <v-container fluid class="pa-3" v-if="detailPemeriksaan">
    <ConfirmationDialog ref="confirmationDialog" />

    <!-- HEADER -->
    <v-row class="mb-3 align-center">
      <v-col cols="12" md="8">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="42" class="mr-3">
            <v-icon color="white">mdi-stethoscope</v-icon>
          </v-avatar>

          <div>
            <div class="text-subtitle-1 font-weight-bold">
              Pemeriksaan Pasien
            </div>
            <div class="text-caption text-grey">
              {{ detailPemeriksaan.tanggal_pemeriksaan }}
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="4" class="text-md-right">
        <v-chip color="primary" size="small" class="font-weight-bold">
          #{{ detailPemeriksaan.no_pemeriksaan }}
        </v-chip>
      </v-col>
    </v-row>

    <!-- GRID UTAMA -->
    <v-row dense>
      <!-- LEFT -->
      <v-col cols="12" md="8">
        <!-- IDENTITAS -->
        <v-card class="rounded-lg mb-3 elevation-1">
          <v-card-text class="py-3">
            <v-row dense>
              <v-col cols="6">
                <div class="text-caption text-grey">Pasien</div>
                <div class="font-weight-bold">
                  {{ detailPemeriksaan.nama_pasien }}
                </div>
              </v-col>

              <v-col cols="6">
                <div class="text-caption text-grey">Dokter</div>
                <div class="font-weight-medium">
                  {{ detailPemeriksaan.nama_dokter }}
                </div>
              </v-col>

              <v-col cols="6">
                <div class="text-caption text-grey">Poli</div>
                <v-chip size="x-small" color="indigo" class="text-white">
                  {{ detailPemeriksaan.nama_poli }}
                </v-chip>
              </v-col>

              <v-col cols="6">
                <div class="text-caption text-grey">Status</div>
                <v-chip size="x-small" color="orange" class="text-white">
                  {{ detailPemeriksaan.status }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- PEMERIKSAAN -->
        <v-card class="rounded-lg mb-3 elevation-1">
          <v-card-title class="text-subtitle-2 font-weight-bold py-2">
            Pemeriksaan Fisik
          </v-card-title>

          <v-divider />

          <v-card-text class="py-3">
            <v-row dense>
              <v-col cols="6" md="3">
                <a-text-field
                  disabled
                  v-model="detailPemeriksaan.tekanan_darah"
                  label="TD"
                  density="compact"
                />
              </v-col>

              <v-col cols="6" md="3">
                <a-text-field
                  disabled
                  v-model="detailPemeriksaan.suhu_tubuh"
                  label="Suhu"
                  density="compact"
                />
              </v-col>

              <v-col cols="6" md="3">
                <a-text-field
                  disabled
                  v-model="detailPemeriksaan.berat_badan"
                  label="BB"
                  density="compact"
                />
              </v-col>

              <v-col cols="6" md="3">
                <a-text-field
                  disabled
                  v-model="detailPemeriksaan.tinggi_badan"
                  label="TB"
                  density="compact"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- DIAGNOSA -->
        <v-card class="rounded-lg mb-3 elevation-1">
          <v-card-title class="text-subtitle-2 font-weight-bold py-2">
            Diagnosa & Tindakan
          </v-card-title>

          <v-divider />

          <v-card-text class="py-3">
            <a-textarea
              disabled
              v-model="detailPemeriksaan.diagnosa"
              label="Diagnosa"
              rows="2"
              density="compact"
            />

            <a-textarea
              disabled
              v-model="detailPemeriksaan.tindakan"
              label="Tindakan"
              rows="2"
              density="compact"
              class="mt-2"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- RIGHT -->
      <v-col cols="12" md="4">
        <!-- INPUT OBAT -->
        <v-card class="rounded-lg mb-3 elevation-1">
          <v-card-title class="text-subtitle-2 font-weight-bold py-2">
            Input Obat
          </v-card-title>

          <v-divider />

          <v-card-text class="py-3">
            <a-select
              :items="obatStore.getDataObat"
              item-title="nama_obat"
              item-value="id"
              v-model="obat.id_obat"
              label="Pilih Obat"
              density="compact"
            />

            <a-text-field
              v-model="obat.dosis"
              label="Dosis"
              density="compact"
            />

            <a-text-field
              v-model="obat.jumlah"
              label="Jumlah"
              type="number"
              density="compact"
            />

            <v-btn
              block
              size="small"
              color="primary"
              class="mt-2"
              @click="addObat"
            >
              Tambah
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- LIST OBAT -->
        <v-card class="rounded-lg elevation-1">
          <v-card-title class="text-subtitle-2 font-weight-bold py-2">
            Daftar Obat
          </v-card-title>

          <v-divider />

          <v-list density="compact">
            <v-list-item v-for="(item, i) in form.obat" :key="i" class="px-2">
              <v-list-item-title class="text-body-2 font-weight-medium">
                {{ item.nama_obat }}
              </v-list-item-title>

              <v-list-item-subtitle class="text-caption">
                {{ item.dosis }} • {{ item.jumlah }}
              </v-list-item-subtitle>

              <template #append>
                <v-btn icon size="18" @click="removeObat(i)">
                  <v-icon size="14" color="red">mdi-close</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- ACTION -->
    <v-row class="mt-3">
      <v-col cols="12" class="text-right">
        <v-btn color="primary" size="small" @click="savePemeriksaan">
          Simpan Pemeriksaan
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import moment from "moment";
import type { resepObatM } from "~/types/resepObatModel";
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

const form = reactive({
  tekanan_darah: "",
  suhu_tubuh: "",
  berat_badan: "",
  tinggi_badan: "",
  diagnosa: "",
  tindakan: "",
  obat: [] as any[],
});

const obat = reactive({
  id_obat: "",
  harga_obat: 0,
  nama_obat: "",
  dosis: "",
  jumlah: "",
});

watch(
  () => obat.id_obat,
  async (idpoli) => {
    const datapoli = obatStore.getDataObat;
    const b = _.find(datapoli, (o: any) => o.id == idpoli);
    if (!_.isUndefined(b)) {
      obat.nama_obat = b!.nama_obat;
      obat.harga_obat = b!.harga_jual;
    }
  },
);

function addObat() {
  if (!obat.nama_obat) return;

  form.obat.push({
    id_obat: obat.id_obat,
    nama_obat: obat.nama_obat,
    dosis: obat.dosis,
    jumlah: Number(obat.jumlah), // 🔥 penting
    harga: obat.harga_obat, // sementara default
  });

  obat.nama_obat = "";
  obat.dosis = "";
  obat.jumlah = "";
}

function removeObat(index: number) {
  form.obat.splice(index, 1);
}

async function savePemeriksaan() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Simpan",
    "Anda yakin ingin menyimpan resep ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("simpan data dibatalkan");
  }

  useloadingStore().setLoading(true);

  try {
    const payload: resepObatM = {
      id_pendaftaran: detailPemeriksaan.value.id_pendaftaran,
      id_pemeriksaan: detailPemeriksaan.value.id_pemeriksaan!,
      id_pasien: detailPemeriksaan.value.id_pasien,
      id_dokter: detailPemeriksaan.value.id_dokter,
      id_poli: detailPemeriksaan.value.id_poli,
      nama_pasien: detailPemeriksaan.value.nama_pasien,
      nama_dokter: detailPemeriksaan.value.nama_dokter,
      nama_poli: detailPemeriksaan.value.nama_poli,
      diagnosa: detailPemeriksaan.value.diagnosa,
      items_obat: form.obat,
    };

    console.log("Payload yang akan disimpan:", payload);

    const c = await saveResepObat(payload);

    if (c === "ok") {
      await obatStore.tarikDataObat();
      await pemeriksaanStore.tarikDetailPemeriksaan(route.params.id as string);
      notificationStore.showSuccess("Resep berhasil disimpan");
    } else {
      notificationStore.showError(c);
    }
  } catch (err: any) {
    console.error(err);
    notificationStore.showError("Terjadi kesalahan saat menyimpan");
  } finally {
    useloadingStore().setLoading(false);
  }
}
</script>
