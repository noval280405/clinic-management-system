import _ from "lodash";
import moment from "moment";
import { romawian } from "~/composables/utils";
import { getAdminApp } from "~/server/utils/firebase-admin";

export class TransactionRepository {
    private db = getAdminApp().firestore();

    async setidmasterbarang(payload: any) {
        try {
            return await this.db.runTransaction(async (transaction) => {
                const nomorRef = this.db.collection("penomoran").doc("nomor");
                const nomorSnap = await transaction.get(nomorRef);

                if (!nomorSnap.exists) {
                    throw new Error("Data penomoran (nomor) tidak ditemukan!");
                }

                const currentNumber = nomorSnap.data()?.no_master_barang ?? 0;
                const newNumber = currentNumber + 1;
                const padNumber = String(newNumber).padStart(3, "0");

                const id_barang = "PKTJ-KB-" + padNumber;

                const finalData = {
                    ...payload,
                    id_barang,
                    no_master_barang: id_barang,
                    created_at: moment().unix(),
                };

                const barangRef = this.db.collection("m_barang").doc(id_barang);

                transaction.update(nomorRef, { no_master_barang: newNumber });
                transaction.set(barangRef, finalData);

                return { ok: true, id: id_barang };
            });
        } catch (error: any) {
            throw new Error("Gagal menyimpan barang: " + error.message);
        }
    }
}