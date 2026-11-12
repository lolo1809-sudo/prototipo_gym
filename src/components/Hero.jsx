export default function Hero({ gym }) {
  const nombre = gym?.nombre || "DEMO";

  // Si el nombre supera los 12 caracteres, reducimos la escala para evitar desbordes
  const esLargo = nombre.length > 12;

  const clasesTamano = esLargo ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.1em]" : "text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em]";

  return (
    <div id="inicio" className="w-full flex flex-col bg-[var(--color-bg-base)] pt-8 md:pt-12">
      {/* Título */}
      <div className="w-full pt-4 md:pt-6 pb-0 flex flex-col items-center justify-center bg-[var(--color-bg-base)] select-none px-4">
        <h1 className={`w-full max-w-5xl uppercase font-bold text-white font-sans text-center break-words leading-tight ${clasesTamano}`}>{nombre}</h1>
      </div>
    </div>
  );
}
