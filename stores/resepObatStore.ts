import { defineStore } from "pinia";
import _ from "lodash";
import type { resepObatM } from "~/types/resepObatModel";
import moment from "moment";

export const useresepObatStores = defineStore("resepObatStore", {
    state: () => {
        return {
            dataresepObat: [] as resepObatM[],
            detailresepObat: {} as resepObatM
        }
    },

    getters: {
        getDataResepObat(state) {
            return state.dataresepObat
        },
        getDetailResepObat(state) {
            return state.detailresepObat
        }
    },

    actions: {

        async updateResepObat(lemparresepObat: resepObatM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true)
                await updatedatabase("resep_obat", lemparresepObat.id!, lemparresepObat)
                this.tarikDataResepObat()
                notificationStore.showSuccess("resepObat berhasil di edit");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update resepObat"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async deleteResepObat(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await hapusdatabase("resep_obat", id)
                this.tarikDataResepObat()
                notificationStore.showSuccess("resepObat berhasil di hapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menghapus resepObat"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async tarikDataResepObat() {
            const datatarik = await queryambilid("resep_obat")
            this.dataresepObat = datatarik as unknown as resepObatM[]
        },

        async tarikDataResepObatByStatus(status: string) {
            const datatarik = await queryResepObatnBystatus(status)
            this.dataresepObat = datatarik as unknown as resepObatM[]
        },

        async tarikDetailResepObat(id: string) {
            const datatarik = await tarikdetaildatabase("resep_obat", id)
            this.detailresepObat = datatarik as unknown as resepObatM
        },
    }
})