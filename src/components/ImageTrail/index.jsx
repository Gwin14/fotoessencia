import { useRef, useEffect } from "react";
import "./ImageTrail.css";

// Mapa de imports dinâmicos — só a variante usada será carregada pelo browser
const variantImports = {
  1: () => import("./variants/Variant1.js"),
  2: () => import("./variants/Variant2.js"),
  3: () => import("./variants/Variant3.js"),
  4: () => import("./variants/Variant4.js"),
  5: () => import("./variants/Variant5.js"),
  6: () => import("./variants/Variant6.js"),
  7: () => import("./variants/Variant7.js"),
  8: () => import("./variants/Variant8.js"),
};

export default function ImageTrail({
  items = [],
  variant = 1,
  backgroundImage,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    const loader = variantImports[variant] ?? variantImports[1];

    loader().then(({ default: VariantClass }) => {
      // Garante que o componente ainda está montado antes de instanciar
      if (!cancelled && containerRef.current) {
        new VariantClass(containerRef.current);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [variant, items]);

  return (
    <div
      className="content"
      ref={containerRef}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(255,255,255,0.5) 80%, rgb(255,255,255) 100%), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }
          : undefined
      }
    >
      {items.map((url, i) => (
        <div className="content__img" key={i}>
          <div
            className="content__img-inner"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
