import sharp from "sharp";

export const config = {
  api: { responseLimit: false },
};

const ALLOWED_HOSTS = ["cdninstagram.com", "fbcdn.net"];

function isAllowedHost(hostname) {
  return ALLOWED_HOSTS.some((h) => hostname.endsWith(h));
}

export default async function handler(req, res) {
  const { url, w, q } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Parâmetro 'url' é obrigatório" });
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: "URL inválida" });
  }

  if (!isAllowedHost(parsed.hostname)) {
    return res.status(403).json({ error: "Host não permitido" });
  }

  const width = Math.min(parseInt(w, 10) || 600, 1600);
  const quality = Math.min(Math.max(parseInt(q, 10) || 75, 1), 90);

  try {
    const sourceRes = await fetch(parsed.toString());
    if (!sourceRes.ok) {
      return res
        .status(502)
        .json({ error: "Falha ao buscar imagem de origem" });
    }
    const buffer = Buffer.from(await sourceRes.arrayBuffer());

    const output = await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    res.setHeader("Content-Type", "image/webp");
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    );
    res.status(200).send(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
