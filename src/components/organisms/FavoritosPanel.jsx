import React from "react";

const clp = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

export default function FavoritosPanel({
  isOpen,
  topOffsetPx = 120,
  bottomOffsetPx = 100,
  favoritos = [],
  onClose,
  onClear,
  onRemove,
}) {
  const goToVendor = (p) => {
    const url = p?.urlCompra || p?.vendorUrl;
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const join = (arr) => (Array.isArray(arr) && arr.length ? arr.join(" · ") : "");

  // ✅ helper para chip uniforme
  const Chip = ({ label, value }) => {
    const v = (value ?? "").toString().trim();
    if (!v) return null;
    return <span className="favs-attr">{label}: {v}</span>;
  };

  return (
    <div
      className={`favs-overlay ${isOpen ? "is-open" : ""}`}
      style={{ top: `${topOffsetPx}px`, bottom: `${bottomOffsetPx}px` }}
      onClick={onClose}
    >
      <div className="favs-panel" onClick={(e) => e.stopPropagation()}>
        <div className="favs-header">
          <button className="favs-btn" onClick={onClose}>- Cerrar -</button>
          <button className="favs-btn favs-btn--danger" onClick={onClear}>
            - Borrar todos -
          </button>
        </div>

        {favoritos.length === 0 ? (
          <div className="favs-empty">No tienes favoritos todavía.</div>
        ) : (
          <div className="favs-grid">
            {favoritos.map((p) => (
              <article key={p.id} className="favs-card">
                <div className="favs-product">
                  {/* IZQUIERDA */}
                  <div className="favs-image">
                    <img src={p.src} alt={p.name} loading="lazy" />
                  </div>

                  {/* CENTRO */}
                  <div className="favs-info">
                    <h3 className="favs-title">{p.name}</h3>

                    {/* ✅ TODO como chips */}
                    <div className="favs-attrs">
                      <Chip label="Categoría" value={p.tipo} />
                      <Chip label="Clasificación" value={p.clasificacion} />
                      <Chip label="Estado" value={p.estado} />
                      <Chip label="Saga" value={p.saga} />

                      <Chip label="Plataformas" value={join(p.plataformas)} />
                      <Chip label="Géneros" value={join(p.generos)} />
                      <Chip label="Empresas" value={join(p.empresas)} />
                      <Chip label="Desarrolladores" value={join(p.desarrolladores)} />
                    </div>

                    {/* ✅ Descripción (opcional, no repetida) */}
                    {(() => {
                      const d = (p?.desc || "").trim();
                      const n = (p?.name || "").trim();
                      const show = d.length > 0 && d.toLowerCase() !== n.toLowerCase();
                      return show ? <p className="favs-desc">{d}</p> : null;
                    })()}
                  </div>

                  {/* DERECHA */}
                  <div className="favs-actions">
                    <button className="favs-btn favs-btn--price" type="button" disabled>
                      {clp(p.price)}
                    </button>
                    
                    <button
                      className="favs-btn favs-btn--primary"
                      onClick={() => goToVendor(p)}
                      disabled={!(p?.urlCompra || p?.vendorUrl)}
                      title={!(p?.urlCompra || p?.vendorUrl) ? "Este producto no tiene link de compra" : ""}
                    >
                      Ir al sitio
                    </button>

                    <button
                      className="favs-btn favs-btn--danger"
                      onClick={() => onRemove?.(p.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}