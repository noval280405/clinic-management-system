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
import type { ResepObatItemM, resepObatM } from "~/types/resepObatModel";


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


export const saveResepObat = async (data: resepObatM) => {
    const db = useFirestore();
    const auth = getAuth();

    try {
        const result = await runTransaction(db, async (transaction) => {
            if (!data.id_pemeriksaan) {
                throw new Error("ID Pemeriksaan kosong");
            }
            if (!data.items_obat || data.items_obat.length === 0) {
                throw new Error("Obat belum diinput");
            }

            // =============================
            // COUNTER RESEP
            // =============================
            const nomorRef = doc(db, "penomoran", "nomor");
            const nomorSnap = await transaction.get(nomorRef);

            if (!nomorSnap.exists()) {
                throw new Error("Counter tidak ditemukan");
            }

            const nomorData = nomorSnap.data();
            const newNumber = (nomorData.no_resep || 0) + 1;

            const no_resep = _.toString(newNumber).padStart(5, "0");
            const year = moment().format("YYYY");
            const bulan = moment().format("MM");

            const id_resep = `RSP-${year}${bulan}-${no_resep}`;



            // =============================
            // HITUNG TOTAL
            // =============================
            let total_harga = 0;

            const itemsFinal = data.items_obat.map((item) => {
                const harga = item.harga || 0;
                const jumlah = item.jumlah || 0;

                const subtotal = harga * jumlah;
                total_harga += subtotal;

                return {
                    ...item,
                    subtotal,
                };
            });


            // 5. KURANGI STOK OBAT
            const obatSnapshots: any[] = [];

            for (const item of itemsFinal) {
                const obatRef = doc(db, "m_obat", item.id_obat!);
                const snap = await transaction.get(obatRef);

                if (snap.exists()) {
                    obatSnapshots.push({
                        ref: obatRef,
                        stok: snap.data().stok || 0,
                        item,
                    });
                }
            }

            for (const o of obatSnapshots) {
                transaction.update(o.ref, {
                    stok: o.stok - o.item.jumlah,
                    updated_at: moment().unix(),
                    updated_by: auth.currentUser?.email,
                });
            }
            // =============================
            // REFS EXISTING (JANGAN DIUBAH)
            // =============================
            const resepRef = doc(db, "resep_obat", id_resep);
            const pemeriksaanRef = doc(db, "pemeriksaan", data.id_pemeriksaan);
            const pemeriksaanResepRef = doc(
                db,
                "pemeriksaan",
                data.id_pemeriksaan,
                "resep_obat",
                id_resep
            );

            const pendaftaranRef = doc(db, "pendaftaran", data.id_pendaftaran);
            const penndaftaranPemeriksaanRef = doc(
                db,
                "pendaftaran",
                data.id_pendaftaran,
                "pemeriksaan",
                data.id_pemeriksaan
            );

            const pendaftaranPemeriksaanResepRef = doc(
                db,
                "pendaftaran",
                data.id_pendaftaran,
                "pemeriksaan",
                data.id_pemeriksaan,
                "resep_obat",
                id_resep
            );

            const payload: resepObatM = {
                id_resep,
                id_pendaftaran: data.id_pendaftaran,
                id_pemeriksaan: data.id_pemeriksaan,
                id_pasien: data.id_pasien,
                id_dokter: data.id_dokter,
                id_poli: data.id_poli,
                nama_dokter: data.nama_dokter,
                nama_poli: data.nama_poli,
                nama_pasien: data.nama_pasien,
                diagnosa: data.diagnosa,
                items_obat: itemsFinal as ResepObatItemM[],
                total_harga,
                created_at: moment().unix(),
                created_by: auth.currentUser?.email!,
            };

            transaction.set(resepRef, payload);
            transaction.set(pemeriksaanResepRef, payload);
            transaction.update(pemeriksaanRef, {
                obat: itemsFinal,
                total_obat: total_harga,
                status: "resep",
                updated_at: moment().unix(),
                updated_by: auth.currentUser?.email,
            });

            transaction.update(pendaftaranRef, {
                status: "resep",
                updated_at: moment().unix(),
                updated_by: auth.currentUser?.email,
            });

            transaction.update(penndaftaranPemeriksaanRef, {
                obat: itemsFinal,
                total_obat: total_harga,
                status: "resep",
                updated_at: moment().unix(),
                updated_by: auth.currentUser?.email,
            });
            transaction.set(pendaftaranPemeriksaanResepRef, payload);

            // 4. BILLING OTOMATIS
            const billingRef = doc(db, "billing", id_resep);

            transaction.set(billingRef, {
                id_billing: id_resep,
                id_resep,
                id_pasien: data.id_pasien,
                nama_pasien: data.nama_pasien,
                total: total_harga,
                status: "Belum Bayar",
                created_at: moment().unix(),
            });



            // 6. HISTORY PASIEN
            const historyRef = doc(
                db,
                "history_pasien",
                `${data.id_pasien}_${id_resep}`
            );

            transaction.set(historyRef, {
                id_pasien: data.id_pasien,
                id_resep,
                tipe: "Resep Obat",
                deskripsi: `Resep obat oleh dr. ${data.nama_dokter}`,
                items: itemsFinal,
                created_at: moment().unix(),
            });

            // 7. AUDIT LOG
            const logRef = doc(db, "audit_log", id_resep);

            transaction.set(logRef, {
                user: auth.currentUser?.email,
                aksi: "CREATE_RESEP",
                module: "RESEP_OBAT",
                id_resep,
                id_pasien: data.id_pasien,
                created_at: moment().unix(),
            });

            // 8. UPDATE COUNTER
            transaction.update(nomorRef, {
                no_resep: newNumber,
            });

            return {
                id_resep,
                total_harga,
            };
        });

        console.log("SUKSES RESEP:", result);
        return "ok";

    } catch (error: any) {
        console.error("ERROR RESEP:", error);
        return error.message;
    }
};


// export const saveResepObat = async (data: resepObatM) => {
//     const db = useFirestore();
//     const auth = getAuth();

//     try {
//         const result = await runTransaction(db, async (transaction) => {
//             if (!data.id_pemeriksaan) {
//                 throw new Error("ID Pemeriksaan kosong");
//             }
//             if (!data.items_obat || data.items_obat.length === 0) {
//                 throw new Error("Obat belum diinput");
//             }
//             const nomorRef = doc(db, "penomoran", "nomor");
//             const nomorSnap = await transaction.get(nomorRef);
//             if (!nomorSnap.exists()) {
//                 throw new Error("Counter tidak ditemukan");
//             }

//             const nomorData = nomorSnap.data();
//             const newNumber = (nomorData.no_resep || 0) + 1;
//             const no_resep = _.toString(newNumber).padStart(5, "0");
//             const year = moment().format("YYYY");
//             const bulan = moment().format("MM");
//             const id_resep = `RSP-${year}${bulan}-${no_resep}`;

//             // =============================
//             // 3. HITUNG TOTAL
//             // =============================
//             let total_harga = 0;

//             const itemsFinal = data.items_obat.map((item) => {
//                 const harga = item.harga || 0;
//                 const jumlah = item.jumlah || 0;

//                 const subtotal = harga * jumlah;
//                 total_harga += subtotal;

//                 return {
//                     ...item,
//                     subtotal,
//                 };
//             });

//             const resepRef = doc(db, "resep_obat", id_resep);
//             const pemeriksaanRef = doc(db, "pemeriksaan", data.id_pemeriksaan);
//             const pemeriksaanResepRef = doc(db, "pemeriksaan", data.id_pemeriksaan, "resep_obat", id_resep);
//             const pendaftaranRef = doc(db, "pendaftaran", data.id_pendaftaran);
//             const penndaftaranPemeriksaanRef = doc(db, "pendaftaran", data.id_pendaftaran, "pemeriksaan", data.id_pemeriksaan);
//             const pendaftaranPemeriksaanResepRef = doc(db, "pendaftaran", data.id_pendaftaran, "pemeriksaan", data.id_pemeriksaan, "resep_obat", id_resep);

//             const payload: resepObatM = {
//                 id_resep,
//                 id_pendaftaran: data.id_pendaftaran, // 🔥 WAJIB (ini sebelumnya hilang)
//                 id_pemeriksaan: data.id_pemeriksaan,
//                 id_pasien: data.id_pasien,
//                 id_dokter: data.id_dokter,
//                 id_poli: data.id_poli,
//                 nama_dokter: data.nama_dokter,
//                 nama_poli: data.nama_poli,
//                 nama_pasien: data.nama_pasien,
//                 diagnosa: data.diagnosa,
//                 items_obat: itemsFinal as ResepObatItemM[],
//                 total_harga,
//                 created_at: moment().unix(),
//                 created_by: auth.currentUser?.email!,
//             };

//             transaction.set(resepRef, payload);
//             transaction.set(pemeriksaanResepRef, payload);
//             transaction.update(pemeriksaanRef, {
//                 obat: itemsFinal,
//                 total_obat: total_harga,
//                 status: "resep",
//                 updated_at: moment().unix(),
//                 updated_by: auth.currentUser?.email,
//             });
//             transaction.update(nomorRef, {
//                 no_resep: newNumber,
//             });
//             transaction.update(pendaftaranRef, {
//                 status: "resep",
//                 updated_at: moment().unix(),
//                 updated_by: auth.currentUser?.email,
//             });
//             transaction.update(penndaftaranPemeriksaanRef, {
//                 obat: itemsFinal,
//                 total_obat: total_harga,
//                 status: "resep",
//                 updated_at: moment().unix(),
//                 updated_by: auth.currentUser?.email,
//             });
//             transaction.set(pendaftaranPemeriksaanResepRef, payload);
//             return {
//                 id_resep,
//                 total_harga,
//             };
//         });

//         console.log("SUKSES RESEP:", result);
//         return "ok";

//     } catch (error: any) {
//         console.error("ERROR RESEP:", error);
//         return error.message;
//     }
// };


