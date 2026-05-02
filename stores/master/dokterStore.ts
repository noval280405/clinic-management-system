import { defineStore } from "pinia";
import _ from "lodash";
import type { dokterM } from "~/types/master/dokterModel";
import moment from "moment";

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
                `${lempardokter.nama_dokter}-${lempardokter.nama_poli}`
            );
            try {
                useloadingStore().setLoading(true)
                const databatch = [
                    {
                        collection: "m_dokter",
                        id: id,
                        type: "set",
                        data: lempardokter
                    },
                    {
                        collection: "m_poli/" + lempardokter.id_poli + "/m_dokter",
                        id: id,
                        type: "set",
                        data: lempardokter
                    }
                ]
                await batching(databatch)
                // await setdatabase("m_dokter", id, lempardokter)
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
        async updateMasterDokter(lempardokter: dokterM, oldData: dokterM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true);

                const databatch: any[] = [];
                const pindahPoli = oldData.id_poli !== lempardokter.id_poli;
                const idBerubah = oldData.id !== lempardokter.id;

                // =========================
                // HANDLE POLI LAMA
                // =========================
                if (pindahPoli || idBerubah) {
                    databatch.push({
                        collection: `m_poli/${oldData.id_poli}/m_dokter`,
                        id: oldData.id!,
                        type: "set",
                        data: {
                            ...oldData,
                            is_deleted: true,
                            deleted_at: moment().unix(),
                        },
                        merge: true,
                    });
                }

                // =========================
                // HANDLE MASTER
                // =========================
                databatch.push({
                    collection: "m_dokter",
                    id: lempardokter.id!,
                    type: "set",
                    data: {
                        ...lempardokter,
                        updated_at: moment().unix(),
                    },
                    merge: true,
                });

                // =========================
                // HANDLE POLI BARU
                // =========================
                databatch.push({
                    collection: `m_poli/${lempardokter.id_poli}/m_dokter`,
                    id: lempardokter.id!,
                    type: "set",
                    data: {
                        ...lempardokter,
                        updated_at: moment().unix(),
                    },
                    merge: true,
                });

                await batching(databatch);

                this.tarikDataDokter();

                notificationStore.showSuccess("Dokter berhasil di update");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update dokter"
                );
            } finally {
                useloadingStore().setLoading(false);
            }
        },
        async deleteMasterDokter(lempardokter: dokterM) {
            const notificationStore = useNotificationStore();
            const id = makeSlug(
                `${lempardokter.nama_dokter}-${lempardokter.nama_poli}`
            );
            try {
                useloadingStore().setLoading(true)
                const databatch = [
                    {
                        collection: "m_dokter",
                        id: id,
                        type: "delete",
                        data: lempardokter
                    },
                    {
                        collection: "m_poli/" + lempardokter.id_poli + "/m_dokter",
                        id: id,
                        type: "delete",
                        data: lempardokter
                    }
                ]
                await batching(databatch)
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
        },

        async tarikDataDokterByPoli(id_poli: string) {
            const datatarik = await queryDokterByPoli(id_poli)
            this.dataDokter = datatarik as unknown as dokterM[]
        }


    }
})