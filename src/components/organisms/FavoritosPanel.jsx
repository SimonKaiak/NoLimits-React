import React from "react";

// Carga todo lo que haya bajo /src/assets/img y deja lista la URL para usarla en <img src="...">
const IMGS = import.meta.glob("../../assets/img/**/*", { eager: true, as: "url" });

// Función auxiliar para encontrar la imagen correcta a partir de una ruta relativa.
const img = (p) => {
  const needle = (`../../assets/img/${p}`).replace(/\\/g, "/").toLowerCase();
  let hit = Object.entries(IMGS).find(([k]) => k.toLowerCase() === needle);

  if (!hit) {
    const tail = needle.replace("../../assets/img/", "");
    hit = Object.entries(IMGS).find(([k]) => k.toLowerCase().endsWith(tail));
  }

  return hit ? hit[1] : "";
};

// Mapeo simple nombre → imagen local (igual que en Principal)
const PRODUCT_IMAGES = {
  // Spider-Man Peliculas.
  "spiderman 1": "peliculas/spiderman/PSpiderman1.webp",
  "spiderman 2": "peliculas/spiderman/PSpiderman2.webp",
  "spiderman 3": "peliculas/spiderman/PSpiderman3.webp",

  // Spider-Man Videojuegos.
  "marvel's spider-man remastered": "videojuegos/spiderman/VGSpiderman1.webp",
  "spider-man: miles morales": "videojuegos/spiderman/VGSpidermanMM.webp",
  "marvel's spider-man 2": "videojuegos/spiderman/VGSpiderman2.webp",

  // Spider-Man Accesorios.
  "máscara de spider-man – edición de colección": "accesorios/spiderman/ACCSpiderman1.webp",
  "control dualsense ps5 – edición spider-man (diseño venom / simbionte)":
    "accesorios/spiderman/ACCSpiderman2.webp",
  "audífonos gamer spider-man – edición marvel":
    "accesorios/spiderman/ACCSpiderman3.webp",

  // Minecraft Peliculas
  "una pelicula de minecraft": "peliculas/minecraft/PMinecraft.webp",
  "una película de minecraft": "peliculas/minecraft/PMinecraft.webp",

  // Minecraft Videojuegos
  "minecraft: java & bedrock": "videojuegos/minecraft/VGMinecraftJyB.webp",
  "minecraft: dungeons": "videojuegos/minecraft/VGMinecraftDungeons.webp",

  // Minecraft Accesorios.
  "lampara abeja minecraft": "accesorios/minecraft/ACCMinecraft1.webp",
  "audifonos gamer minecraft - edicion mojang":
    "accesorios/minecraft/ACCMinecraft2.webp",
  "preservativo minecraft": "accesorios/minecraft/ACCMinecraft3.webp",
};

const clp = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

const norm = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

// Normaliza una ruta que venga del backend (ej: "src/assets/img/...")
const normalizeImgPath = (p = "") =>
  p.replace(/^src\/assets\/img\//i, "").replace(/^\/+/, "");

// Si te llega una ruta desde backend, resuélvela; si no, usa mapeo por nombre
const resolveFavSrc = (p) => {
  // 1) si viene un src, úsalo SOLO si NO es el logo de NoLimits (porque eso quedó guardado en favoritos)
  const src = String(p?.src || "").trim();
  if (src && !src.toLowerCase().includes("nolimits")) return src;

  // 2) si viene imagen desde backend
  const remoteImg =
    Array.isArray(p?.imagenes) && p.imagenes.length > 0 ? p.imagenes[0] : null;

  if (remoteImg) {
    const resolved = img(normalizeImgPath(remoteImg));
    if (resolved) return resolved;
  }

  // 3) por nombre (mapeo local)
  const key = norm(p?.name || p?.nombre);
  const local = PRODUCT_IMAGES[key] || "logos/NoLimits.webp";
  return img(local) || "";
};

export default function FavoritosPanel({
  isOpen,
  topOffsetPx = 120,
  bottomOffsetPx = 100,
  favoritos = [],
  onClose,
  onRemove,
}) {
  const goToVendor = (p) => {
    const url = p?.urlCompra || p?.vendorUrl;
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const join = (arr) =>
    Array.isArray(arr) && arr.length ? arr.join(" · ") : "";

  const Chip = ({ label, value }) => {
    const v = (value ?? "").toString().trim();
    if (!v) return null;
    return (
      <span className="favs-attr">
        {label}: {v}
      </span>
    );
  };

  return (
    <div
      className={`favs-overlay ${isOpen ? "is-open" : ""}`}
      style={{ top: `${topOffsetPx}px`, bottom: `${bottomOffsetPx}px` }}
      onClick={onClose}
    >
      <div className="favs-panel" onClick={(e) => e.stopPropagation()}>
        {/* sin header: se cierra con Dejar de ver / ESC / clic afuera */}

        {favoritos.length === 0 ? (
          <div className="favs-empty">No tienes favoritos todavía.</div>
        ) : (
          <div className="favs-grid">
            {favoritos.map((p) => {
              const finalSrc = resolveFavSrc(p);
              const fallbackLogo = img("logos/NoLimits.webp");

              return (
                <article key={p.id} className="favs-card">
                  <div className="favs-product">
                    {/* IZQUIERDA */}
                    <div className="favs-image">
                      <img
                        src={finalSrc || fallbackLogo}
                        alt={p.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = fallbackLogo;
                        }}
                      />
                    </div>

                    {/* CENTRO */}
                    <div className="favs-info">
                      <h3 className="favs-title">{p.name}</h3>

                      <div className="favs-attrs">
                        <Chip label="Categoría" value={p.tipo} />
                        <Chip label="Clasificación" value={p.clasificacion} />
                        <Chip label="Estado" value={p.estado} />
                        <Chip label="Saga" value={p.saga} />

                        <Chip label="Plataformas" value={join(p.plataformas)} />
                        <Chip label="Géneros" value={join(p.generos)} />
                        <Chip label="Empresas" value={join(p.empresas)} />
                        <Chip
                          label="Desarrolladores"
                          value={join(p.desarrolladores)}
                        />
                      </div>

                      {(() => {
                        const d = (p?.desc || "").trim();
                        const n = (p?.name || "").trim();
                        const show =
                          d.length > 0 && d.toLowerCase() !== n.toLowerCase();
                        return show ? (
                          <p className="favs-desc">{d}</p>
                        ) : null;
                      })()}
                    </div>

                    {/* DERECHA */}
                    <div className="favs-actions">
                      <button
                        className="favs-btn favs-btn--price"
                        type="button"
                        disabled
                      >
                        {clp(p.price)}
                      </button>

                      <button
                        className="favs-btn favs-btn--primary"
                        onClick={() => goToVendor(p)}
                        disabled={!(p?.urlCompra || p?.vendorUrl)}
                        title={
                          !(p?.urlCompra || p?.vendorUrl)
                            ? "Este producto no tiene link de compra"
                            : ""
                        }
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}