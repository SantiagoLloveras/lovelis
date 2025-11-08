import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Papa from "papaparse"

export default function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vSokBLQwnjhB9Moab35Od3OBOFFSbQ67CyiLz5cyQuONd-2iHwfwK8mB4Yd5ZWw4z7Topitv-2McEsE/pub?gid=0&single=true&output=csv", {
      download: true,
      header: true,
      complete: (results) => {
        // Mapeamos tus nombres de columnas personalizados
        const parsed = results.data.map((row, index) => ({
          id: row.id || index,
          name: row.nombre,
          price: row.precio,
          image: row.imagen,
          link: row.enlace,
        }))
        setProducts(parsed.filter(p => p.name)) // Filtra vacíos
      },
    })
  }, [])

  return (
    <div className="min-h-screen bg-beige flex flex-col items-center p-6">
      <motion.h1
        className="text-4xl font-bold text-pink-600 mb-8 tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💖 Lovelis
      </motion.h1>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {products.map(p => (
          <motion.div
            key={p.id}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-48 h-48 object-cover rounded-xl mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-700">{p.name}</h2>
            <p className="text-pink-500 font-medium mb-3">{p.price}</p>
            <a
              href={p.link || "https://www.instagram.com/lovelis.joyas/"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm hover:bg-pink-600"
            >
              Comprar en Instagram
            </a>
          </motion.div>
        ))}
      </motion.div>

      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} Lovelis. Todos los derechos reservados.
      </footer>
    </div>
  )
}
