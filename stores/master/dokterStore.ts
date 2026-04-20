import { defineStore } from "pinia";
import _ from "lodash";
import type { dokterM } from "~/types/master/dokterModel";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
        async addMasterDokter(data: dokterM) {
            const notif = useNotificationStore();

            try {
                useloadingStore().setLoading(true);

                const token = await getAuth().currentUser?.getIdToken();

                await $fetch("/api/admin/master/dokter", {
                    method: "POST",
                    body: data,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                await this.tarikDataDokter();
                notif.showSuccess("Dokter berhasil ditambahkan");

            } catch (error: any) {
                notif.showError(error.message);
            } finally {
                useloadingStore().setLoading(false);
            }
        },
        async updateMasterDokter(data: dokterM) {
            const notif = useNotificationStore();

            try {
                useloadingStore().setLoading(true);

                const token = await getAuth().currentUser?.getIdToken();

                await $fetch("/api/admin/master/dokter", {
                    method: "PUT",
                    body: data,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                await this.tarikDataDokter();
                notif.showSuccess("Dokter berhasil di edit");

            } catch (error: any) {
                notif.showError(error.message);
            } finally {
                useloadingStore().setLoading(false);
            }
        },
        async deleteMasterDokter(id: string) {
            const notif = useNotificationStore();

            try {
                useloadingStore().setLoading(true);

                const token = await getAuth().currentUser?.getIdToken();

                await $fetch("/api/admin/master/dokter", {
                    method: "DELETE",
                    body: { id },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                await this.tarikDataDokter();
                notif.showSuccess("Dokter berhasil dihapus");

            } catch (error: any) {
                notif.showError(error.message);
            } finally {
                useloadingStore().setLoading(false);
            }
        },
        async tarikDataDokter() {
            const auth = getAuth();

            return new Promise((resolve, reject) => {
                onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        console.error("User belum login");
                        return reject("User belum login");
                    }

                    try {
                        const token = await user.getIdToken();

                        const response = await $fetch<{ ok: boolean; data: dokterM[] }>(
                            "/api/admin/master/dokter",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (response.ok) {
                            this.dataDokter = response.data;
                        }

                        resolve(true);
                    } catch (error) {
                        console.error(error);
                        reject(error);
                    }
                });
            });
        }
    }
})