import {
    collection,
    query,
    where,
    getDocs,
    QueryConstraint,
    limit,
} from "firebase/firestore";
import { getServerFirestore } from "~~/server/utils/firebase";

export class QueryRepository {
    private get db() {
        return getServerFirestore();
    }

    // ================================
    // GET PEGAWAI DRAFTER
    // ================================
    async querypegawaidrafter() {
        try {
            const colRef = collection(this.db, "m_pegawai");
            const q = query(
                colRef,
                where("divisi", "==", "Drafter"),
                limit(100) // 🔥 biar aman
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error: any) {
            console.error("ERROR GET PEGAWAI DRAFTER:", error);
            throw new Error(error.message);
        }
    }

    // =========================================
    // GET PEGAWAI BY DIVISI + TYPE GAJI
    // =========================================
    async queryrekapanpegawaibydivisirole(divisi: string, type_gaji: string) {
        try {
            const colRef = collection(this.db, "m_pegawai");
            const constraints: QueryConstraint[] = [];
            if (divisi) {
                constraints.push(where("divisi", "==", divisi));
            }
            if (type_gaji) {
                constraints.push(where("type_gaji", "==", type_gaji));
            }
            // 🔥 guard supaya tidak ambil semua data
            if (constraints.length === 0) {
                throw new Error("Minimal satu filter harus diisi");
            }
            const q = query(
                colRef,
                ...constraints,
                limit(200) // 🔥 optional safety
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

        } catch (error: any) {
            console.error("ERROR GET PEGAWAI BY FILTER:", error);
            throw new Error(error.message);
        }
    }
}