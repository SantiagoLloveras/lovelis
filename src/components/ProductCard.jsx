import { motion } from "framer-motion";

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

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer w-full max-w-xs flex flex-col h-full"
      onClick={() => {
        if (openImage && imgs.length) openImage(imgs, 0);
      }}
    >
      <div className="w-full h-48 overflow-hidden bg-gray-100">
        <img
          src={imgs[0]}
          alt={p?.name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{p?.name}</h3>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-left">
            {p?.price && <p className="text-pink-600 font-bold">{p.price}</p>}
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
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-3 py-2 rounded-full text-sm hover:bg-pink-600 transition"
            onClick={(e) => e.stopPropagation()}
          >
            Consultar
          </a>
        </div>
      </div>
    </motion.div>
  );
}
