import { defineEventHandler, readBody, getHeader, createError } from "h3";
import { getAdminApp } from "~/server/utils/firebase-admin";
import { FirestoreRepository } from "~/server/repositories/firestore.repository";

export default defineEventHandler(async (event) => {
    try {
        const authHeader = getHeader(event, "authorization");
        if (!authHeader) throw createError({ statusCode: 401, statusMessage: "No token" });

        const token = authHeader.split(" ")[1];
        const admin = getAdminApp();
        await admin.auth().verifyIdToken(token);

        const body = await readBody(event);

        const repo = new FirestoreRepository();

        await repo.deleteDatabaseRepository("m_jabatan", body.id);
        return { ok: true };

    } catch (error: any) {
        console.error(error);
        throw createError({ statusCode: 500, statusMessage: error.message });
    }
});