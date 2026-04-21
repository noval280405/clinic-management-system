import { useFirestore } from "vuefire";
import {
    collection,
    doc,
    getDocs,
    query,
    runTransaction,
    where,
    writeBatch,
    getFirestore,
    onSnapshot,
    getDoc,
} from "firebase/firestore";
import _, { update } from "lodash";
import moment from "moment";
import { getAuth } from "firebase/auth";
import type { pemeriksaanM } from "~/types/pemeriksaanModel";
import type { pendaftaranM } from "~/types/pendaftaranModel";
import type { pasienM } from "~/types/master/pasienModel";


export const setPasien = async (data: pasienM) => {
    console.log("DATAUPDATE", data);
    const db = useFirestore();
    const auth = getAuth();
    const now = moment().unix();
    const email = auth.currentUser?.email;

    return await runTransaction(db, async (transaction) => {
        const nomorInvRef = doc(db, "penomoran", "nomor");
        const getnomor = await transaction.get(nomorInvRef);

        if (!getnomor.exists()) {
            throw new Error("Dokumen penomoran/nomor tidak ditemukan");
        }
        const datanomor = getnomor.data();
        const newnumber = datanomor!.no_pasien + 1;
        const stringnewnumber = _.toString(newnumber).padStart(5, "0");
        const padnumber = stringnewnumber.padStart(5, "0"); // 03
        const year = moment().format("YYYY");
        const bulan = moment().format("MM");
        const getromawi = await romawian(_.toNumber(bulan));
        const id_pasien = `RM-${year}-${padnumber}`;
        const no_rm = `RM/${year}/${padnumber}`;

        const rmRef = doc(db, "m_pasien", id_pasien);
        transaction.set(rmRef, { ...data, id_pasien: id_pasien, no_rm: no_rm });
        transaction.update(nomorInvRef, { no_pasien: newnumber });

        return;
    })
        .then(() => {
            return "ok";
        })
        .catch((error) => {
            return error.message;
        });
};

export const setPendaftaran = async (data: any) => {
    const db = useFirestore();
    const auth = getAuth();

    try {
        console.log("MASUK setPendaftaran");
        console.log("DATA:", data);
        const result = await runTransaction(db, async (transaction) => {
            // =============================
            // 1. VALIDASI
            // =============================
            if (!data.id_poli) throw new Error("Poli belum dipilih");
            if (!data.id_pasien) throw new Error("Pasien belum dipilih");

            // =============================
            // 2. COUNTER PENDAFTARAN
            // =============================
            const nomorRef = doc(db, "penomoran", "nomor");
            const nomorSnap = await transaction.get(nomorRef);

            let newNoPendaftaran = 1;

            if (nomorSnap.exists()) {
                const nomorData = nomorSnap.data();
                newNoPendaftaran = (nomorData.no_pendaftaran || 0) + 1;
            }

            const padPendaftaran = _.toString(newNoPendaftaran).padStart(5, "0");

            const year = moment().format("YYYY");
            const bulan = moment().format("MM");
            const id_pendaftaran = `DFTR-${data.id_poli}-${year}${bulan}-${padPendaftaran}`;

            // =============================
            // 3. COUNTER ANTRIAN (FIX)
            // =============================
            const tanggalAntrian = data.tanggal_kunjungan;

            if (!tanggalAntrian) {
                throw new Error("Tanggal kunjungan wajib diisi");
            }

            const counterId = `${tanggalAntrian}_${data.id_poli}`;
            const antrianRef = doc(db, "antrian_counter", counterId);
            const antrianSnap = await transaction.get(antrianRef);

            let newNoAntrian = 1;

            if (antrianSnap.exists()) {
                const antrianData = antrianSnap.data();
                newNoAntrian = (antrianData.no_antrian || 0) + 1;
            }

            const no_antrian = _.toString(newNoAntrian).padStart(3, "0");
            console.log("ID PENDAFTARAN:", id_pendaftaran);
            console.log("NO ANTRIAN:", no_antrian);
            // =============================
            // 4. SIMPAN PENDAFTARAN
            // =============================
            const pendaftaranRef = doc(db, "pendaftaran", id_pendaftaran);
            transaction.set(pendaftaranRef, {
                ...data,
                id_pendaftaran,
                no_pendaftaran: padPendaftaran,
                no_antrian,
                status: "menunggu",
                created_at: moment().unix(),
                created_by: auth.currentUser?.email || "system",
            });

            // =============================
            // 5. UPDATE COUNTER GLOBAL (AMAN)
            // =============================
            transaction.set(
                nomorRef,
                {
                    no_pendaftaran: newNoPendaftaran,
                },
                { merge: true }
            );

            // =============================
            // 6. UPDATE COUNTER ANTRIAN
            // =============================
            transaction.set(
                antrianRef,
                {
                    no_antrian: newNoAntrian,
                    tanggal: tanggalAntrian,
                    id_poli: data.id_poli,
                    nama_poli: data.nama_poli,
                    updated_at: moment().unix(),
                },
                { merge: true }
            );

            return {
                id_pendaftaran,
                no_antrian,
            };
        });
        console.log("SUKSES TRANSACTION:", result);
        return "ok";

    } catch (error: any) {
        console.error("ERROR SET PENDAFTARAN:", error);
        return error.message;
    }
};

export const setPemeriksaan = async (data: pemeriksaanM) => {
    const db = useFirestore();
    const auth = getAuth();
    const email = auth.currentUser?.email;

    try {
        await runTransaction(db, async (transaction) => {
            if (!data.id_pendaftaran) {
                throw new Error("ID Pendaftaran tidak ditemukan");
            }
            const nomorRef = doc(db, "penomoran", "nomor");
            const nomorSnap = await transaction.get(nomorRef);
            if (!nomorSnap.exists()) {
                throw new Error("Dokumen penomoran tidak ditemukan");
            }
            const nomorData = nomorSnap.data();
            const newNumber = (nomorData.no_pemeriksaan || 0) + 1;
            const padnumber = _.toString(newNumber).padStart(5, "0");
            const year = moment().format("YYYY");
            const bulan = moment().format("MM");
            const id_pemeriksaan = `RM-${year}${bulan}-${padnumber}`;

            const payload = {
                ...data,
                id_pemeriksaan,
                no_pemeriksaan: padnumber,
                tanggal_pemeriksaan: moment().format("YYYY-MM-DD"),
                created_at: moment().unix(),
                created_by: email,
            };

            const pemeriksaanRef = doc(db, "pemeriksaan", id_pemeriksaan);
            const subRef = doc(db, "pendaftaran", data.id_pendaftaran, "pemeriksaan", id_pemeriksaan);
            const pendaftaranRef = doc(db, "pendaftaran", data.id_pendaftaran);

            transaction.set(pemeriksaanRef, payload);
            transaction.set(subRef, payload);

            transaction.update(pendaftaranRef, {
                status: "diperiksa",
                updated_at: moment().unix(),
                updated_by: email,
            });

            transaction.update(nomorRef, {
                no_pemeriksaan: newNumber,
            });
        });

        return "ok";
    } catch (error: any) {
        console.error(error);
        return error.message;
    }
};


