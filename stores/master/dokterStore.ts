import { defineStore } from "pinia";
import _ from "lodash";
import type { dokterM } from "~/types/dokterModel";

export const useDokterStores = defineStore("dokterStore", {
    state: () => {
        return {
            dataDokter: [] as dokterM[]
        }
    },

    getters: {
        getDataDokter(state) {
            return state.dataDokter
        }
    },

    actions: {
        async addMasterDokter(lempardokter: dokterM) {
            const notificationStore = useNotificationStore();
            const id = makeSlug(
                `${lempardokter.nama_dokter}-${lempardokter.spesialis_dokter}`
            );
            try {
                useloadingStore().setLoading(true)
                await setdatabase("m_dokter", id, lempardokter)
                this.tarikDataDokter()
                notificationStore.showSuccess("Dokter berhasil di tambahkan");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menambahkan dokter"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async updateMasterDokter(lempardokter: dokterM) {
            const notificationStore = useNotificationStore();
    
            try {
                useloadingStore().setLoading(true)
                await updatedatabase("m_dokter", lempardokter.id!, lempardokter)
                this.tarikDataDokter()
                notificationStore.showSuccess("Dokter berhasil di edit");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update dokter"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async deleteMasterDokter(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await hapusdatabase("m_dokter", id)
                this.tarikDataDokter()
                notificationStore.showSuccess("Dokter berhasil di hapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menghapus dokter"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async tarikDataDokter() {
            const datatarik = await queryambilid("m_dokter")
            this.dataDokter = datatarik as unknown as dokterM[]
        }
    }
})