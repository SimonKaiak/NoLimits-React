// Ruta: src/components/organisms/SagaCarousel.jsx
import React, { useEffect, useState } from "react";
import {
  obtenerSagas,
} from "../../services/productos";
import "../../styles/sagaCarousel.css";

// Carga todas las imágenes bajo /src/assets/img
const IMGS = import.meta.glob("/src/assets/img/**/*", {
  eager: true,
  as: "url",
});

// Helper para encontrar la imagen correcta (acepta rutas tipo "sagas/..." o "/img/sagas/...")
const img = (p) => {
  if (typeof p !== "string") {
    console.warn("img() recibió un valor no string:", p);
    return "";
  }

  const cleaned = p
    .replace(/^\/?img\//i, "")
    .replace(/^\/?assets\/img\//i, "")
    .replace(/^\/?src\/assets\/img\//i, "");

  const hit = Object.entries(IMGS).find(([k]) =>
    k.toLowerCase().endsWith(cleaned.toLowerCase())
  );

  if (!hit) {
    console.warn("Imagen de saga no encontrada →", p);
    return "";
  }
  return hit[1];
};

// Normaliza el nombre de la saga (sin espacios ni guiones)
const sagaKey = (nombre) => {
  if (typeof nombre !== "string") return "";
  return nombre.toLowerCase().replace(/[\s-]/g, "");
};

// Mapeo nombre de saga → imagen local por defecto (por si el back no manda portada)
const SAGA_IMAGES = {
  spiderman: "sagas/SagaSpiderman.webp",
};

export default function SagaCarousel({ onSagaSelect, selectedSagaName }) {
  const [sagas, setSagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function cargarSagas() {
      try {
        setLoading(true);
        setError("");

        const crudas = await obtenerSagas();
        console.log("Sagas recibidas desde backend:", crudas);

        const isUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);

        const sagasConImagen = crudas.map((s) => {
          const key = sagaKey(s.nombre);
          const fallbackPath = SAGA_IMAGES[key] || null;

          const finalPath = s.portadaSaga || fallbackPath || null;

          const finalImg = finalPath 
            ? (isUrl(finalPath) ? finalPath : img(finalPath))
            : null;

          return {
            nombre: s.nombre,
            portadaSaga: finalImg,
          };
        });

        setSagas(sagasConImagen);
        setIndex(0);
      } catch (e) {
        console.error(e);
        setError("Error al cargar las sagas");
      } finally {
        setLoading(false);
      }
    }

    cargarSagas();
  }, []);

  useEffect(() => {
    if (index >= sagas.length && sagas.length > 0) {
      setIndex(0);
    }
  }, [sagas.length, index]);

  const handleClickSaga = (saga) => {
    if (onSagaSelect) onSagaSelect(saga.nombre);
  };

  const move = (dir) => {
    if (!sagas.length) return;
    setIndex((prev) => (prev + dir + sagas.length) % sagas.length);
  };

  if (loading) return <p style={{ color: "white" }}>Cargando sagas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!sagas.length)
    return <p style={{ color: "white" }}>No hay sagas para mostrar.</p>;

  return (
    <div className="carousel-container">
      <div className="saga-carousel">
        <button
          className="saga-arrow saga-arrow-left"
          onClick={() => move(-1)}
          disabled={sagas.length <= 1}
        >
          ❮
        </button>

        <div className="saga-carousel-window">
          <div
            className="saga-carousel-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {sagas.map((saga) => {
              const isActive = selectedSagaName === saga.nombre;
              const hasImage = Boolean(saga.portadaSaga);

              return (
                <div className="saga-slide" key={saga.nombre}>
                  <div
                    className={`saga-card ${isActive ? "is-active" : ""}`}
                    onClick={() => handleClickSaga(saga)}
                  >
                    {hasImage ? (
                      <img
                        src={saga.portadaSaga}
                        alt={saga.nombre}
                        className="saga-card-image"
                        onError={(e) => {
                          e.currentTarget.onerror = null; // Evita loop infinito. Esto evita que si el fallback tambien falla, React entre en un ciclo infinito
                          const fallback = img("logos/NoLimits.webp");
                          e.currentTarget.src = fallback || "/favicon.ico"; // Imagen respaldo
                        }}
                      />
                    ) : (
                      <div className="saga-card-placeholder">
                        {saga.nombre?.charAt(0) || "?"}
                      </div>
                    )}

                    <div className="saga-card-info">
                      <h3 className="saga-card-name">{saga.nombre}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="saga-arrow saga-arrow-right"
          onClick={() => move(1)}
          disabled={sagas.length <= 1}
        >
          ❯
        </button>
      </div>
    </div>
  );
}