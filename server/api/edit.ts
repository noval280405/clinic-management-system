export default defineEventHandler(async (event) => {
    try {
        console.log('Cek event handler untuk edit gambar');
        
        // Ambil ID gambar dari query string (?id=)
        const query = getQuery(event);
        const id = query.id;
        if (!id) {
            return { success: false, message: "ID gambar tidak ditemukan!" };
        }

        // Ambil data dari body request
        const body = await readBody(event);
        const { filename } = body; // Nama file baru

        if (!filename) {
            return { success: false, message: "Nama file baru harus diisi!" };
        }
        
        // Ambil API Key dari .env
        const config = useRuntimeConfig();
        const CLOUDFLARE_ACCOUNT_ID = config.cloudflareAccountId;
        const CLOUDFLARE_API_KEY = config.cloudflareApiKey;

        console.log("Cloudflare Account ID:", CLOUDFLARE_ACCOUNT_ID);
        console.log("ID Gambar yang diedit:", id);
        console.log("Nama File Baru:", filename);

        // Panggil API Cloudflare untuk memperbarui metadata gambar
        const updateResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/f2319d4f6983664d821f658bf715c57a/images/v1/${id}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer HAFJq3IMbeFj8mhY35yp1BRdd1lV7QxgRo-Uk_hj`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filename }),
            }
        );

        const result = await updateResponse.json();

        if (!result.success) {
            console.error("❌ Gagal mengedit gambar:", result.errors);
            return { success: false, message: "Gagal mengedit gambar!", errors: result.errors };
        }

        return { success: true, message: "Gambar berhasil diedit!", data: result.result };
    } catch (error) {
        console.error("❌ Kesalahan Server:", error);
        return { success: false, message: "Terjadi kesalahan pada server", error };
    }
});
