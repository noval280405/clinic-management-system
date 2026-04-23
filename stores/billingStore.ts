import { defineStore } from "pinia";
import moment from "moment";
import type { billingM } from "~/types/billingModel";

export const useBillingStore = defineStore("BillingStore", {
    state: () => ({
        dataBilling: [] as billingM[],
        detailBilling: {} as billingM,
    }),

    getters: {
        getDataBilling(state) {
            return state.dataBilling;
        },
        getDetailBilling(state) {
            return state.detailBilling;
        },
    },

    actions: {
        // =============================
        // CREATE BILLING (biasanya dari resep)
        // =============================
        async addBilling(data: billingM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true);

                const id = data.id_billing;

                const payload: billingM = {
                    ...data,
                    status: "Belum Bayar",
                    created_at: moment().unix(),
                };

                await setdatabase("billing", id!, payload);

                this.tarikDataBilling();

                notificationStore.showSuccess("Billing berhasil dibuat");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal membuat billing"
                );
            } finally {
                useloadingStore().setLoading(false);
            }
        },

        // =============================
        // UPDATE STATUS BILLING
        // =============================
        async updateStatusBilling(id: string, status: string) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true);

                const payload: any = {
                    status,
                    updated_at: moment().unix(),
                };

                // kalau lunas → isi tanggal bayar
                if (status === "Lunas") {
                    payload.tanggal_bayar = moment().unix();
                }

                await updatedatabase("billing", id, payload);

                this.tarikDataBilling();

                notificationStore.showSuccess("Status billing berhasil diupdate");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update billing"
                );
            } finally {
                useloadingStore().setLoading(false);
            }
        },

        // =============================
        // DELETE (opsional)
        // =============================
        async deleteBilling(id: string) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true);

                await hapusdatabase("billing", id);

                this.tarikDataBilling();

                notificationStore.showSuccess("Billing berhasil dihapus");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal hapus billing"
                );
            } finally {
                useloadingStore().setLoading(false);
            }
        },

        // =============================
        // GET ALL
        // =============================
        async tarikDataBilling() {
            const datatarik = await queryambilid("billing");
            this.dataBilling = datatarik as unknown as billingM[];
        },

        // =============================
        // GET DETAIL
        // =============================
        async tarikDetailBilling(id: string) {
            const datatarik = await tarikdetaildatabase("billing", id);
            this.detailBilling = datatarik as unknown as billingM;
        },
    },
});