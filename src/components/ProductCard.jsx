import { useState } from "react";
import { INSTAGRAM_USER } from "../data/contactConfig";

export default function ProductCard({ p, openImage }) {
  // Normalize images: accept comma/semicolon/pipe separated lists or single URL
  // Prefer explicit array `p.images` from parser; fallback to parsing `p.image` string
  const imgs =
    (Array.isArray(p?.images) && p.images.length
      ? p.images
      : (p?.image || "")
          .toString()
          .split(/[;,|\n]+/)
          .map((s) => s.trim())
          .filter(Boolean)) || [];

  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const consultInstagram = (e) => {
    e.stopPropagation();
    const message = `Hola! Quisiera consultar por el producto: ${
      p?.name || ""
    }${p?.price ? " - " + p.price : ""}${p?.link ? " - " + p.link : ""}`;
    const encoded = encodeURIComponent(message);

    // App deep link (best-effort)
    const appUrl = `instagram://direct?text=${encoded}`;
    const webUrl = `https://www.instagram.com/direct/t/${INSTAGRAM_USER}/`;

    // Try to open app (works on some mobile clients)
    try {
      window.location.href = appUrl;
    } catch {
      /* noop */
    }

    // After a short delay, fallback: copy the message and open web DM
    setTimeout(() => {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(message)
          .then(() => showToast("Mensaje copiado al portapapeles"))
          .catch(() => showToast("No fue posible copiar el mensaje"));
      } else {
        showToast("No fue posible copiar el mensaje");
      }
      try {
        window.open(webUrl, "_blank");
      } catch {
        /* noop */
      }
    }, 700);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer w-full max-w-xs flex flex-col h-full focus:outline-none"
      role="button"
      tabIndex={0}
      onClick={() => {
        if (openImage && imgs.length) openImage(imgs, 0);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (openImage && imgs.length) openImage(imgs, 0);
        }
      }}
    >
      {imgs.length > 1 && (
        <>
          <div className="absolute top-3 right-3 z-20 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {imgs.length} imágenes
          </div>
          <div className="absolute top-3 left-3 z-20 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded">
            1/{imgs.length}
          </div>
        </>
      )}

      {/* hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-white text-sm font-medium bg-black/40 px-4 py-2 rounded">
          Ver
        </span>
      </div>

      <div className="w-full h-48 overflow-hidden bg-gray-100 relative">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        {imgs[0] ? (
          <img
            src={imgs[0]}
            alt={p?.name || "producto"}
            className="w-full h-48 object-cover"
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{p?.name}</h3>
          {p?.price && (
            <div className="text-sm text-gray-700 mt-1">{p.price}</div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => consultInstagram(e)}
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-3 py-2 rounded-full text-sm hover:bg-pink-600 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            Consultar
          </button>
        </div>
      </div>

      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 bg-black/80 text-white text-xs px-3 py-2 rounded">
          {toast}
        </div>
      )}
    </div>
  );
}
