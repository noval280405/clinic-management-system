import { defineStore } from "pinia";
import _ from "lodash";
import type { pemeriksaanM } from "~/types/pemeriksaanModel";
import moment from "moment";

export const usePemeriksaanStores = defineStore("PemeriksaanStore", {
    state: () => {
        return {
            dataPemeriksaan: [] as pemeriksaanM[]
        }
    },

    getters: {
        getDataPemeriksaan(state) {
            return state.dataPemeriksaan
        }
    },

    actions: {
        async addPemeriksaan(lemparPemeriksaan: pemeriksaanM) {
            const notificationStore = useNotificationStore();
            const kodePoli = lemparPemeriksaan.nama_poli.toUpperCase().replace(" ", "");

            const id = makeSlug(
                `RM-${lemparPemeriksaan.nama_pasien}-${kodePoli}-${lemparPemeriksaan.tanggal_pemeriksaan}`
            );
            try {
                useloadingStore().setLoading(true)
                await setdatabase("pemeriksaan", id, lemparPemeriksaan)
                this.tarikDataPemeriksaan()
                notificationStore.showSuccess("Pemeriksaan berhasil di tambahkan");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menambahkan Pemeriksaan"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async updatePemeriksaan(lemparPemeriksaan: pemeriksaanM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true)
                await updatedatabase("pemeriksaan", lemparPemeriksaan.id!, lemparPemeriksaan)
                this.tarikDataPemeriksaan()
                notificationStore.showSuccess("Pemeriksaan berhasil di edit");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update Pemeriksaan"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async deletePemeriksaan(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await hapusdatabase("pemeriksaan", id)
                this.tarikDataPemeriksaan()
                notificationStore.showSuccess("Pemeriksaan berhasil di hapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menghapus Pemeriksaan"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async tarikDataPemeriksaan() {
            const datatarik = await queryambilid("pemeriksaan")
            this.dataPemeriksaan = datatarik as unknown as pemeriksaanM[]
        }
    }
})