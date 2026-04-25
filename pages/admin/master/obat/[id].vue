<template>
  <v-container v-if="detailObat" fluid class="pa-4">
    <!--FLOATING ACTION -->
    <v-btn
      icon
      size="large"
      color="primary"
      class="fab-btn"
      @click="dialogStok = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!--HERO -->
    <v-card class="pa-4 rounded-xl mb-4 gradient-header" flat>
      <v-row align="center">
        <v-col cols="12" md="8">
          <div class="text-h5 font-weight-bold text-white">
            {{ detailObat.nama_obat }}
          </div>
          <div class="text-caption text-white opacity-80">
            {{ detailObat.kode_obat }} • {{ detailObat.kategori_obat }}
          </div>
        </v-col>

        <v-col cols="12" md="4" class="text-md-right">
          <v-chip
            class="font-weight-bold"
            :color="
              detailObat.stok <= detailObat.stok_minimum ? 'red' : 'green'
            "
          >
            {{
              detailObat.stok <= detailObat.stok_minimum
                ? "STOK MENIPIS"
                : "AMAN"
            }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card>

    <!--STATS -->
    <v-row>
      <v-col cols="6" md="3" v-for="item in stats" :key="item.label">
        <v-card class="pa-4 rounded-xl stat-card" flat>
          <v-icon size="26" class="mb-2" :class="item.color">
            {{ item.icon }}
          </v-icon>
          <div class="text-caption text-grey">{{ item.label }}</div>
          <div class="text-h6 font-weight-bold">
            {{ item.value }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!--DETAIL -->
    <v-card class="mt-4 pa-4 rounded-xl" flat>
      <div class="text-subtitle-1 font-weight-bold mb-3">Informasi Obat</div>

      <v-row>
        <v-col cols="6" md="3" v-for="item in detailList" :key="item.label">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </v-col>
      </v-row>
    </v-card>

    <!--HISTORI -->
    <v-card class="mt-4 rounded-xl" flat>
      <v-card-title class="font-weight-bold d-flex justify-space-between">
        Histori Transaksi Stok
        <v-chip size="small" color="primary">
          {{ obatStore.getDataTransaksiStokObat.length }} transaksi
        </v-chip>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="obatStore.getDataTransaksiStokObat"
        density="comfortable"
        class="modern-table"
      >
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at!) }}
        </template>

        <template #item.tipe="{ item }">
          <v-chip
            size="x-small"
            :color="item.tipe === 'masuk' ? 'green' : 'red'"
          >
            {{ item.tipe }}
          </v-chip>
        </template>

        <template #item.jumlah="{ item }">
          <span
            :class="item.tipe === 'masuk' ? 'text-green' : 'text-red'"
            class="font-weight-bold"
          >
            {{ item.tipe === "masuk" ? "+" : "-" }} {{ item.jumlah }}
          </span>
        </template>

        <template #no-data>
          <div class="text-center py-6 text-grey">
            <v-icon size="40">mdi-database-off</v-icon>
            <div>Tidak ada histori stok</div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!--DIALOG TAMBAH STOK -->
    <v-dialog v-model="dialogStok" max-width="450">
      <v-card class="rounded-xl">
        <v-card-title
          style="background-color: #0d52af"
          class="text-white font-weight-bold pa-5"
        >
          Tambah Stok
        </v-card-title>

        <v-card-text>
          <a-select
            v-model="form.metode"
            :items="['Pembelian', 'Return', 'Adjustment']"
            label="Sumber"
            variant="outlined"
          />

          <a-text-field
            v-model="form.referensi"
            label="No Referensi (Faktur / Retur)"
            variant="outlined"
          />

          <a-text-field
            v-model="form.jumlah"
            label="Jumlah"
            type="number"
            variant="outlined"
          />

          <a-textarea
            v-model="form.keterangan"
            label="Keterangan"
            rows="2"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialogStok = false">Batal</v-btn>
          <v-btn color="primary" @click="tambahStok"> Simpan </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { collection, getDocs, doc, runTransaction } from "firebase/firestore";
import { useFirestore } from "vuefire";
import moment from "moment";

definePageMeta({
  layout: "admin",
});

const db = useFirestore();
const route = useRoute();
const obatStore = useobatStores();

const dialogStok = ref(false);

const form = ref({
  jumlah: 0,
  metode: "Pembelian",
  keterangan: "",
  referensi: "",
});

onMounted(async () => {
  const id = route.params.id as string;
  await obatStore.tarikDetailObat(id);
  await obatStore.tarikdatatransaksistok(id);
});

const detailObat = computed(() => obatStore.getDetailObat);

//STATS
const stats = computed(() => [
  {
    label: "Stok",
    value: detailObat.value.stok,
    icon: "mdi-warehouse",
    color: "text-primary",
  },
  {
    label: "Minimum",
    value: detailObat.value.stok_minimum,
    icon: "mdi-alert",
    color: "text-orange",
  },
  {
    label: "Harga",
    value: "Rp " + rupiah(detailObat.value.harga_jual),
    icon: "mdi-cash",
    color: "text-green",
  },
  {
    label: "Supplier",
    value: detailObat.value.nama_supplier,
    icon: "mdi-truck",
    color: "text-indigo",
  },
]);

//DETAIL LIST
const detailList = computed(() => [
  { label: "Bentuk", value: detailObat.value.bentuk_obat },
  { label: "Satuan", value: detailObat.value.satuan },
  { label: "Expired", value: detailObat.value.tanggal_kadaluarsa },
  { label: "Status", value: detailObat.value.status },
]);

//TAMBAH STOK
async function tambahStok() {
  const res = await setStokObat({
    id_obat: route.params.id as string,
    jumlah: form.value.jumlah,
    metode: form.value.metode,
    keterangan: form.value.keterangan,
    referensi: form.value.referensi,
  });

  if (res === "ok") {
    dialogStok.value = false;
    await obatStore.tarikdatatransaksistok(route.params.id as string);
  }
}

// FORMAT
function rupiah(val: number) {
  return new Intl.NumberFormat("id-ID").format(val || 0);
}

function formatDate(val: number) {
  return new Date(val * 1000).toLocaleString("id-ID");
}

const headers = [
  { title: "Tanggal", key: "created_at" },
  { title: "Tipe", key: "tipe" },
  { title: "Jumlah", key: "jumlah" },
  { title: "Stok Sebelum", key: "stok_sebelum" },
  { title: "Stok Sesudah", key: "stok_sesudah" },
];
</script>

<style scoped>
.gradient-header {
  background: linear-gradient(135deg, #5c6bc0, #3949ab);
}

.stat-card:hover {
  transform: translateY(-4px);
  transition: 0.2s;
}

.label {
  font-size: 12px;
  color: #777;
}

.value {
  font-weight: 600;
}

.modern-table :deep(thead th) {
  background: #f5f5f5;
}

.fab-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
</style>
