export default function Testimonials() {
  const testimonios = [
    { nombre: "María", texto: "Las cremas son increíbles, mi piel cambió totalmente 💕" },
    { nombre: "Lucía", texto: "El perfume que compré es exquisito, me dura todo el día." },
    { nombre: "Valentina", texto: "Excelente atención, súper recomendable!" },
  ];

  return (
    <section id="testimonios" className="bg-pink-50 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-pink-600 mb-8">Testimonios</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonios.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-700 italic">“{t.texto}”</p>
              <p className="mt-3 font-semibold text-pink-600">- {t.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
