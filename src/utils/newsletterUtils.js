export function decodeHtmlEntities(text) {
  if (!text) return "";
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

export function formatDate(dateStr, long = false) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    weekday: long ? "long" : undefined,
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function parseRSS(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");
  const items = Array.from(xml.querySelectorAll("item"));

  return items.map((item) => {
    const get = (tag) =>
      decodeHtmlEntities(item.querySelector(tag)?.textContent?.trim() ?? "");
    const encoded = item.querySelector("encoded")?.textContent ?? "";
    const enclosureUrl =
      item.querySelector("enclosure")?.getAttribute("url") ?? "";
    let coverImage = enclosureUrl;

    if (!coverImage) {
      const imgMatch = encoded.match(
        /src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i,
      );
      if (imgMatch) coverImage = imgMatch[1];
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = encoded;
    const excerpt =
      (tempDiv.textContent || "").replace(/\s+/g, " ").trim().slice(0, 200) +
      "…";

    return {
      title: get("title"),
      description: get("description"),
      link: get("link"),
      guid: get("guid"),
      pubDate: get("pubDate"),
      creator: get("creator"),
      coverImage,
      excerpt,
      content: encoded,
    };
  });
}
