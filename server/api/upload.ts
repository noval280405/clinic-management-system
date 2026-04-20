export default defineEventHandler(async (event) => {
    try {
      const config = useRuntimeConfig();
      const formData = await readMultipartFormData(event);
  
      if (!formData) {
        return { success: false, message: "Tidak ada file yang dikirim." };
      }
  
      const file = formData.find((item) => item.name === "file");
  
      if (!file) {
        return { success: false, message: "File tidak ditemukan dalam request." };
      }
  
      // Kirim file ke Cloudflare Images
      const uploadForm = new FormData();
      uploadForm.append("file", new Blob([file.data]), file.filename || "image.jpg");
      console.log(config.public.cloudflareAccountId,'api 19')
      const uploadResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/f2319d4f6983664d821f658bf715c57a/images/v1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer HAFJq3IMbeFj8mhY35yp1BRdd1lV7QxgRo-Uk_hj`,
          },
          body: uploadForm,
        }
      );
  
      const result = await uploadResponse.json();
  
      if (!result.success) {
        console.error("❌ Upload Gagal:", result.errors);
        return { success: false, message: "Upload gagal!", errors: result.errors };
      }
  
      return { success: true, imageUrl: result.result.variants[0] };
    } catch (error) {
      console.error("❌ Kesalahan Server:", error);
      return { success: false, message: "Terjadi kesalahan pada server", error };
    }
  });
  