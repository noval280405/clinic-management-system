import { defineStore } from "pinia";
import _ from "lodash";
import type { poliM } from "~/types/master/poliModel";

export const usePoliStores = defineStore("PoliStore", {
    state: () => {
        return {
            dataPoli: [] as poliM[]
        }
    },

    getters: {
        getDataPoli(state) {
            return state.dataPoli
        }
    },

    actions: {
        async addMasterPoli(lemparPoli: poliM) {
            const notificationStore = useNotificationStore();
            const id = makeSlug(
                `${lemparPoli.nama_poli}-${lemparPoli.kode_poli}`
            );
            try {
                useloadingStore().setLoading(true)
                await setdatabase("m_poli", id, lemparPoli)
                this.tarikDataPoli()
                notificationStore.showSuccess("Poli berhasil di tambahkan");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menambahkan Poli"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },

        async updateMasterPoli(lemparPoli: poliM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true)
                await updatedatabase("m_poli", lemparPoli.id!, lemparPoli)
                this.tarikDataPoli()
                notificationStore.showSuccess("Poli berhasil di edit");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update Poli"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },

        async deleteMasterPoli(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await hapusdatabase("m_poli", id)
                this.tarikDataPoli()
                notificationStore.showSuccess("Poli berhasil di hapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menghapus Poli"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },

        async tarikDataPoli() {
            const datatarik = await queryambilid("m_poli")
            this.dataPoli = datatarik as unknown as poliM[]
        }
    }
})