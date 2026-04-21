import { defineStore } from "pinia";
import _ from "lodash";
import type { obatM } from "~/types/master/obatModel";

export const useobatStores = defineStore("obatStore", {
    state: () => {
        return {
            dataObat: [] as obatM[]
        }
    },

    getters: {
        getDataObat(state) {
            return state.dataObat
        }
    },

    actions: {
        async addMasterObat(lemparobat: obatM) {
            const notificationStore = useNotificationStore();
            const id = makeSlug(
                `${lemparobat.kode_obat}-${lemparobat.nama_obat}`
            );
            try {
                useloadingStore().setLoading(true)
                await setdatabase("m_obat", id, lemparobat)
                this.tarikDataObat()
                notificationStore.showSuccess("obat berhasil di tambahkan");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menambahkan obat"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async updateMasterObat(lemparobat: obatM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true)
                await updatedatabase("m_obat", lemparobat.id!, lemparobat)
                this.tarikDataObat()
                notificationStore.showSuccess("obat berhasil di edit");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update obat"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async deleteMasterObat(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await hapusdatabase("m_obat", id)
                this.tarikDataObat()
                notificationStore.showSuccess("obat berhasil di hapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menghapus obat"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async tarikDataObat() {
            const datatarik = await queryambilid("m_obat")
            this.dataObat = datatarik as unknown as obatM[]
        }
    }
})