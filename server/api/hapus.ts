export default defineEventHandler(async (event) => {
    try {
        console.log('Cek event handler untuk hapus gambar');
        
        // Ambil ID gambar dari query string (?id=)
        const query = getQuery(event);
        const id = query.id;
        console.log(id,'id server')
        if (!id) {
            return { success: false, message: "ID gambar tidak ditemukan!" };
        }
        
        // Ambil API Key dari .env (lebih aman)
        const config = useRuntimeConfig();
        const CLOUDFLARE_ACCOUNT_ID = config.cloudflareAccountId;
        const CLOUDFLARE_API_KEY = config.cloudflareApiKey;
        
        console.log("Cloudflare Account ID:", CLOUDFLARE_ACCOUNT_ID);
        console.log("Cloudflare API Key:", CLOUDFLARE_API_KEY);
        console.log("ID Gambar yang dihapus:", id);

        // Panggil API Cloudflare untuk menghapus gambar
        const deleteResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/f2319d4f6983664d821f658bf715c57a/images/v1/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer HAFJq3IMbeFj8mhY35yp1BRdd1lV7QxgRo-Uk_hj`,
                },
            }
        );

        const result = await deleteResponse.json();

        if (!result.success) {
            console.error("❌ Gagal menghapus gambar:", result.errors);
            return { success: false, message: "Gagal menghapus gambar!", errors: result.errors };
        }

        return { success: true, message: "Gambar berhasil dihapus!" };
    } catch (error) {
        console.error("❌ Kesalahan Server:", error);
        return { success: false, message: "Terjadi kesalahan pada server", error };
    }
});
