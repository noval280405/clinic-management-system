import { getAdminApp } from "~/server/utils/firebase-admin";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "authorization");

    if (!authHeader) {
      throw createError({ statusCode: 401, statusMessage: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const admin = getAdminApp();
    const decoded = await admin.auth().verifyIdToken(token);

    console.log("USER LOGIN:", decoded.uid);

    // 🔥 lanjut ke repository kamu
    const { FirestoreRepository } = await import("~/server/repositories/firestore.repository");
    const repo = new FirestoreRepository();

    const data = await repo.getDatabaseRepository("m_dokter");

    return { ok: true, data };
  } catch (error: any) {
    console.error(error);
    return { ok: false, data: [], reason: "UNAUTHORIZED" };
  }
});