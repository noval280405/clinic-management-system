import { defineStore } from "pinia";
import _ from "lodash";
import type { supplierM } from "~/types/master/suplierModel";

export const useSuplierStores = defineStore("SuplierStore", {
    state: () => {
        return {
            dataSuplier: [] as supplierM[]
        }
    },

    getters: {
        getDataSuplier(state) {
            return state.dataSuplier
        }
    },

    actions: {
        async addMasterSuplier(lemparSuplier: supplierM) {
            const notificationStore = useNotificationStore();
            const id = makeSlug(
                `${lemparSuplier.nama_supplier}`
            );
            try {
                useloadingStore().setLoading(true)
                await setdatabase("m_supplier", id, lemparSuplier)
                this.tarikDataSuplier()
                notificationStore.showSuccess("Suplier berhasil di tambahkan");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menambahkan Suplier"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async updateMasterSuplier(lemparSuplier: supplierM) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await updatedatabase("m_supplier", lemparSuplier.id!, lemparSuplier)
                this.tarikDataSuplier()
                notificationStore.showSuccess("Suplier berhasil di edit");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update Suplier"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async deleteMasterSuplier(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await hapusdatabase("m_supplier", id)
                this.tarikDataSuplier()
                notificationStore.showSuccess("Suplier berhasil di hapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menghapus Suplier"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async tarikDataSuplier() {
            const datatarik = await queryambilid("m_supplier")
            this.dataSuplier = datatarik as unknown as supplierM[]
        }
    }
})