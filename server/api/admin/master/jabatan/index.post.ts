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

    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: "Body tidak boleh kosong",
      });
    }

    // 🗄️ Simpan ke Firestore (AUTO ID)
    const repo = new FirestoreRepository();

    const id = await repo.createDatabaseRepository(
      "m_jabatan",
      {
        ...body,
      }
    );

    // ✅ Response sukses
    return {
      ok: true,
      message: "Pemasok berhasil ditambahkan",
      id, // ✅ pakai ID dari firestore
    };

  } catch (error: any) {
    console.error("POST PEMASOK ERROR:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});