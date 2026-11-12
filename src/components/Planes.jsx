import SectionTitle from "./SectionTitle";

function Planes({ planes, gym }) {
  if (!planes || planes.length === 0) return null;

  return (
    <section>
      <SectionTitle texto="NUESTROS PLANES" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {planes.map((plan) => {
          const esPopular = Boolean(plan.popular);
          const mensajeWsp = encodeURIComponent(`Hola! Quería consultar por el plan ${plan.nombre}.`);
          const linkWhatsapp = `https://wa.me/${gym?.whatsapp}?text=${mensajeWsp}`;

          return (
            <div
              key={plan.id}
              className={`relative bg-[var(--color-bg-card)] rounded-2xl p-8 text-center transition-all duration-300 flex flex-col ${
                esPopular ? "border-2 border-[var(--color-gold-primary)] shadow-[0_0_20px_rgba(212,175,55,0.15)]" : "border border-[var(--color-border)] hover:border-[var(--color-gold-primary)]"
              }`}
            >
              {/* Badge para el plan popular / más vendido */}
              {esPopular && (
                <div className="absolute -top-3.5 right-6 bg-[var(--color-gold-primary)] text-zinc-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow-md tracking-wider">Más vendido</div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{plan.nombre}</h3>

              <div className="my-6">
                <span className="text-4xl font-black text-[var(--color-gold-primary)]">${plan.precio}</span>
              </div>

              {/* Lista de características e información del plan */}
              <div className="mb-8 space-y-3 flex-1 text-[var(--color-text-muted)] text-sm">
                <p className="flex items-center justify-center gap-2">
                  <span className="text-[var(--color-success)] font-bold">✓</span>
                  Vigencia de {plan.duracion_dias} días
                </p>

                {plan.dias_semana && (
                  <p className="flex items-center justify-center gap-2">
                    <span className="text-[var(--color-success)] font-bold">✓</span>
                    {plan.dias_semana >= 7 ? "Acceso libre todos los días" : `${plan.dias_semana} días a la semana`}
                  </p>
                )}

                {plan.description && <p className="flex items-center justify-center gap-2 italic text-xs pt-1 border-t border-[var(--color-border)]/50 mt-2">{plan.description}</p>}
              </div>

              {/* Botón de consulta directa por WhatsApp */}
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block bg-[var(--color-gold-primary)] hover:bg-[var(--color-gold-hover)] text-zinc-950 font-bold py-3 rounded-xl transition-colors text-center cursor-pointer"
              >
                Consultar plan
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Planes;
