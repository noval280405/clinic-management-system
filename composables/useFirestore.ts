import { useCollection, useFirestore } from "vuefire";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  writeBatch,
  getDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import _ from "lodash";
import { getToken } from "firebase/messaging";

export const taridatadatabase = async (col: string) => {
  const db = useFirestore();

  const colRef = useCollection(collection(db, col));
  return colRef;
};

export const setdatabase = async (
  col: string,
  id: string,
  document: Object
) => {
  const db = useFirestore();

  await setDoc(doc(db, col, id), document, { merge: true });
};

export const tambahdatabase = async (col: string, document: Object) => {
  console.log(col, "col composable");
  console.log(document, "document composable");
  const db = useFirestore();
  const colRef = collection(db, col);
  const docRef = await addDoc(colRef, document);
  return docRef;
};

export const updatedatabase = async (
  col: string,
  id: string,
  document: any
) => {
  const db = useFirestore();

  const docRef = doc(db, col, id);

  return await updateDoc(docRef, document)
    .then(() => {
      return "ok";
    })
    .catch((error) => {
      return "gagal";
    });
};

export const tarikdetaildatabase = async (col: string, id: string) => {
  const db = useFirestore();
  const b = useDocument(doc(db, col, id));
  return b;
};

export const cekeksis = async (col: string, id: string) => {
  const db = useFirestore();
  const b = doc(db, col, id);
  const c = await getDoc(b);
  if (c.exists()) {
    return true;
  } else {
    return false;
  }
};

export const tarikdetaildatabase2 = async (col: string, id: string) => {
  const db = useFirestore();
  const docRef = doc(db, col, id);
  const b = await getDoc(docRef);
  // console.logb.data())
  return b.data();
};

export const hapusdatabase = async (col: string, id: string) => {
  const db = useFirestore();
  const docRef = doc(db, col, id);
  return await deleteDoc(docRef);
};

export const batching = async (documents: any) => {
  try {
    const db = useFirestore();
    // console.log75)
    const batch = writeBatch(db);
    const b = [] as any;
    documents.forEach((document: any) => {
      const docRef = doc(db, document.collection, document.id);

      const type = document.type;
      // console.logtype)
      if (type == "set") {
        batch.set(docRef, document.data);
      } else if (type == "update") {
        batch.update(docRef, document.data);
      } else {
        batch.delete(docRef);
      }
      b.push(document.id);
    });

    await Promise.all(b);
    return await batch
      .commit()
      .then(() => {
        return "ok";
      })
      .catch((error) => {
        console.log(error);
        return "failed";
      });
  } catch (error) {
    console.log(error);
  }
};

export const queryambilid = async (col: string) => {
  const db = useFirestore();
  const colRef = collection(db, col)

  const snapshot = await getDocs(colRef);
  const docs = Array.from(snapshot.docs).map((doc) => {
    const id = doc.id;
    const data = doc.data();
    return { id, ...data };
  });
  const datas = await Promise.all(docs);
  // console.log(14, datas)

  return datas;
};

