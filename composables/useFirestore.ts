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

export const updateObjectInArray = async (
  docPath: string,
  fieldName: string,
  objectKey: any,
  keyValue: string,
  updatedObject: any
) => {
  const db = useFirestore();

  const docRef = doc(db, docPath);

  try {
    // Get the current document
    // const docSnapshot = await docRef.get();
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists) {
      console.log("Document does not exist.");
      return;
    }

    const data = docSnapshot.data();
    const array = data![fieldName] || [];

    const index = array.findIndex(
      (obj: string[]) => obj[objectKey] === keyValue
    );

    if (index === -1) {
      console.log("Object not found in the array.");
      return;
    }

    array[index] = { ...array[index], ...updatedObject };

    await updateDoc(docRef, { [fieldName]: array });

    return console.log("Array updated successfully.");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

export const setTokenRole = async () => {
  const notificationStore = useNotificationStore();
  try {
    useloadingStore().setLoading(true);
    const { $messaging } = useNuxtApp();
    const email = sessionStorage.getItem("email");
    const iduser = localStorage.getItem("uid");

    let iddevice = localStorage.getItem("id_device");
    if (_.isNull(iddevice)) {
      iddevice = makerandom();
      localStorage.setItem("id_device", iddevice);
    }

    const role = sessionStorage.getItem("role");
    console.log({ role, iduser, email });
    const idfcmtoken = iduser + "_" + iddevice;
    let b = await cekeksis("tokenfcm", idfcmtoken);
    let c;

    if (!b) {
      c = await getToken($messaging, { vapidKey: process.env.vapidKey });
      localStorage.setItem("fcmtoken", c);
      const expiredAt = Timestamp.fromDate(
        new Date(Date.now() + 3600 * 1000 * 24)
      ); // expired 24 jam
      await setdatabase("tokenfcm", idfcmtoken, {
        token: c,
        topic: role + "_topic",
        email,
        iddevice,
        expiredAt,
      });
      await updatedatabase("users", iduser!, { token: c, iddevice });

      notificationStore.showSuccess("Notifikasi berhasil diaktifkan.");
    }

    useloadingStore().setLoading(false);
    return c;
  } catch (error) {
    notificationStore.showError(
      "Gagal mengaktifkan notifikasi. Silakan coba lagi."
    );

    useloadingStore().setLoading(false);
    return location.reload();
  }
};

export const subscribepreorder = async (id_preorder: string) => {
  const iduser = localStorage.getItem("uid");
  let iddevice = localStorage.getItem("id_device");
  const email = sessionStorage.getItem("email");
  if (_.isNull(iddevice)) {
    iddevice = makerandom();
    localStorage.setItem("id_device", iddevice);
  }
  const token = localStorage.getItem("fcmtoken");
  const idfcmtoken = iduser + "_" + iddevice;
  const expiredAt = Timestamp.fromDate(
    new Date(Date.now() + 3600 * 1000 * 24 * 30 * 3)
  ); // expired 24 jam
  return await setdatabase(
    "preorder_sales/" + id_preorder + "/tokenfcm",
    idfcmtoken,
    { token: token, topic: id_preorder, expiredAt, email }
  );
};
