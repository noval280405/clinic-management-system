import { defineStore } from "pinia";
import _ from "lodash";
import type { pendaftaranM } from "~/types/pendaftaranModel";

export const usePendaftaranStores = defineStore("PendaftaranStore", {
    state: () => {
        return {
            dataPendaftaran: [] as pendaftaranM[]
        }
    },

    getters: {
        getDataPendaftaran(state) {
            return state.dataPendaftaran
        }
    },

    actions: {
        async addPendaftaran(lemparPendaftaran: pendaftaranM) {
            const notificationStore = useNotificationStore();
            const id = makeSlug(
                `${lemparPendaftaran.nama_pasien}-${lemparPendaftaran.nomor_antrian}-${lemparPendaftaran.tanggal_kunjungan}`
            );
            try {
                useloadingStore().setLoading(true)
                await setdatabase("pendaftaran", id, lemparPendaftaran)
                this.tarikDataPendaftaran()
                notificationStore.showSuccess("Pendaftaran berhasil di tambahkan");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menambahkan Pendaftaran"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async updatePendaftaran(lemparPendaftaran: pendaftaranM) {
            const notificationStore = useNotificationStore();
    
            try {
                useloadingStore().setLoading(true)
                await updatedatabase("pendaftaran", lemparPendaftaran.id!, lemparPendaftaran)
                this.tarikDataPendaftaran()
                notificationStore.showSuccess("Pendaftaran berhasil di edit");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update Pendaftaran"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async deletePendaftaran(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await hapusdatabase("pendaftaran", id)
                this.tarikDataPendaftaran()
                notificationStore.showSuccess("Pendaftaran berhasil di hapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menghapus Pendaftaran"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async tarikDataPendaftaran() {
            const datatarik = await queryambilid("pendaftaran")
            this.dataPendaftaran = datatarik as unknown as pendaftaranM[]
        }
    }
})