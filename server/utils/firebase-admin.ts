import admin from "firebase-admin";

export function getAdminApp() {
  if (!admin.apps.length) {
    const config = useRuntimeConfig();

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebaseProjectId,
        clientEmail: config.firebaseClientEmail,
        privateKey: config.firebasePrivateKey?.replace(/\\n/g, "\n"),
      }),
    });
  }

  return admin;
}