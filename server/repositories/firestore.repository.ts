import { getAdminApp } from "~/server/utils/firebase-admin";

export class FirestoreRepository {
  private db = getAdminApp().firestore();

  async getDatabaseRepository<T>(collectionName: string): Promise<T[]> {
    const snapshot = await this.db.collection(collectionName).get();

    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  async getDetailDatabaseRepository<T>(collectionName: string, id: string) {
    const doc = await this.db.collection(collectionName).doc(id).get();

    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...doc.data(),
    } as T;
  }

  async createDatabaseRepository(collectionName: string, payload: any) {
    const docRef = await this.db.collection(collectionName).add(payload);
    return docRef.id;
  }

  async setDatabaseRepository(
    collectionName: string,
    payload: any,
    customId: string
  ) {
    if (!customId) {
      throw new Error("customId wajib diisi");
    }

    await this.db
      .collection(collectionName)
      .doc(customId)
      .set(payload);

    return customId;
  }

  async updateDatabaseRepository(collectionName: string, id: string, payload: any) {
    await this.db.collection(collectionName).doc(id).update(payload);
    return true;
  }

  async deleteDatabaseRepository(collectionName: string, id: string) {
    await this.db.collection(collectionName).doc(id).delete();
    return true;
  }
}