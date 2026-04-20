type UploadImageRequest = {
  file?: string;
  sourceUrl?: string;
  fileName?: string;
};

type CloudflareUploadResponse = {
  success: boolean;
  errors?: Array<{ message?: string }>;
  result?: {
    id?: string;
    variants?: string[];
  };
};

export default defineEventHandler(async (event) => {
  assertMethod(event, "POST");

  const config = useRuntimeConfig();
  const accountId =
    config.public.cloudflareAccountId || process.env.CLOUDFLARE_ACCOUNT_ID;
  const token =
    config.cloudflareApiToken ||
    process.env.CLOUDFLARE_IMAGES_TOKEN ||
    process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !token) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "Cloudflare Images belum dikonfigurasi (ACCOUNT_ID / API_TOKEN).",
    });
  }

  const body = await readBody<UploadImageRequest>(event);
  if (!body?.file && !body?.sourceUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: "Payload file/sourceUrl tidak ditemukan.",
    });
  }

  let contentType = "image/jpeg";
  let buffer = Buffer.from([]);
  let extension = "jpg";

  if (body.file) {
    const matches = body.file.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw createError({
        statusCode: 400,
        statusMessage: "Format file base64 tidak valid.",
      });
    }

    contentType = matches[1];
    const base64String = matches[2];
    buffer = Buffer.from(base64String, "base64");
    extension = contentType.split("/")[1] || "jpg";
  } else if (body.sourceUrl) {
    const sourceResponse = await fetch(body.sourceUrl);
    if (!sourceResponse.ok) {
      throw createError({
        statusCode: sourceResponse.status || 400,
        statusMessage: `Gagal mengambil sumber gambar: ${sourceResponse.status}`,
      });
    }

    const arrayBuffer = await sourceResponse.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    contentType = sourceResponse.headers.get("content-type") || "image/jpeg";
    extension = contentType.split("/")[1]?.split(";")[0] || "jpg";
  }
  const rawFileName = (body.fileName || "upload").toString();
  const safeFileName = rawFileName.replace(/[\\/]/g, "-").trim();
  const hasExtension = /\.[a-z0-9]+$/i.test(safeFileName);
  const finalFileName = hasExtension
    ? safeFileName
    : `${safeFileName || "upload"}.${extension}`;

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([buffer], { type: contentType }),
    finalFileName
  );

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = (await response.json()) as CloudflareUploadResponse;

  if (!response.ok || !data?.success) {
    const errorMessage =
      data?.errors?.[0]?.message || "Upload Cloudflare Images gagal.";
    throw createError({
      statusCode: response.status || 500,
      statusMessage: errorMessage,
    });
  }

  return data;
});
