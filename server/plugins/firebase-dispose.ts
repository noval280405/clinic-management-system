import { disposeRequestFirestore } from "../utils/firebase";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("afterResponse", async (event) => {
    try {
      await disposeRequestFirestore(event as { context: Record<string, any> });
    } catch {
      // Cleanup tidak boleh memengaruhi response utama.
    }
  });
});
