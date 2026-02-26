export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a365d] to-[#2563eb] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">ColegiosRD</h1>
          <p className="text-[#93c5fd] text-lg">.com</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Próximamente
          </h2>
          <p className="text-[#bfdbfe] leading-relaxed">
            Estamos trabajando para traerte el directorio de colegios más completo
            de República Dominicana, con datos oficiales del MINERD.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[#93c5fd] text-sm">
            ¿Eres un colegio y quieres aparecer verificado?
          </p>
          <a
            href="mailto:info@colegiosrd.com"
            className="inline-block bg-white text-[#1a365d] font-bold px-8 py-3 rounded-lg hover:bg-[#f0f9ff] transition-colors"
          >
            Contáctanos
          </a>
        </div>

        <p className="mt-12 text-[#60a5fa] text-xs">
          © 2026 ColegiosRD.com — Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
