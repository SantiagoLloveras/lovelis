import { motion } from "framer-motion";

export default function ProductCard({ producto }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
    >
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{producto.nombre}</h3>
        <p className="text-sm text-gray-600 mt-1">{producto.descripcion}</p>
        <p className="text-pink-600 font-bold mt-2">${producto.precio}</p>
        <a
          href={`https://www.instagram.com/direct/t/USUARIO/?text=Hola!%20Quisiera%20consultar%20por%20el%20producto:%20${encodeURIComponent(producto.nombre)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block bg-pink-500 text-white px-4 py-2 rounded-full text-sm hover:bg-pink-600 transition"
        >
          Consultar
        </a>
      </div>
    </motion.div>
  );
}
