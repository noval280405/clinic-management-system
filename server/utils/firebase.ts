import { deleteApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useEvent } from "nitropack/runtime";

type FirebaseRequestContextState = {
  app: FirebaseApp;
  firestore: ReturnType<typeof getFirestore>;
  disposed?: boolean;
};

export const getServerFirestore = () => {
  const runtimeConfig = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: runtimeConfig.public.firebaseApiKey,
    authDomain: runtimeConfig.public.firebaseAuthDomain,
    projectId: runtimeConfig.public.firebaseProjectId,
    storageBucket: runtimeConfig.public.firebaseStorageBucket,
    messagingSenderId: runtimeConfig.public.firebaseMessagingSenderId,
    appId: runtimeConfig.public.firebaseAppId,
  };

  if (!firebaseConfig.projectId) {
    throw new Error("FIREBASE_CONFIG_MISSING_PROJECT_ID");
  }

  const event = useEvent();
  if (event) {
    const context = event.context as Record<string, any>;
    if (!context.__firebaseRequestState) {
      const appName = `server-${crypto.randomUUID()}`;
      const app = initializeApp(firebaseConfig, appName);
      context.__firebaseRequestState = {
        app,
        firestore: getFirestore(app),
        disposed: false,
      } satisfies FirebaseRequestContextState;
    }
    return (context.__firebaseRequestState as FirebaseRequestContextState).firestore;
  }

  const app = getApps()[0] ?? initializeApp(firebaseConfig);
  return getFirestore(app);
};

export const disposeRequestFirestore = async (event: { context: Record<string, any> }) => {
  const state = event.context.__firebaseRequestState as FirebaseRequestContextState | undefined;
  if (!state || state.disposed) return;
  state.disposed = true;
  await deleteApp(state.app);
};