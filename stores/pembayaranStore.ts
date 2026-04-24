import { defineStore } from "pinia";
import type { pembayaranM } from "~/types/pembayaranModel";

export const usePembayaranStore = defineStore("PembayaranStore", {
    state: () => {
        return {
            dataPembayaran: [] as pembayaranM[],
            detailPembayaran: {} as pembayaranM,
        };
    },

    getters: {
        getDataPembayaran(state) {
            return state.dataPembayaran;
        },
        getDetailPembayaran(state) {
            return state.detailPembayaran;
        },
    },

    actions: {
        async addPembayaran(data: pembayaranM) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true);
                await addPembayaran(data); // dari function transaction kamu
                await this.tarikDataPembayaran();
                notificationStore.showSuccess("Pembayaran berhasil");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal menambahkan pembayaran"
                );
            } finally {
                useloadingStore().setLoading(false);
            }
        },

        async updateBillingStatus(id_billing: string, data: any) {
            const notificationStore = useNotificationStore();

            try {
                useloadingStore().setLoading(true);
                await updateBilling(id_billing, data);
                notificationStore.showSuccess("Billing berhasil diupdate");
            } catch (error: any) {
                console.error(error);
                notificationStore.showError(
                    error.message || "Gagal update billing"
                );
            } finally {
                useloadingStore().setLoading(false);
            }
        },

        async tarikDataPembayaran() {
            try {
                const data = await queryambilid("pembayaran");
                this.dataPembayaran = data as unknown as pembayaranM[];
            } catch (error) {
                console.error("ERROR TARIK PEMBAYARAN:", error);
            }
        },

        async tarikDetailPembayaran(id: string) {
            try {
                const data = await tarikdetaildatabase("pembayaran", id);
                this.detailPembayaran = data as unknown as pembayaranM;
            } catch (error) {
                console.error("ERROR DETAIL PEMBAYARAN:", error);
            }
        },
    },
});