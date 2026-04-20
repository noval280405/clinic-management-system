import { defineStore } from "pinia";
import _ from "lodash";
import type { layananM } from "~/types/master/layananModel";

export const useLayananStores = defineStore("LayananStore", {
    state: () => {
        return {
            dataLayanan: [] as layananM[]
        }
    },

    getters: {
        getDataLayanan(state) {
            return state.dataLayanan
        }
    },

    actions: {
        async addMasterLayanan(lemparLayanan: layananM) {
            const notificationStore = useNotificationStore();
            const id = makeSlug(
                `${lemparLayanan.kode_layanan}`
            );
            try {
                useloadingStore().setLoading(true)
                await setdatabase("m_layanan", id, lemparLayanan)
                this.tarikDataLayanan()
                notificationStore.showSuccess("Layanan berhasil di tambahkan");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menambahkan Layanan"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async updateMasterLayanan(lemparLayanan: layananM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true)
                await updatedatabase("m_layanan", lemparLayanan.id!, lemparLayanan)
                this.tarikDataLayanan()
                notificationStore.showSuccess("Layanan berhasil di edit");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update Layanan"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async deleteMasterLayanan(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await hapusdatabase("m_layanan", id)
                this.tarikDataLayanan()
                notificationStore.showSuccess("Layanan berhasil di hapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menghapus Layanan"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async tarikDataLayanan() {
            const datatarik = await queryambilid("m_layanan")
            this.dataLayanan = datatarik as unknown as layananM[]
        }
    }
})