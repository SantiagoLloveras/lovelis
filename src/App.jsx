/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import ToastProvider from "./components/ToastProvider";
import ProductCard from "./components/ProductCard";
import ContactBubble from "./components/ContactBubble";
import { WHATSAPP_NUMBER, INSTAGRAM_USER } from "./data/contactConfig";

// 🧭 HEADER (con menú hamburguesa responsive)
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer select-none"
          whileHover={{
            scale: 1.05,
            filter: "drop-shadow(0 0 6px rgba(255, 105, 180, 0.6))",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <motion.img
            src="/logo.png"
            alt="Lovelis"
            className="h-10 w-10 object-contain"
            whileHover={{
              scale: 1.15,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.6 },
            }}
          />
          <motion.h1
            className="text-5xl text-black tracking-wide"
            style={{ fontFamily: "'Pinyon Script', cursive" }}
            whileHover={{
              textShadow: "0px 0px 12px rgba(255, 105, 180, 0.8)",
              color: "#ff69b4",
            }}
            transition={{ duration: 0.3 }}
          >
            Lovelis
          </motion.h1>
        </motion.div>

        {/* Menú Desktop */}
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

        {/* Botón hamburguesa */}
        <button
          className="sm:hidden flex flex-col justify-center items-center space-y-1 w-8 h-8 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span
            className={`block w-6 h-0.5 bg-black transition-transform ${
              menuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-opacity ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-transform ${
              menuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </div>

      {/* Menú Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden bg-white border-t border-black/10 shadow-md px-6 py-3 flex flex-col gap-3 text-gray-700"
          >
            <a
              href="#catalogo"
              onClick={() => setMenuOpen(false)}
              className="hover:text-pink-500"
            >
              Catálogo
            </a>
            <a
              href="#opiniones"
              onClick={() => setMenuOpen(false)}
              className="hover:text-pink-500"
            >
              Opiniones
            </a>
            <a
              href="#contacto"
              onClick={() => setMenuOpen(false)}
              className="hover:text-pink-500"
            >
              Contacto
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

// 🔍 MODAL DE IMAGEN CON ZOOM (sin cambios)
function ZoomableImageModal({ images, index, onClose, setIndex }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images, index, setIndex, onClose]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    let distance = 0;
    const startTouch = (e) => {
      if (!e.touches) return;
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        distance = Math.sqrt(dx * dx + dy * dy);
      } else if (e.touches.length === 1) {
        // start single-finger pan only if zoomed
        if (scale <= 1) return;
        setDragging(true);
        const p = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setLastPos(p);
        lastPosRef.current = p;
      }
    };

    const moveTouch = (e) => {
      if (!e.touches) return;
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDist = Math.sqrt(dx * dx + dy * dy);
        const delta = newDist / Math.max(distance || newDist, 1);
        setScale((s) => Math.min(Math.max(s * delta, 1), 4));
        distance = newDist;
      } else if (e.touches.length === 1 && dragging) {
        // single-finger pan
        e.preventDefault();
        const cx = e.touches[0].clientX;
        const cy = e.touches[0].clientY;
        const dx = cx - lastPosRef.current.x;
        const dy = cy - lastPosRef.current.y;
        setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
        const p = { x: cx, y: cy };
        setLastPos(p);
        lastPosRef.current = p;
      }
    };

    const endTouch = (e) => {
      if (!e.touches || e.touches.length === 0) {
        setDragging(false);
      }
    };

    el.addEventListener("touchstart", startTouch, { passive: false });
    el.addEventListener("touchmove", moveTouch, { passive: false });
    el.addEventListener("touchend", endTouch);
    el.addEventListener("touchcancel", endTouch);
    return () => {
      el.removeEventListener("touchstart", startTouch);
      el.removeEventListener("touchmove", moveTouch);
      el.removeEventListener("touchend", endTouch);
      el.removeEventListener("touchcancel", endTouch);
    };
  }, [imgRef]);

  const handleWheel = (e) => {
    setScale((s) => Math.min(Math.max(s + e.deltaY * -0.001, 1), 4));
  };

  const startDrag = (e) => {
    // only start panning when image is zoomed
    if (scale <= 1) return;
    setDragging(true);
    const p = { x: e.clientX, y: e.clientY };
    setLastPos(p);
    lastPosRef.current = p;
  };
  const onDrag = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
    const p = { x: e.clientX, y: e.clientY };
    setLastPos(p);
    lastPosRef.current = p;
  };
  const stopDrag = () => setDragging(false);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 cursor-zoom-out select-none"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        ref={imgRef}
      >
        <div className="absolute top-3 left-3 z-50 pointer-events-none">
          <div className="bg-black/40 text-white text-sm px-3 py-1 rounded-full pointer-events-auto">
            {index + 1} / {images.length}
          </div>
        </div>

        <button
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-3 right-3 z-50 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          ✕
        </button>

        <motion.img
          key={index}
          src={images[index]}
          alt={`Imagen ${index + 1}`}
          className="rounded-2xl object-contain max-h-[75vh] max-w-full"
          animate={{ scale, x: pos.x, y: pos.y }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setIndex((index - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-pink-300"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((index + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-pink-300"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 items-center">
              <div
                className="flex gap-2 overflow-x-auto py-1 px-2"
                style={{ maxWidth: "70vw" }}
              >
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`flex-shrink-0 w-20 h-12 rounded-md overflow-hidden border-2 focus:outline-none ${
                      i === index
                        ? "border-pink-400 scale-105"
                        : "border-transparent"
                    }`}
                    aria-label={`Ir a imagen ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`Thumb ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// 🖼️ OPINIONES (mejorada para móviles)
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

  const currentOpinions = imagenes.slice(
    index * perPage,
    index * perPage + perPage
  );

  return (
    <section
      id="opiniones"
      className="py-12 text-center bg-white/80 rounded-3xl border border-black/10 shadow-sm px-4 sm:px-6 mb-10 overflow-hidden w-full"
    >
      <h3 className="text-2xl font-bold text-black mb-8">Opiniones</h3>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center"
        >
          {currentOpinions.map((op, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl overflow-hidden border border-black/10 shadow-sm bg-white/90 w-full max-w-xs h-auto flex items-center justify-center cursor-pointer"
              onClick={() => setModalIndex(index * perPage + i)}
            >
              <img
                src={op}
                alt={`Opinión ${i + 1}`}
                className="object-contain w-full h-auto"
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

// NOTE: replaced FloatingButtons with ContactBubble component (see bottom of App render)

// 🌸 APP PRINCIPAL (sin cambios lógicos, solo asegurado el meta viewport)
export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Todo"]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todo");
  const [sortOption, setSortOption] = useState("default");
  const [catalogModal, setCatalogModal] = useState(null);

  // Helper: parse a price string into a number once during load

  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSokBLQwnjhB9Moab35Od3OBOFFSbQ67CyiLz5cyQuONd-2iHwfwK8mB4Yd5ZWw4z7Topitv-2McEsE/pub?gid=0&single=true&output=csv",
      {
        download: true,
        header: true,
        complete: (res) => {
          const parsed = res.data
            .map((row, i) => {
              // Normalize images: accept comma/semicolon/pipe/newline separated values
              const raw = row.imagen || "";
              const images = raw
                .toString()
                .split(/[;,|\n]+/)
                .map((s) => s.trim())
                .filter(Boolean);

              return {
                id: row.id || i,
                name: row.nombre?.trim(),
                price: row.precio,
                numericPrice: priceToNumber(row.precio),
                // formatted display price (local style + $ prefix)
                priceDisplay: (() => {
                  const n = priceToNumber(row.precio);
                  if (!Number.isFinite(n)) return (row.precio || "").toString();
                  const isInt = Number.isInteger(n);
                  const formatter = new Intl.NumberFormat("es-AR", {
                    minimumFractionDigits: isInt ? 0 : 2,
                    maximumFractionDigits: 2,
                  });
                  return `$ ${formatter.format(n)}`;
                })(),
                // keep `image` for compatibility (first one) and `images` as full array
                image: images[0] || "",
                images,
                link: row.enlace,
                stock: row.stock?.toLowerCase().includes("si"),
                category:
                  row.categoria?.charAt(0).toUpperCase() +
                    row.categoria?.slice(1).toLowerCase() || "General",
              };
            })
            .filter((p) => p.name);
          setProducts(parsed);
          const uniqueCats = [...new Set(parsed.map((p) => p.category))];
          setCategories(["Todo", ...uniqueCats]);
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

  function priceToNumber(str) {
    if (str == null) return NaN;
    let s = String(str).trim();
    // remove currency symbols and spaces, keep digits, dot and comma and minus
    s = s.replace(/[^0-9\.,\-]/g, "");
    // if both dot and comma present, assume dot thousands and comma decimal
    if (s.indexOf(".") !== -1 && s.indexOf(",") !== -1) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else if (s.indexOf(",") !== -1) {
      // only comma present -> decimal separator
      s = s.replace(",", ".");
    }
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : NaN;
  }

  const sorted = (() => {
    const out = filtered.slice();
    switch (sortOption) {
      case "name-asc":
        out.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        out.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "price-asc":
        out.sort((a, b) => {
          const na = a.numericPrice;
          const nb = b.numericPrice;
          const aFin = Number.isFinite(na);
          const bFin = Number.isFinite(nb);
          if (aFin && bFin) return na - nb;
          if (aFin) return -1;
          if (bFin) return 1;
          return 0;
        });
        break;
      case "price-desc":
        out.sort((a, b) => {
          const na = a.numericPrice;
          const nb = b.numericPrice;
          const aFin = Number.isFinite(na);
          const bFin = Number.isFinite(nb);
          if (aFin && bFin) return nb - na;
          if (aFin) return -1;
          if (bFin) return 1;
          return 0;
        });
        break;
      default:
        break;
    }
    return out;
  })();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-beige text-gray-800 border-t-8 border-pink-100 overflow-visible font-sans antialiased">
        <link
          href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <Header />

        <main className="max-w-6xl mx-auto px-3 sm:px-4 pt-28 pb-8 overflow-visible">
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
            className="py-6 bg-white/80 rounded-3xl border border-black/10 shadow-sm px-4 sm:px-6 mb-8 overflow-visible w-full"
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
                className="border border-black/20 rounded-full px-4 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-pink-300 outline-none bg-white text-gray-700"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-black/20 rounded-full px-4 py-2 w-full sm:w-1/4 focus:ring-2 focus:ring-pink-300 outline-none bg-white text-gray-700"
                aria-label="Ordenar productos"
              >
                <option value="default">Orden: por defecto</option>
                <option value="name-asc">Nombre: A → Z</option>
                <option value="name-desc">Nombre: Z → A</option>
                <option value="price-asc">Precio: menor → Mayor</option>
                <option value="price-desc">Precio: Mayor → menor</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
              {sorted.length > 0 ? (
                sorted.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    openImage={(images, index = 0) =>
                      setCatalogModal({ images, index })
                    }
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">
                  No se encontraron productos.
                </p>
              )}
            </div>
          </section>
          {/* --- SECCIÓN OPINIONES --- */}
          <Opiniones />

          {/* --- SECCIÓN CONTACTO --- */}
          <section id="contacto" className="py-20 px-6 bg-white text-center">
            <h2 className="text-3xl font-bold mb-6">Contáctanos</h2>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-green-50 hover:bg-green-100 transition"
              >
                <img
                  src="/whatsapp-logo.png"
                  alt="WhatsApp"
                  className="w-6 h-6"
                />
                <span className="text-green-700 font-medium">WhatsApp</span>
              </a>
              <a
                href={`https://www.instagram.com/${INSTAGRAM_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-pink-50 hover:bg-pink-100 transition"
              >
                <img
                  src="/instagram-logo.png"
                  alt="Instagram"
                  className="w-6 h-6"
                />
                <span className="text-pink-600 font-medium">Instagram</span>
              </a>
            </div>
          </section>
          {/* --- FOOTER --- */}
        </main>

        {/* --- FOOTER --- */}
        <footer className="bg-gray-900 text-gray-300 py-8 text-center">
          <div className="max-w-6xl mx-auto px-6">
            <p className="mb-2">
              &copy; {new Date().getFullYear()} Lovelis. Todos los derechos
              reservados.
            </p>
            <p className="text-sm text-gray-500">
              Desarrollado con ❤️ por Santiago Lloveras
            </p>
            <div className="flex justify-center gap-4 text-gray-400 text-xl mt-3">
              <a
                href="#"
                className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </footer>

        {catalogModal && (
          <ZoomableImageModal
            images={catalogModal.images}
            index={catalogModal.index}
            onClose={() => setCatalogModal(null)}
            setIndex={(i) => setCatalogModal((m) => ({ ...m, index: i }))}
          />
        )}

        <ContactBubble
          whatsappNumber={WHATSAPP_NUMBER}
          instagramUser={INSTAGRAM_USER}
          message={"Hola! Quisiera consultar por un producto"}
        />
      </div>
    </ToastProvider>
  );
}
