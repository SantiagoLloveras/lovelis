import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Papa from "papaparse"

/**
 * Cambiá estos valores:
 * - WHATSAPP_NUMBER: formato internacional sin + ni espacios, ej: 5491122233344
 * - INSTAGRAM_USER: tu usuario (sin @), ej: "lovelis.uy"
 */
const WHATSAPP_NUMBER = "+59896989871" // REEMPLAZAR
const INSTAGRAM_USER = "lovelisuy" // REEMPLAZAR

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Lovelis" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-pink-600">Lovelis</h1>
            <div className="text-xs text-gray-500 -mt-1">Belleza natural</div>
          </div>
        </div>

        <nav className="flex items-center gap-4 text-sm text-gray-700">
          <a href="#catalogo" className="hover:text-pink-500">Catálogo</a>
          <a href="#testimonios" className="hover:text-pink-500">Testimonios</a>
          <a href="#contacto" className="hover:text-pink-500">Contacto</a>
          <a
            href={`https://www.instagram.com/${INSTAGRAM_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-600 px-3 py-1.5 rounded-full text-sm hover:bg-pink-100"
          >
            <span>Instagram</span>
          </a>
        </nav>
      </div>
    </header>
  )
}

function ProductCard({ p }) {
  const text = encodeURIComponent(`Hola! Quisiera consultar por: ${p.name}`);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  const igLink = `https://www.instagram.com/${INSTAGRAM_USER}`; // IG DM no universal, abre perfil

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-xl transition-shadow"
    >
      <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-100">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-3">{p.name}</h3>
      <p className="text-pink-500 font-medium mb-3">{p.price}</p>

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


function Testimonials() {
  const items = [
    "/testimonios/cliente1.jpg",
    "/testimonios/cliente2.jpg",
    "/testimonios/cliente3.jpg",
  ];
  return (
    <section id="testimonios" className="py-16 bg-beige">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-pink-600 text-center mb-8">Testimonios</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Capturas reales de clientas que nos escribieron por Instagram/WhatsApp</p>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((src, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden rounded-2xl shadow"
            >
              <img src={src} alt={`Testimonio ${i+1}`} className="w-full h-72 object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vSokBLQwnjhB9Moab35Od3OBOFFSbQ67CyiLz5cyQuONd-2iHwfwK8mB4Yd5ZWw4z7Topitv-2McEsE/pub?gid=0&single=true&output=csv", {
      download: true,
      header: true,
      complete: (results) => {
        const parsed = results.data.map((row, index) => ({
          id: row.id || index,
          name: row.nombre,
          price: row.precio,
          image: row.imagen,
          link: row.enlace,
        }))
        setProducts(parsed.filter(p => p.name))
      },
    })
  }, [])

  return (
    <div className="min-h-screen bg-beige text-gray-800">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="pt-8 text-center bg-gradient-to-b from-pink-100 to-transparent rounded-md mb-8 py-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-pink-600"
          >
            💖 Lovelis
          </motion.h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Cremas, perfumes y maquillaje con estética natural y elegante.
          </p>
        </section>

        <section id="catalogo" className="py-6">
          <h2 className="text-3xl font-bold text-pink-600 mb-6">Catálogo</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <p className="text-gray-500">Cargando productos...</p>
            ) : (
              products.map(p => <ProductCard key={p.id} p={p} />)
            )}
          </div>
        </section>

        <Testimonials />

        <section id="contacto" className="py-12 text-center">
          <h3 className="text-2xl font-bold text-pink-600 mb-4">Contacto</h3>
          <p className="text-gray-700 mb-4">Escribinos por WhatsApp o Instagram para pedir productos.</p>
          <div className="flex items-center justify-center gap-4">
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition"
  >
    <img src="/whatsapp-logo.png" alt="WhatsApp" className="w-5 h-5" />
     WhatsApp
  </a>

  <a
    href={`https://www.instagram.com/${INSTAGRAM_USER}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition"
  >
    <img src="/instagram-logo.png" alt="Instagram" className="w-5 h-5" />
     Instagram
  </a>
</div>
        </section>

        <footer className="mt-12 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Lovelis. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  )
}
