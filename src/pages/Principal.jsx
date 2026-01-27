import { useEffect, useRef, useState } from "react";
import { Link, Element, scroller } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../styles/principal.css";
import SagaCarousel from "../components/organisms/SagaCarousel";
import { listarProductos } from "../services/productos";
import FavoritosPanel from "../components/organisms/FavoritosPanel";

// Carga todo lo que haya bajo /src/assets/img y deja lista la URL para usarla en <img src="...">
const IMGS = import.meta.glob("../assets/img/**/*", { eager: true, as: "url" });

// Función auxiliar para encontrar la imagen correcta a partir de una ruta relativa.
const img = (p) => {
  const needle = (`../assets/img/${p}`).replace(/\\/g, "/").toLowerCase();
  let hit = Object.entries(IMGS).find(([k]) => k.toLowerCase() === needle);
  if (!hit) {
    const tail = needle.replace("../assets/img/", "");
    hit = Object.entries(IMGS).find(([k]) => k.toLowerCase().endsWith(tail));
  }
  if (!hit) {
    console.warn("Imagen no encontrada →", p);
    return "";
  }
  return hit[1];
};

// Mapeo simple nombre → imagen local.
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

// Formatea un número como pesos chilenos.
const clp = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

// ====== Storage / Favoritos ======
const FAV_STORAGE = { FAVS: "nl_favoritos" };

function useFavoritos() {
  const [favs, setFavs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAV_STORAGE.FAVS)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAV_STORAGE.FAVS, JSON.stringify(favs));
  }, [favs]);

  const toggleFav = (product) => {
    if (!product?.id) return;

    setFavs((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [product, ...prev];
    });
  };

  const removeFav = (id) => setFavs((prev) => prev.filter((p) => p.id !== id));

  const clearFavs = () => setFavs([]);

  const isFav = (id) => favs.some((p) => p.id === id);

  return { favs, toggleFav, removeFav, clearFavs, isFav };
}

// ====== Carrusel de productos por sección ======
function Carousel({
  id,
  productos,
  sectionKey,
  navH,
  targetName,
  onToggleFav,
  isFavFn,
}) {
  const slides = productos || [];
  const [i, setI] = useState(0);
  const [openInfo, setOpenInfo] = useState(false);
  const ctaRef = useRef(null);

  const hasSlides = slides.length > 0;

  // Índice seguro y producto actual protegido
  const safeIndex = hasSlides
    ? Math.max(0, Math.min(i, slides.length - 1))
    : 0;

  const current = hasSlides ? slides[safeIndex] : null;

  const goToLink = () => {
    if (!current?.urlCompra) {
      alert("Este producto no tiene link configurado todavía.");
      return;
    }
    window.open(current.urlCompra, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (!hasSlides) return;
    if (i >= slides.length) {
      setI(0);
      setOpenInfo(false);
    }
  }, [hasSlides, slides.length, i]);

  useEffect(() => {
    if (!hasSlides) return;
    const el = ctaRef.current;
    if (!el) return;
    el.classList.add("nl-cta--fade");
    const t = setTimeout(() => el.classList.remove("nl-cta--fade"), 150);
    return () => clearTimeout(t);
  }, [hasSlides, safeIndex]);

  useEffect(() => {
    if (!hasSlides || !targetName) return;
    const idx = slides.findIndex(
      (s) => s.name.toLowerCase() === targetName.toLowerCase()
    );
    if (idx !== -1) {
      setI(idx);
      setOpenInfo(true);
    }
  }, [hasSlides, targetName, slides]);

  if (!hasSlides) {
    return (
      <section className={`producto card p-2 m-2 ${sectionKey}`} id={id}>
        <div className="nl-carousel nl-carousel--empty">
          <p className="text-center text-muted m-0">
            No hay productos disponibles en esta categoría.
          </p>
        </div>
      </section>
    );
  }

  const pretty = {
    peliculas: "- Películas -",
    videojuegos: "- Videojuegos -",
    accesorios: "- Accesorios -",
  };

  const RELATED = {
    peliculas: ["videojuegos", "accesorios"],
    videojuegos: ["peliculas", "accesorios"],
    accesorios: ["peliculas", "videojuegos"],
  };

  const go = (dir) => {
    setOpenInfo(false);
    setI((prev) => (prev + dir + slides.length) % slides.length);
  };

  // ✅ Offsets limpios (sin + -33 raros)
  const sectionOffsets = {
    peliculas: -(navH - 33),
    videojuegos: -(navH - 33),
    accesorios: -(navH - 110),
  };

  // ✅ Jump directo por key ("peliculas" | "videojuegos" | "accesorios")
  const jumpTo = (key) => {
    const offset =
      sectionOffsets[key] !== undefined ? sectionOffsets[key] : -navH;

    scroller.scrollTo(key, {
      smooth: true,
      duration: 1,
      offset,
    });
  };

  const related = RELATED[sectionKey];

  return (
    <section className={`producto card p-2 m-2 ${sectionKey}`} id={id}>
      <div className="nl-carousel">
        <button className="nl-prev" onClick={() => go(-1)}>
          ❮-
        </button>

        <div
          className="nl-carousel-track"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {slides.map((s, idx) => (
            <div className="nl-slide" key={s.id ?? idx}>
              <img
                className="overlay"
                src={s.src}
                alt={s.alt || s.name}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <button className="nl-next" onClick={() => go(1)}>
          -❯
        </button>

        <div className={`nl-cta ${openInfo ? "is-open" : "is-closed"}`} ref={ctaRef}>
          {!openInfo && current && (
            <>
              {/* ✅ Ya NO mostramos el precio arriba */}
              <div className="nl-actions">
                <button className="btn btn-info" onClick={() => setOpenInfo(true)}>
                  - Más información -
                </button>

                {/* ✅ El precio ocupa el lugar del favorito */}
                <strong className="nl-price" style={{ margin: 0 }}>
                  {clp(current.price)}
                </strong>

                <button className="btn btn-success nl-add" onClick={goToLink}>
                  {current?.labelCompra || "Ir al sitio"}
                </button>
              </div>
            </>
          )}

          {openInfo && current && (
            <>
              <div
                className="nl-actions"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button className="btn btn-info" onClick={() => setOpenInfo(false)}>
                  - Menos información -
                </button>

                <strong className="nl-price" style={{ margin: 0 }}>
                  {clp(current.price)}
                </strong>

                <button className="btn btn-success nl-add" onClick={goToLink}>
                  {current?.labelCompra || "Ir al sitio"}
                </button>
              </div>

              <div className="nl-info mt-2">
                <div className="card card-body nl-product-info">

                  {/* TÍTULO */}
                  <h3 className="nl-product-title">
                    {current.name}
                  </h3>

                  {/* GRID DE ATRIBUTOS */}
                  <div className="nl-product-grid">

                    <div className="nl-product-col">
                      {current?.id && <p><strong>ID:</strong> #{current.id}</p>}
                      {current.tipo && <p><strong>Categoría:</strong> {current.tipo}</p>}
                      {current.clasificacion && <p><strong>Clasificación:</strong> {current.clasificacion}</p>}
                      {current.estado && <p><strong>Estado:</strong> {current.estado}</p>}
                      {current.saga && <p><strong>Saga:</strong> {current.saga}</p>}
                    </div>

                    <div className="nl-product-col">
                      <p><strong>Precio:</strong> {clp(current.price)}</p>

                      {current.plataformas?.length > 0 && (
                        <p><strong>Plataformas:</strong> {current.plataformas.join(" · ")}</p>
                      )}
                      {current.generos?.length > 0 && (
                        <p><strong>Géneros:</strong> {current.generos.join(" · ")}</p>
                      )}
                      {current.empresas?.length > 0 && (
                        <p><strong>Empresas:</strong> {current.empresas.join(" · ")}</p>
                      )}
                      {current.desarrolladores?.length > 0 && (
                        <p><strong>Desarrolladores:</strong> {current.desarrolladores.join(" · ")}</p>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              <div
                className="nl-related mt-2"
                style={{ display: "flex", gap: ".75rem", justifyContent: "center" }}
              >
                <button
                  className="btn btn-outline-info nl-link"
                  onClick={() => jumpTo(related[0])}
                >
                  {pretty[related[0]]}
                </button>

                {/* ⭐ Favorito al medio (mismo color que el precio por CSS) */}
                <button
                  className="btn nl-fav-btn"
                  onClick={() => onToggleFav?.(current)}
                  title="Guardar / quitar de favoritos"
                >
                  {isFavFn?.(current?.id) ? "⭐ Guardado" : "☆ Favorito"}
                </button>

                <button
                  className="btn btn-outline-info nl-link"
                  onClick={() => jumpTo(related[1])}
                >
                  {pretty[related[1]]}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ====== Componente Principal de la ruta /principal ======
export default function Principal() {
  const navigate = useNavigate();

  const [selectedSaga, setSelectedSaga] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const [peliculas, setPeliculas] = useState([]);
  const [videojuegos, setVideojuegos] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  // ✅ Favoritos
  const { favs, toggleFav, removeFav, clearFavs, isFav } = useFavoritos();
  const [favsOpen, setFavsOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [searchHit, setSearchHit] = useState(null);

  // Funcion para scrollear a las secciones.
  const [navH, setNavH] = useState(120);

  // Precargar productos en segundo plano al entrar a /principal
  useEffect(() => {
    listarProductos()
      .then((list) => {
        if (Array.isArray(list)) setAllProducts(list);
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  useEffect(() => {
    const calc = () => {
      const nav = document.querySelector(
        "nav.navbar.bg-body-tertiary.fixed-top"
      );
      setNavH((nav?.offsetHeight || 120) + 10);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    document.body.classList.add("route-principal");
    return () => document.body.classList.remove("route-principal");
  }, []);

  // Escape cierra favoritos
  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") setFavsOpen(false);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("favs-open", favsOpen);
    return () => document.body.classList.remove("favs-open");
  }, [favsOpen]);

  // Cargar productos SOLO cuando haya saga seleccionada
  useEffect(() => {
    if (!selectedSaga) {
      setPeliculas([]);
      setVideojuegos([]);
      setAccesorios([]);
      return;
    }

    // Normaliza una ruta que venga del backend (ej: "src/assets/img/...")
    const normalizeImgPath = (p = "") =>
      p.replace(/^src\/assets\/img\//i, "").replace(/^\/+/, "");

    // Normaliza texto (para keys: sin tildes, lower, trim)
    const norm = (s = "") =>
      s
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const isHttp = (s = "") => /^https?:\/\//i.test(String(s));

    function cargarProductosDeSaga() {
      try {
        // 1) Filtrar por saga
        const data = allProducts.filter((p) => {
          const sagaProd = (p.sagaNombre || p.saga || "")
            .toString()
            .toLowerCase()
            .trim();

          const sagaSel = (selectedSaga || "").toString().toLowerCase().trim();

          return sagaProd.includes(sagaSel);
        });

        if (!Array.isArray(data)) return;

        // 2) Tipo normalizado
        const getTipo = (p) =>
          (p.tipoProductoNombre || p.tipoProducto || p.tipo || "")
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // 3) Mapeo a slide
        const mapToSlide = (p) => {
          const key = norm(p.nombre);
          const localImage = PRODUCT_IMAGES[key] || "logos/NoLimits.webp";

          const remoteImg =
            Array.isArray(p.imagenes) && p.imagenes.length > 0
              ? p.imagenes[0]
              : null;

          const finalSrc = remoteImg
            ? (isHttp(remoteImg)
                ? remoteImg
                : (img(normalizeImgPath(remoteImg)) || img(localImage)))
            : img(localImage);

          return {
            id: p.id,
            name: p.nombre,
            price: p.precio,
            desc: p.descripcion?.trim() || "",

            src: finalSrc,
            alt: p.nombre,
            urlCompra: p.urlCompra || null,
            labelCompra: p.labelCompra || null,

            tipo: p.tipoProductoNombre || p.tipoProducto || null,
            clasificacion: p.clasificacionNombre || null,
            estado: p.estadoNombre || null,
            saga: p.saga || null,
            plataformas: Array.isArray(p.plataformas) ? p.plataformas : [],
            generos: Array.isArray(p.generos) ? p.generos : [],
            empresas: Array.isArray(p.empresas) ? p.empresas : [],
            desarrolladores: Array.isArray(p.desarrolladores)
              ? p.desarrolladores
              : [],
          };
        };

        // 4) Separar por categoría
        const peliculasData = data.filter((p) => getTipo(p).includes("pelic"));

        const minecraftOrder = ["minecraft: java & bedrock", "minecraft: dungeons"];

        let videojuegosData = data.filter((p) => getTipo(p).includes("video"));

        if ((selectedSaga || "").toLowerCase() === "minecraft") {
          videojuegosData = videojuegosData.sort((a, b) => {
            const aName = norm(a.nombre);
            const bName = norm(b.nombre);

            const aIdx = minecraftOrder.indexOf(aName);
            const bIdx = minecraftOrder.indexOf(bName);

            if (aIdx === -1 && bIdx === -1) return 0;
            if (aIdx === -1) return 1;
            if (bIdx === -1) return -1;
            return aIdx - bIdx;
          });
        }

        let accesoriosData = data.filter((p) => getTipo(p).includes("acces"));

        const minecraftAccOrder = [
          "lampara abeja minecraft",
          "audifonos gamer minecraft - edicion mojang",
          "preservativo minecraft",
        ];

        if ((selectedSaga || "").toLowerCase() === "minecraft") {
          accesoriosData = accesoriosData.sort((a, b) => {
            const aName = norm(a.nombre);
            const bName = norm(b.nombre);

            const aIdx = minecraftAccOrder.indexOf(aName);
            const bIdx = minecraftAccOrder.indexOf(bName);

            if (aIdx === -1 && bIdx === -1) return 0;
            if (aIdx === -1) return 1;
            if (bIdx === -1) return -1;
            return aIdx - bIdx;
          });
        }

        // 5) Set state
        setPeliculas(peliculasData.map(mapToSlide));
        setVideojuegos(videojuegosData.map(mapToSlide));
        setAccesorios(accesoriosData.map(mapToSlide));
      } catch (err) {
        console.error("Error cargando productos de saga:", err);
      }
    }

    cargarProductosDeSaga();
  }, [selectedSaga, allProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q) return;

    if (!selectedSaga) {
      alert("Primero selecciona una saga del carrusel.");
      return;
    }

    const secciones = { peliculas, videojuegos, accesorios };

    let found = null;
    for (const [section, arr] of Object.entries(secciones)) {
      const idx = arr.findIndex((s) => s.name.toLowerCase().includes(q));
      if (idx !== -1) {
        found = { section, name: arr[idx].name };
        break;
      }
    }

    if (!found) {
      alert(
        "No se encontró ningún producto con ese nombre en la saga seleccionada."
      );
      return;
    }

    setSearchHit(found);

    scroller.scrollTo(found.section, {
      smooth: true,
      duration: 600,
      offset: -navH,
    });
  };

  return (
    <div id="top">
      <Element name="top" />

      {/* NAVBAR PRINCIPAL */}
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              {/* HAMBURGUESA DE USUARIO — IZQUIERDA */}
              <div className="dropdown user-menu-wrapper me-3">
                <button
                  className="btn-hamburger dropdown-toggle"
                  type="button"
                  id="userMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  ☰
                </button>
                <ul
                  className="dropdown-menu user-menu"
                  aria-labelledby="userMenuButton"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/perfil")}
                    >
                      Perfil
                    </button>
                  </li>

                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setFavsOpen(true)}
                    >
                      Favoritos ⭐ ({favs.length})
                    </button>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        localStorage.removeItem("nl_auth");
                        window.location.href = "/";
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>

              {/* Marca centrada */}
              <h1 id="brand">°-._ NoLimits _.-°</h1>

              {/* Esto empuja el resto a la derecha */}
              <div className="flex-grow-1" />

              {/* Buscador */}
              <form className="search-box me-2" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="icon-btn">
                  <span className="icon">🔍</span>
                </button>
              </form>

              {/* Botón Ver Favoritos */}
              <button
                className="btn btn-outline-warning me-2"
                onClick={() => setFavsOpen(true)}
              >
                ⭐ Ver Favoritos ({favs.length})
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO PRINCIPAL */}
      <header className="page-hero text-center">
        <p className="page-subtitle">
          _.- Todo lo que buscas en un solo lugar -._
          <span className="sub-underline"></span>
        </p>
        <div className="hero-logo">
          <img
            src={img("logos/NoLimits.webp")}
            alt="Logo NoLimits"
            className="hero-logo-img"
            loading="lazy"
          />
        </div>
      </header>

      {/* SAGAS DESTACADAS */}
      <section className="sagas-section">
        <h2 className="sagas-title">- Sagas destacadas -</h2>
        <SagaCarousel
          onSagaSelect={setSelectedSaga}
          selectedSagaName={selectedSaga}
        />

        {/* Botones rápidos de categoría bajo el carrusel */}
        {selectedSaga && (
          <div className="saga-category-buttons">
            <button
              type="button"
              className="saga-cat-btn"
              onClick={() =>
                scroller.scrollTo("peliculas", {
                  smooth: true,
                  duration: 1,
                  offset: -(navH - 33),
                })
              }
            >
              - Películas -
            </button>

            <button
              type="button"
              className="saga-cat-btn"
              onClick={() =>
                scroller.scrollTo("videojuegos", {
                  smooth: true,
                  duration: 1,
                  offset: -(navH - 33),
                })
              }
            >
              - Videojuegos -
            </button>

            <button
              type="button"
              className="saga-cat-btn"
              onClick={() =>
                scroller.scrollTo("accesorios", {
                  smooth: true,
                  duration: 1,
                  offset: -(navH - 110),
                })
              }
            >
              - Accesorios -
            </button>
          </div>
        )}
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="productos-container d-flex flex-column align-items-center">
        {!selectedSaga && (
          <div className="saga-helper-wrapper">
            <p className="saga-helper-banner">
              _.- Selecciona una saga del carrusel superior para ver las
              películas, videojuegos y accesorios relacionados -._
              <span className="saga-helper-underline"></span>
            </p>
          </div>
        )}

        {selectedSaga && (
          <>
            {/* Películas */}
            <Element name="peliculas">
              <div>
                <h2 id="peliculas-title" className="titulos">
                  - Películas{selectedSaga ? ` : ${selectedSaga}` : ""} -
                </h2>
              </div>
            </Element>
            <Carousel
              id="peliculas"
              sectionKey="peliculas"
              productos={peliculas}
              navH={navH}
              targetName={
                searchHit?.section === "peliculas" ? searchHit.name : null
              }
              onToggleFav={toggleFav}
              isFavFn={isFav}
            />

            {/* Videojuegos */}
            <Element name="videojuegos">
              <div className="titulos">
                <h2 id="videojuegos-title">
                  - Videojuegos{selectedSaga ? ` : ${selectedSaga}` : ""} -
                </h2>
              </div>
            </Element>
            <Carousel
              id="videojuegos"
              sectionKey="videojuegos"
              productos={videojuegos}
              navH={navH}
              targetName={
                searchHit?.section === "videojuegos" ? searchHit.name : null
              }
              onToggleFav={toggleFav}
              isFavFn={isFav}
            />

            {/* Accesorios */}
            <Element name="accesorios">
              <div>
                <h2 id="accesorios-title" className="titulos">
                  - Accesorios{selectedSaga ? ` : ${selectedSaga}` : ""} -
                </h2>
              </div>
            </Element>
            <Carousel
              id="accesorios"
              sectionKey="accesorios"
              productos={accesorios}
              navH={navH}
              targetName={
                searchHit?.section === "accesorios" ? searchHit.name : null
              }
              onToggleFav={toggleFav}
              isFavFn={isFav}
            />
          </>
        )}
      </main>

      {/* PANEL DE FAVORITOS */}
      <FavoritosPanel
        isOpen={favsOpen}
        topOffsetPx={navH}
        bottomOffsetPx={100}
        favoritos={favs}
        onClose={() => setFavsOpen(false)}
        onClear={clearFavs}
        onRemove={removeFav}
        onGoToProduct={(p) => {
          // opcional: scrollear a la sección y abrir “más info”
          // por ahora lo dejamos simple:
          alert(`Producto: ${p.name}`);
        }}
      />

      {/* FOOTER */}
      <footer>
        <nav className="nl-nav1">
          <div className="nl-nav1-inner">
            <div className="nl-nav1-left">
              <Link
                className="nl-nav1-item"
                to="top"
                smooth={true}
                offset={-(navH - 735)}
                duration={5}
              >
                ↕️ <span>- Sagas destacadas - ⬆️ </span>
              </Link>
            </div>
            <div className="nl-nav1-center">
              <span id="sub-brand">_.-°-._ All in One _.-°-._</span>
            </div>
            <div className="nl-nav1-right">
              <small className="footer-copy">- © 2025 NoLimits SPA -</small>
              <a className="nl-nav1-item" href="#">
                📄 <span>- Términos - 📄</span>
              </a>
              <a className="nl-nav1-item" href="#">
                🔒 <span>- Privacidad - 🔒</span>
              </a>
            </div>
          </div>
        </nav>
      </footer>
    </div>
  );
}