import { collection, getDocs, query, where } from "firebase/firestore";
export const queryDokterByPoli = async (id_poli: string) => {
    console.log("QUERY FIRESTORE ID:", id_poli);

    const db = useFirestore();

    const q = query(
        collection(db, "m_dokter"),
        where("id_poli", "==", id_poli)
    );

    const snapshot = await getDocs(q);

    console.log("JUMLAH DATA:", snapshot.size);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};