import { defineStore } from "pinia";
import _ from "lodash";
import moment from "moment";
import type { mutasiStokObatM } from "~/types/mutasiStokObatModel";

export const useMutasiStokObatStore = defineStore("MutasiStokObatStore", {
  state: () => {
    return {
      dataMutasiStokObat: [] as mutasiStokObatM[],
      detailMutasiStokObat: {} as mutasiStokObatM,
    };
  },

  getters: {
    getDataMutasiStokObat(state) {
      return state.dataMutasiStokObat;
    },
    getDetailMutasiStokObat(state) {
      return state.detailMutasiStokObat;
    },
  },

  actions: {
    // =============================
    // CREATE MUTASI
    // =============================
    async addMutasiStokObat(lemparMutasi: mutasiStokObatM) {
      const notificationStore = useNotificationStore();

      const id = makeSlug(
        `MUTASI-${lemparMutasi.id_obat}-${moment().unix()}`
      );

      try {
        useloadingStore().setLoading(true);

        const payload = {
          ...lemparMutasi,
          id_mutasi: id,
          created_at: moment().unix(),
        };

        await setdatabase("mutasi_obat", id, payload);

        this.tarikDataMutasiStokObat();

        notificationStore.showSuccess("Mutasi stok berhasil ditambahkan");
      } catch (error: any) {
        console.error(error);
        notificationStore.showError(
          error.message || "Gagal menambahkan mutasi stok"
        );
      } finally {
        useloadingStore().setLoading(false);
      }
    },

    // =============================
    // DELETE MUTASI
    // =============================
    async deleteMutasiStokObat(id: string) {
      const notificationStore = useNotificationStore();

      try {
        useloadingStore().setLoading(true);

        await hapusdatabase("mutasi_obat", id);

        this.tarikDataMutasiStokObat();

        notificationStore.showSuccess("Mutasi stok berhasil dihapus");
      } catch (error: any) {
        console.error(error);
        notificationStore.showError(
          error.message || "Gagal menghapus mutasi stok"
        );
      } finally {
        useloadingStore().setLoading(false);
      }
    },

    // =============================
    // GET ALL
    // =============================
    async tarikDataMutasiStokObat() {
      const datatarik = await queryambilid("mutasi_obat");
      this.dataMutasiStokObat = datatarik as unknown as mutasiStokObatM[];
    },

    // =============================
    // GET DETAIL
    // =============================
    async tarikDetailMutasiStokObat(id: string) {
      const datatarik = await tarikdetaildatabase("mutasi_obat", id);
      this.detailMutasiStokObat = datatarik as unknown as mutasiStokObatM;
    },
  },
});