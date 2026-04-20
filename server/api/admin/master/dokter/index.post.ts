import { defineEventHandler, readBody, getHeader, createError } from "h3";
import { getAdminApp } from "~/server/utils/firebase-admin";
import { FirestoreRepository } from "~/server/repositories/firestore.repository";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Token missing",
      });
    }

    const admin = getAdminApp();
    const decoded = await admin.auth().verifyIdToken(token);

    const body = await readBody(event);

    if (!body?.nama_dokter) {
      throw createError({
        statusCode: 400,
        statusMessage: "Nama dokter wajib diisi",
      });
    }

    const repo = new FirestoreRepository();

    const id =
      body.id ||
      body.nama_dokter.toLowerCase().replace(/\s+/g, "-");

    await repo.setDatabaseRepository(
      "m_dokter",
      {
        ...body,
        createdAt: Date.now(),
        createdBy: decoded.uid,
      },
      id
    );

    return {
      ok: true,
      message: "Dokter berhasil ditambahkan",
      id,
    };

  } catch (error: any) {
    console.error("POST Dokter ERROR:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    });
  }
});