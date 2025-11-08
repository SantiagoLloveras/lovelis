export default function Contact() {
  return (
    <section id="contacto" className="bg-white py-16 text-center">
      <h2 className="text-3xl font-bold text-pink-600 mb-6">Contacto</h2>
      <p className="text-gray-700 mb-4">Escribinos por Instagram para hacer tu pedido:</p>
      <a
        href="https://www.instagram.com/USUARIO/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-pink-500 text-white px-6 py-3 rounded-full text-lg hover:bg-pink-600 transition"
      >
        Ir a Instagram
      </a>
    </section>
  );
}
