import { defineEventHandler, readBody, getHeader, createError } from "h3";
import { getAdminApp } from "~/server/utils/firebase-admin";
import { FirestoreRepository } from "~/server/repositories/firestore.repository";

export default defineEventHandler(async (event) => {
  try {
    // 🔐 Ambil Authorization Header
    const authHeader = getHeader(event, "authorization");

    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: "No token",
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔥 Verify Token Firebase
    const admin = getAdminApp();
    const decoded = await admin.auth().verifyIdToken(token);

    console.log("USER LOGIN:", decoded.uid);

    // 📦 Ambil body dari frontend
    const body = await readBody(event);

    if (!body || !body.nama_dokter) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID wajib diisi",
      });
    }

    // 🗄️ Simpan ke Firestore
    const repo = new FirestoreRepository();

    await repo.setDatabaseRepository(
      "m_dokter",
      {
        ...body,
      },
      body.nama_dokter // pakai custom ID dari frontend
    );

    // ✅ Response sukses
    return {
      ok: true,
      message: "Dokter berhasil ditambahkan",
      id: body.nama_dokter,
    };

  } catch (error: any) {
    console.error("POST Dokter ERROR:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});