import { motion } from "framer-motion";
import { useState } from "react";

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

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
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
        <img
          src={imgs[0]}
          alt={p?.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {!loaded ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">{p?.name}</h3>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-left">
            {!loaded ? (
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            ) : (
              p?.price && <p className="text-pink-600 font-bold">{p.price}</p>
            )}
          </div>

          <a
            href={
              p?.link ||
              `https://www.instagram.com/direct/t/USUARIO/?text=Hola!%20Quisiera%20consultar%20por%20el%20producto:%20${encodeURIComponent(
                p?.name || ""
              )}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-3 py-2 rounded-full text-sm hover:bg-pink-600 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
            onClick={(e) => e.stopPropagation()}
          >
            Consultar
          </a>
        </div>
      </div>
    </motion.div>
  );
}
