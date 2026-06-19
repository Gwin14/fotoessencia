const CACHE_KEY = "fotoessencia_ig_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

// ─── Cache persistente no localStorage ────────────────────────────────────────

function saveCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch (err) {
    // localStorage pode estar cheio ou bloqueado (modo privado em alguns browsers)
    console.warn("Não foi possível salvar cache:", err);
  }
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * Busca todos os dados do Instagram de uma única vez, via Vercel Function
 * (que mantém o access token no servidor).
 * Usa cache do localStorage por 30 minutos.
 *
 * Retorna: { media, images, profileInfo }
 */
export async function fetchInstagramData() {
  // 1. Tenta retornar do cache
  const cached = loadCache();
  if (cached) return cached;

  // 2. Busca via função serverless
  const response = await fetch("/api/instagram");
  if (!response.ok) throw new Error("Erro ao buscar dados do Instagram");
  const result = await response.json();

  // 3. Persiste no localStorage
  saveCache(result);

  return result;
}

// ─── Funções individuais mantidas por compatibilidade ─────────────────────────
// Todas chamam fetchInstagramData() internamente, sem fazer novo fetch.

export async function fetchInstagramImages() {
  const { images } = await fetchInstagramData();
  return images;
}

export async function fetchInstagramProfileInfo() {
  const { profileInfo } = await fetchInstagramData();
  return profileInfo;
}

export async function fetchInstagramMedia() {
  const { media } = await fetchInstagramData();
  return media;
}
