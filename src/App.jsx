import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";

// ⚙️ CONFIGURACIÓN
const WHATSAPP_NUMBER = "59896989871";
const INSTAGRAM_USER = "lovelisuy";

// 🧭 HEADER
function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Lovelis"
            className="h-10 w-10 object-contain"
          />
          <h1
            className="text-5xl text-black tracking-wide"
            style={{ fontFamily: "'Pinyon Script', cursive" }}
          >
            Lovelis
          </h1>
        </div>
        <nav className="hidden sm:flex items-center gap-4 text-sm text-gray-700">
          <a href="#catalogo" className="hover:text-pink-500 text-black">
            Catálogo
          </a>
          <a href="#opiniones" className="hover:text-pink-500 text-black">
            Opiniones
          </a>
          <a href="#contacto" className="hover:text-pink-500 text-black">
            Contacto
          </a>
        </nav>
      </div>
    </header>
  );
}

// 🔍 MODAL DE IMAGEN CON ZOOM
function ZoomableImageModal({ images, index, onClose, setIndex }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  // 🔒 Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  // Cerrar con teclas
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images, setIndex, onClose]);

  // Zoom táctil
  useEffect(() => {
    const el = imgRef.current;
    let distance = 0;
    const start = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        distance = Math.sqrt(dx * dx + dy * dy);
      }
    };
    const move = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDist = Math.sqrt(dx * dx + dy * dy);
        const delta = newDist / distance;
        setScale((s) => Math.min(Math.max(s * delta, 1), 4));
        distance = newDist;
      }
    };
    el.addEventListener("touchstart", start);
    el.addEventListener("touchmove", move);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
    };
  }, []);

  const handleWheel = (e) => {
    setScale((s) => Math.min(Math.max(s + e.deltaY * -0.001, 1), 4));
  };

  const startDrag = (e) => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const onDrag = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const stopDrag = () => setDragging(false);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out select-none"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        ref={imgRef}
      >
        <motion.img
          key={index}
          src={images[index]}
          alt="Zoom"
          className="rounded-2xl object-contain max-h-[85vh] max-w-full"
          animate={{ scale, x: pos.x, y: pos.y }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setIndex((i) => (i - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-pink-300"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-pink-300"
            >
              ›
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// 💄 PRODUCTO
function ProductCard({ p, openImage }) {
  const text = encodeURIComponent(`Hola! Quisiera consultar por: ${p.name}`);
  const waLink = p.link || `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  const igLink = `https://www.instagram.com/${INSTAGRAM_USER}`;

  return (
    <motion.div
      whileHover={{ scale: p.stock ? 1.03 : 1 }}
      className={`rounded-3xl border border-black/10 shadow-sm p-6 flex flex-col items-center transition-all ${
        p.stock
          ? "bg-white/95 hover:shadow-lg hover:border-black/20"
          : "bg-gray-100 opacity-60"
      }`}
    >
      <div
        className="w-full aspect-square rounded-xl overflow-hidden border border-black/10 bg-gray-50 cursor-pointer"
        onClick={() => openImage(p.image)}
      >
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mt-3 text-center">
        {p.name}
      </h3>
      <p className="text-pink-500 font-medium mb-1">{p.price}</p>
      {p.stock ? (
        <p className="text-sm text-green-600 font-medium mb-2">En stock</p>
      ) : (
        <p className="text-sm text-gray-500 italic mb-2">Sin stock</p>
      )}
      <div className="flex gap-3 mt-2">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition"
        >
          <img src="/whatsapp-logo.png" alt="WhatsApp" className="w-5 h-5" />
        </a>
        <a
          href={igLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-500 p-2 rounded-full hover:bg-pink-600 transition"
        >
          <img src="/instagram-logo.png" alt="Instagram" className="w-5 h-5" />
        </a>
      </div>
    </motion.div>
  );
}

// 🖼️ OPINIONES
function Opiniones() {
  const [imagenes, setImagenes] = useState([]);
  const [index, setIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(null);
  const perPage = 3;

  useEffect(() => {
    const importadas = import.meta.glob(
      "/public/opiniones/*.{jpg,jpeg,png,webp}"
    );
    const rutas = Object.keys(importadas).map((p) => p.replace("/public", ""));
    setImagenes(rutas);
  }, []);

  useEffect(() => {
    if (imagenes.length > 3) {
      const interval = setInterval(() => {
        setIndex((i) => (i + 1) % Math.ceil(imagenes.length / perPage));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [imagenes]);

  const totalPages = Math.ceil(imagenes.length / perPage);
  const currentOpinions = imagenes.slice(
    index * perPage,
    index * perPage + perPage
  );

  return (
    <section
      id="opiniones"
      className="py-12 text-center bg-white/80 rounded-3xl border border-black/10 shadow-sm px-6 mb-10"
    >
      <h3 className="text-2xl font-bold text-black mb-8">Opiniones</h3>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-3 gap-4 justify-items-center"
        >
          {currentOpinions.map((op, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl overflow-hidden border border-black/10 shadow-sm bg-white/90 w-64 h-64 flex items-center justify-center cursor-pointer"
              onClick={() => setModalIndex(index * perPage + i)}
            >
              <img
                src={op}
                alt={`Opinión ${i + 1}`}
                className="object-contain w-full h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {modalIndex !== null && (
        <ZoomableImageModal
          images={imagenes}
          index={modalIndex}
          onClose={() => setModalIndex(null)}
          setIndex={setModalIndex}
        />
      )}
    </section>
  );
}

// 🌸 APP
export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Todo"]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todo");
  const [catalogModal, setCatalogModal] = useState(null);

  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSokBLQwnjhB9Moab35Od3OBOFFSbQ67CyiLz5cyQuONd-2iHwfwK8mB4Yd5ZWw4z7Topitv-2McEsE/pub?gid=0&single=true&output=csv",
      {
        download: true,
        header: true,
        complete: (res) => {
          const parsed = res.data
            .map((row, i) => ({
              id: row.id || i,
              name: row.nombre,
              price: row.precio,
              image: row.imagen,
              link: row.enlace,
              stock: row.stock?.toLowerCase() === "si",
              category: row.categoria
                ? row.categoria.charAt(0).toUpperCase() +
                  row.categoria.slice(1).toLowerCase()
                : "General",
            }))
            .filter((p) => p.name);
          setProducts(parsed);
          setCategories(["Todo", ...new Set(parsed.map((p) => p.category))]);
        },
      }
    );
  }, []);

  const filtered = products.filter((p) => {
    const s = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(s) &&
      (category === "Todo" || p.category === category)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-beige text-gray-800 border-t-8 border-pink-100">
      <link
        href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap"
        rel="stylesheet"
      />
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-8">
        <section className="text-center bg-white/70 rounded-3xl border border-black/10 shadow-sm mb-8 py-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl text-black mb-4"
            style={{ fontFamily: "'Pinyon Script', cursive" }}
          >
            💖 Lovelis 💖
          </motion.h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Perfumes, maquillaje, accesorios y más.
          </p>
        </section>

        {/* 🛍️ CATÁLOGO */}
        <section
          id="catalogo"
          className="py-6 bg-white/80 rounded-3xl border border-black/10 shadow-sm px-6 mb-8"
        >
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Catálogo
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-black/20 rounded-full px-4 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-pink-300 outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-black/20 rounded-full px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none capitalize"
              style={{ width: "auto", minWidth: "120px" }}
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-center">
                No se encontraron productos.
              </p>
            ) : (
              filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  openImage={(img) => setCatalogModal(img)}
                />
              ))
            )}
          </div>
        </section>

        {catalogModal && (
          <ZoomableImageModal
            images={[catalogModal]}
            index={0}
            onClose={() => setCatalogModal(null)}
            setIndex={() => {}}
          />
        )}

        <Opiniones />

        {/* 📞 CONTACTO */}
        <section
          id="contacto"
          className="py-12 text-center bg-white/80 rounded-3xl border border-black/10 shadow-sm px-6"
        >
          <h3 className="text-2xl font-bold text-black mb-4">Contacto</h3>
          <p className="text-gray-700 mb-4">
            Escribinos por WhatsApp o Instagram para pedir productos.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-full hover:from-green-500 hover:to-green-600 transition"
            >
              <img
                src="/whatsapp-logo.png"
                alt="WhatsApp"
                className="w-5 h-5"
              />{" "}
              WhatsApp
            </a>
            <a
              href={`https://www.instagram.com/${INSTAGRAM_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white px-6 py-3 rounded-full hover:from-pink-500 hover:to-pink-600 transition"
            >
              <img
                src="/instagram-logo.png"
                alt="Instagram"
                className="w-5 h-5"
              />{" "}
              Instagram
            </a>
          </div>
        </section>

        <footer className="mt-12 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Lovelis. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}
