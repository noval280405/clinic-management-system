import { defineStore } from "pinia";
import _ from "lodash";
import type { pasienM } from "~/types/pasienModel";

export const usePasienStores = defineStore("pasienStore", {
    state: () => {
        return {
            dataPasien: [] as pasienM[]
        }
    },

    getters: {
        getDataPasien(state) {
            return state.dataPasien
        }
    },

    actions: {
        async addMasterPasien(lemparpasien: pasienM) {
            const notificationStore = useNotificationStore();
            const id = makeSlug(
                `${lemparpasien.nama_pasien}-${lemparpasien.jenis_kelamin}`
            );
            try {
                useloadingStore().setLoading(true)
                await setdatabase("m_pasien", id, lemparpasien)
                this.tarikDataPasien()
                notificationStore.showSuccess("pasien berhasil di tambahkan");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menambahkan pasien"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async updateMasterPasien(lemparpasien: pasienM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true)
                await updatedatabase("m_pasien", lemparpasien.id!, lemparpasien)
                this.tarikDataPasien()
                notificationStore.showSuccess("pasien berhasil di edit");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update pasien"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async deleteMasterPasien(id: string) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                await hapusdatabase("m_pasien", id)
                this.tarikDataPasien()
                notificationStore.showSuccess("pasien berhasil di hapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menghapus pasien"
                );
            } finally {
                useloadingStore().setLoading(false)
            }
        },
        async tarikDataPasien() {
            const datatarik = await queryambilid("m_pasien")
            this.dataPasien = datatarik as unknown as pasienM[]
        }
    }
})