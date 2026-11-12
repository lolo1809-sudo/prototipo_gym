import SectionTitle from "./SectionTitle";

export default function Ubicacion({ ubicacion }) {
  return (
    <section id="ubicacion" className="w-full bg-[var(--color-bg-base)] py-16 px-4">
      <div className="mx-auto">
        <SectionTitle texto="DÓNDE ENCONTRARNOS" />

        <div className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <iframe
            title="Ubicación del Local"
            src={ubicacion}
            className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 contrast-125 brightness-90 grayscale-[25%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
