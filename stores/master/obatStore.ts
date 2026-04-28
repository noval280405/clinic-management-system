import { defineStore } from "pinia";
import _ from "lodash";
import type { obatM } from "~/types/master/obatModel";
import type { mutasiStokObatM } from "~/types/mutasiStokObatModel";

export const useobatStores = defineStore("obatStore", {
    state: () => {
        return {
            dataObat: [] as obatM[],
            detailObat: {} as obatM,

            dataTransaksiStokObat: [] as mutasiStokObatM[],
        }
    },

    getters: {
        getDataObat(state) {
            return state.dataObat
        },
        getDetailObat(state) {
            return state.detailObat
        },

        getDataTransaksiStokObat(state) {
            return state.dataTransaksiStokObat;
        },
    },

    actions: {
        async addMasterObat(lemparobat: obatM) {
            const notificationStore = useNotificationStore();
            const id = makeSlug(
                `${lemparobat.kode_obat}-${lemparobat.nama_obat}`
            );
            try {
                useloadingStore().setLoading(true)
                // await setdatabase("m_obat", id, lemparobat)

                const databatch = [
                    {
                        collection: "m_obat",
                        id: id,
                        type: "set",
                        data: lemparobat
                    },
                    {
                        collection: "m_supplier/" + lemparobat.id_supplier + "/m_obat",
                        id: id,
                        type: "set",
                        data: lemparobat
                    }
                ]
                await batching(databatch)
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
        async updateMasterObat(lemparobat: obatM, dataobatlama: obatM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true);

                const databatch: any[] = [];

                const pindahSupplier =
                    dataobatlama.id_supplier !== lemparobat.id_supplier;

                const idBerubah =
                    dataobatlama.id !== lemparobat.id;

                const oldId = dataobatlama.id!;
                const newId = lemparobat.id!;

                // HAPUS DARI SUPPLIER LAMA
                if (pindahSupplier || idBerubah) {
                    databatch.push({
                        collection: `m_supplier/${dataobatlama.id_supplier}/m_obat`,
                        id: oldId,
                        type: "delete"
                    });
                }

                // HAPUS MASTER LAMA (jika id berubah)
                if (idBerubah) {
                    databatch.push({
                        collection: "m_obat",
                        id: oldId,
                        type: "delete"
                    });
                }

                // MASTER BARU / UPDATE
                databatch.push({
                    collection: "m_obat",
                    id: newId,
                    type: idBerubah ? "set" : "update",
                    data: lemparobat
                });

                // MASUK KE SUPPLIER BARU
                databatch.push({
                    collection: `m_supplier/${lemparobat.id_supplier}/m_obat`,
                    id: newId,
                    type: "set", // selalu set biar aman
                    data: lemparobat
                });

                await batching(databatch);

                this.tarikDataObat();
                notificationStore.showSuccess("Obat berhasil di update");

            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update obat"
                );
            } finally {
                useloadingStore().setLoading(false);
            }
        },
        async deleteMasterObat(lemparobat: obatM) {
            const notificationStore = useNotificationStore();
            try {
                useloadingStore().setLoading(true)
                const databatch = [
                    {
                        collection: "m_obat",
                        id: lemparobat.id!,
                        type: "delete",
                        data: lemparobat
                    },
                    {
                        collection: "m_supplier/" + lemparobat.id_supplier + "/m_obat",
                        id: lemparobat.id!,
                        type: "delete",
                        data: lemparobat
                    }
                ]
                await batching(databatch)
                // await hapusdatabase("m_obat", id)
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
        },
        async tarikDetailObat(id: string) {
            const datatarik = await tarikdetaildatabase("m_obat", id)
            this.detailObat = datatarik as unknown as obatM
        },
        async tarikdatatransaksistok(id: string) {
            const datatarik = await queryambilid("m_obat/" + id + "/transaksi_stok")
            this.dataTransaksiStokObat = datatarik as unknown as mutasiStokObatM[]
        }
    }
})