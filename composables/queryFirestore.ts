import { collection, getDocs, query, where } from "firebase/firestore";

export const queryResepObatnBystatus = async (status: string) => {
  const db = useFirestore();
  const colRef = collection(db, "resep_obat");
  const querydriver = query(colRef, where("status", "==", status));
  const snapshot = await getDocs(querydriver);
  const docs = Array.from(snapshot.docs).map((doc) => {
    const id = doc.id;
    const data = doc.data();
    return { id, ...data };
  });
  const datas = await Promise.all(docs);
  // console.log14, datas)

  return datas;
};

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