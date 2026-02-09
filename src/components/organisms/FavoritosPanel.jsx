import React, { useEffect, useState } from "react";

import "../../styles/favoritosPanel.css";
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

  const [showPlatformsById, setShowPlatformsById] = useState({});
  const togglePlatforms = (id) =>
    setShowPlatformsById((prev) => ({ ...prev, [id]: !prev[id] }));

  const Chip = ({ label, value, className = "" }) => {
    const v = (value ?? "").toString().trim();
    if (!v) return null;

    return (
      <div className={`favs-chip ${className}`}>
        <span className="favs-chip__label">{label}:</span>
        <span className="favs-chip__value">{v}</span>
      </div>
    );
  };

  const GroupChip = ({ label, values, className = "" }) => {
    const arr = Array.isArray(values) ? values.filter(Boolean) : [];
    if (arr.length === 0) return null;

    return (
      <div className={`favs-chip favs-chip--group ${className}`}>
        <span className="favs-chip__label">{label}:</span>
        <span className="favs-chip__value">{arr.join(" · ")}</span>
      </div>
    );
  };

  useEffect(() => {
    document.body.classList.toggle("favs-open", isOpen);
    document.documentElement.classList.toggle("favs-open", isOpen); // opcional pero útil
    return () => {
      document.body.classList.remove("favs-open");
      document.documentElement.classList.remove("favs-open");
    };
  }, [isOpen]);

  const normKey = (s = "") =>
    s
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const getPlatformLinks = (p) => {
    const names = Array.isArray(p?.plataformas) ? p.plataformas.filter(Boolean) : [];

    // 1) ✅ Como Principal: platformUrlMap (por nombre normalizado)
    if (p?.platformUrlMap && typeof p.platformUrlMap === "object") {
      const out = names.map((pl) => {
        const k = normKey(pl);
        const url = (p.platformUrlMap?.[k] || "").toString().trim();
        return { label: String(pl).trim(), url };
      });
      // si al menos una trae url, listo
      if (out.some((x) => x.url)) return out;
    }

    // 2) ✅ Tu caso backend: linksCompra (por índice)
    if (Array.isArray(p?.linksCompra) && p.linksCompra.length > 0) {
      const out = names.map((pl, idx) => ({
        label: String(pl).trim(),
        url: (p.linksCompra[idx]?.url || "").toString().trim(),
      }));
      if (out.some((x) => x.url)) return out;
    }

    // 3) ✅ Fallback: si no hay url por plataforma, usar urlCompra como link general
    const fallback = (p?.urlCompra || p?.vendorUrl || "").toString().trim();
    return names.map((pl) => ({ label: String(pl).trim(), url: fallback }));
  };

  const goToUrl = (url) => {
    const u = String(url || "").trim();
    if (!u) return;
    window.open(u, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`favs-overlay ${isOpen ? "is-open" : ""}`}
      style={{ top: `${topOffsetPx}px`, bottom: `${bottomOffsetPx}px` }}
      onClick={onClose}
    >
      <div className="favs-panel" data-theme="magenta" onClick={(e) => e.stopPropagation()}>
        {/* sin header: se cierra con Dejar de ver / ESC / clic afuera */}

        {favoritos.length === 0 ? (
          <div className="favs-empty">No tienes favoritos todavía.</div>
        ) : (
          <div className="favs-grid">
            {favoritos.map((p) => {
              const finalSrc = resolveFavSrc(p);
              const fallbackLogo = img("logos/NoLimits.webp");

              const devs = Array.isArray(p?.desarrolladores) ? p.desarrolladores.filter(Boolean) : [];
              const devsLong = devs.join(" · ").length > 25 || devs.length >= 3

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

                      <div className="favs-info">
                        {showPlatformsById[p.id] ? (
                          <div className="favs-platforms">
                              <div className="favs-platforms__title">Plataformas</div>

                            <div className="favs-platforms__grid">
                              {(() => {
                                const links = getPlatformLinks(p);

                                if (links.length === 0) {
                                  return (
                                    <div className="favs-platforms__empty">
                                      No hay plataformas configuradas para este producto.
                                    </div>
                                  );
                                }

                                return links.map((it, idx) => {
                                  const url = String(it.url || p?.urlCompra || p?.vendorUrl || "").trim();
                                  const hasUrl = !!url;

                                  return (
                                    <button
                                      key={`${p.id}-plat-${idx}`}
                                      type="button"
                                      className="favs-plat-btn"
                                      onClick={() => hasUrl && goToUrl(url)}
                                      disabled={!hasUrl} // si quieres que NUNCA se deshabilite, borra esta línea.
                                      title={hasUrl ? `Abrir: ${it.label}` : "No hay URL configurada"}
                                    >
                                      {it.label}
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        ) : (
                          <div className="favs-details">
                            <div className="favs-details__title">Detalles</div>

                            <div className="favs-attrs favs-attrs--layout">
                              <Chip className="attr-categoria" label="Categoría" value={p.tipo} />
                              <Chip className="attr-clasificacion" label="Clasificación" value={p.clasificacion} />
                              <Chip className="attr-estado" label="Estado" value={p.estado} />

                              <Chip className="attr-saga" label="Saga" value={p.saga} />

                              <GroupChip className="attr-plataformas" label="Plataformas" values={p.plataformas} />
                              <GroupChip className="attr-generos" label="Géneros" values={p.generos} />

                              <GroupChip className="attr-empresas" label="Empresas" values={p.empresas} />
                              <GroupChip
                                className={`attr-desarrolladores ${devsLong ? "attr-desarrolladores--wide" : ""}`}
                                label="Desarrolladores"
                                values={p.desarrolladores}
                              />
                            </div>
                          </div>
                        )}
                        {/* si quieres que la descripción NO aparezca cuando estás en "Ver plataformas": */}
                        {!showPlatformsById[p.id] && (() => {
                          const d = (p?.desc || "").trim();
                          const n = (p?.name || "").trim();
                          const show = d.length > 0 && d.toLowerCase() !== n.toLowerCase();
                          return show ? <p className="favs-desc">{d}</p> : null;
                        })()}
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
                      <div className="favs-actions__title">{p.name}</div>

                      <button className="favs-btn favs-btn--price" type="button" disabled>
                        {clp(p.price)}
                      </button>

                      <button
                        type="button"
                        className="favs-btn favs-btn--platforms"
                        onClick={() => togglePlatforms(p.id)}
                        aria-pressed={!!showPlatformsById[p.id]}
                      >
                        {showPlatformsById[p.id] ? "Ver detalles" : "Ver plataformas"}
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