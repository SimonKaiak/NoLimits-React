import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Element, scroller } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../styles/principal.css";
import SagaCarousel from "../components/organisms/SagaCarousel";
import { obtenerProductosPorSaga, listarProductos } from "../services/productos";

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
  "control dualsense ps5 – edición spider-man (diseño venom / simbionte)": "accesorios/spiderman/ACCSpiderman2.webp",
  "audífonos gamer spider-man – edición marvel": "accesorios/spiderman/ACCSpiderman3.webp",

  // Minecraft Peliculas
  "una pelicula de minecraft": "peliculas/minecraft/PMinecraft.webp",
  "una película de minecraft": "peliculas/minecraft/PMinecraft.webp",
  // Minecraft Videojuegos
  "minecraft: java & bedrock": "videojuegos/minecraft/VGMinecraftJyB.webp",
  "minecraft: dungeons": "videojuegos/minecraft/VGMinecraftDungeons.webp",
  // Minecraft Accesorios.
  "lámpara abeja minecraft": "accesorios/minecraft/ACCMinecraft1.webp",
  "audífonos gamer minecraft - edición mojang": "accesorios/minecraft/ACCMinecraft2.webp",
  "preservativo minecraft": "accesorios/minecraft/ACCMinecraft3.webp",
};

// Formatea un número como pesos chilenos.
const clp = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

// ====== Storage / Carrito ======
const STORAGE = { CART: "carrito", TOTAL: "totalCompra" };

// Hook que encapsula toda la lógica del carrito en el frontend.
function useCarrito() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.CART)) || [];
    } catch {
      return [];
    }
  });

  const total = useMemo(
    () =>
      items.reduce(
        (acc, it) =>
          acc + (Number(it.precio) || 0) * (Number(it.cantidad) || 1),
        0
      ),
    [items]
  );

  const unidades = useMemo(
    () => items.reduce((acc, it) => acc + (Number(it.cantidad) || 1), 0),
    [items]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE.CART, JSON.stringify(items));
    localStorage.setItem(STORAGE.TOTAL, String(total));
  }, [items, total]);

  const add = (idProducto, nombre, precio) =>
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.idProducto === idProducto);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          cantidad: (Number(next[idx].cantidad) || 1) + 1,
        };
        return next;
      }
      return [
        ...prev,
        { idProducto, nombre, precio: Number(precio), cantidad: 1 },
      ];
    });

  const inc = (i) =>
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i
          ? { ...it, cantidad: (Number(it.cantidad) || 1) + 1 }
          : it
      )
    );

  const dec = (i) =>
    setItems((prev) => {
      const next = [...prev];
      const q = (Number(next[i].cantidad) || 1) - 1;
      if (q <= 0) next.splice(i, 1);
      else next[i] = { ...next[i], cantidad: q };
      return next;
    });

  const delItem = (i) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  return { items, total, unidades, add, inc, dec, delItem };
}

// ====== Carrusel de productos por sección ======
function Carousel({ id, productos, sectionKey, onAdd, navH, targetName }) {
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
  const titleId = {
    peliculas: "peliculas",
    videojuegos: "videojuegos",
    accesorios: "accesorios",
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

  const sectionOffsets = {
    peliculas: -(navH + -33),
    videojuegos: -(navH - 33),
    accesorios: -(navH - 110),
  };

  const jumpTo = (sectionName) => {
    const offset =
      sectionOffsets[sectionName] !== undefined
        ? sectionOffsets[sectionName]
        : -navH;

    scroller.scrollTo(sectionName, {
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

        <div
          className={`nl-cta ${openInfo ? "is-open" : "is-closed"}`}
          ref={ctaRef}
        >
          {!openInfo && current && (
            <>
              <strong className="nl-price">{clp(current.price)}</strong>
              <div className="nl-actions">
                <button
                  className="btn btn-info"
                  onClick={() => setOpenInfo(true)}
                >
                  - Más información -
                </button>
                <button
                  className="btn btn-success nl-add"
                  onClick={() =>
                    onAdd(current.id, current.name, current.price)
                  }
                >
                  - Agregar -
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
                <button
                  className="btn btn-info"
                  onClick={() => setOpenInfo(false)}
                >
                  - Menos información -
                </button>
                <strong className="nl-price" style={{ margin: 0 }}>
                  {clp(current.price)}
                </strong>
                <button
                  className="btn btn-success nl-add"
                  onClick={() =>
                    onAdd(current.id, current.name, current.price)
                  }
                >
                  - Agregar -
                </button>
              </div>

              <div className="nl-info mt-2">
                <div className="card card-body">
                  <strong>{current.desc}</strong>

                  {/* ATRIBUTOS EXTRA DEL PRODUCTO */}
                  <div className="mt-2 nl-extra-attrs">
                    {current.tipo && (
                      <p className="m-0">
                        <strong>Categoría:</strong> {current.tipo}
                      </p>
                    )}
                    {current.clasificacion && (
                      <p className="m-0">
                        <strong>Clasificación:</strong> {current.clasificacion}
                      </p>
                    )}
                    {current.estado && (
                      <p className="m-0">
                        <strong>Estado:</strong> {current.estado}
                      </p>
                    )}
                    {current.saga && (
                      <p className="m-0">
                        <strong>Saga:</strong> {current.saga}
                      </p>
                    )}
                    {current.plataformas?.length > 0 && (
                      <p className="m-0">
                        <strong>Plataformas:</strong>{" "}
                        {current.plataformas.join(" · ")}
                      </p>
                    )}
                    {current.generos?.length > 0 && (
                      <p className="m-0">
                        <strong>Géneros:</strong>{" "}
                        {current.generos.join(" · ")}
                      </p>
                    )}
                    {current.empresas?.length > 0 && (
                      <p className="m-0">
                        <strong>Empresas:</strong>{" "}
                        {current.empresas.join(" · ")}
                      </p>
                    )}
                    {current.desarrolladores?.length > 0 && (
                      <p className="m-0">
                        <strong>Desarrolladores:</strong>{" "}
                        {current.desarrolladores.join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="nl-related mt-2"
                style={{
                  display: "flex",
                  gap: ".75rem",
                  justifyContent: "center",
                }}
              >
                {related.map((key) => (
                  <button
                    key={key}
                    className="btn btn-outline-info nl-link"
                    onClick={() => jumpTo(titleId[key])}
                  >
                    {pretty[key]}
                  </button>
                ))}
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

  const { items, total, unidades, add, inc, dec, delItem } = useCarrito();

  // PAGINACIÓN DEL CARRITO
  const [cartPage, setCartPage] = useState(0);
  const CART_PAGE_SIZE = 5;

  const [cartOpen, setCartOpen] = useState(false);

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

  const totalPages = Math.max(1, Math.ceil(items.length / CART_PAGE_SIZE));
  const paginatedItems = items.slice(
    cartPage * CART_PAGE_SIZE,
    cartPage * CART_PAGE_SIZE + CART_PAGE_SIZE
  );

  // Si elimino productos y la página queda fuera de rango, ajusto
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(items.length / CART_PAGE_SIZE) - 1);
    if (cartPage > maxPage) {
      setCartPage(maxPage);
    }
  }, [items.length, cartPage]);

  const jumpToSection = (name) => {
    scroller.scrollTo(name, {
      smooth: true,
      duration: 600,
      offset: -navH,
    });
  };

  useEffect(() => {
    const calc = () => {
      const nav = document.querySelector(
        "nav.navbar.bg-body-tertiary.fixed-top"
      );
      setNavH(((nav?.offsetHeight) || 120) + 10);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    document.body.classList.add("route-principal");
    return () => document.body.classList.remove("route-principal");
  }, []);

  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);

  // Cargar productos SOLO cuando haya saga seleccionada
  useEffect(() => {
    if (!selectedSaga) {
      setPeliculas([]);
      setVideojuegos([]);
      setAccesorios([]);
      return;
    }

    async function cargarProductosDeSaga() {
      try {
        const data = allProducts.filter((p) => {
          const sagaProd = (p.sagaNombre || p.saga || "")
            .toString()
            .toLowerCase()
            .trim();

          const sagaSel = (selectedSaga || "")
            .toString()
            .toLowerCase()
            .trim();

          return sagaProd.includes(sagaSel);
        });
      
        console.log(
          "Productos recibidos en Principal para saga:",
          selectedSaga,
          data
        );

        if (!Array.isArray(data)) return;

        const mapToSlide = (p) => {
          const key = p.nombre?.toLowerCase() || "";
          const localImage = PRODUCT_IMAGES[key] || "logos/NoLimits.webp";

          return {
            id: p.id,
            name: p.nombre,
            price: p.precio,
            desc: p.descripcion || p.nombre,
            src: img(localImage),
            alt: p.nombre,

            // NUEVOS CAMPOS QUE VIENEN DEL BACK
            tipo: p.tipoProductoNombre || p.tipoProducto || null,
            clasificacion: p.clasificacionNombre || null,
            estado: p.estadoNombre || null,
            saga: p.saga || null,
            plataformas: Array.isArray(p.plataformas) ? p.plataformas : [],
            generos: Array.isArray(p.generos) ? p.generos : [],
            empresas: Array.isArray(p.empresas) ? p.empresas : [],
            desarrolladores: Array.isArray(p.desarrolladores) ? p.desarrolladores : [],
          };
        };

        const getTipo = (p) =>
          (p.tipoProductoNombre || p.tipoProducto || p.tipo || "")
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const peliculasData = data.filter((p) =>
          getTipo(p).includes("pelic")
        );

        // ORDEN PERSONALIZADO PARA VIDEOJUEGOS DE MINECRAFT
        const minecraftOrder = [
          "minecraft: java & bedrock",
          "minecraft: dungeons",
        ];

        let videojuegosData = data
          .filter((p) => getTipo(p).includes("video"))
          .sort((a, b) => {
            const aName = a.nombre.toLowerCase();
            const bName = b.nombre.toLowerCase();

            const aIdx = minecraftOrder.indexOf(aName);
            const bIdx = minecraftOrder.indexOf(bName);

            if (aIdx === -1 && bIdx === -1) return 0;
            if (aIdx === -1) return 1;
            if (bIdx === -1) return -1;

            return aIdx - bIdx;
          });

        // Accesorios
        let accesoriosData = data.filter((p) =>
          getTipo(p).includes("acces")
        );

        // Orden personalizado SOLO para Minecraft
        const minecraftAccOrder = [
          "lámpara abeja minecraft",
          "audífonos gamer minecraft - edición mojang",
          "preservativo minecraft",
        ];

        if ((selectedSaga || "").toLowerCase() === "minecraft") {
          accesoriosData = accesoriosData.sort((a, b) => {
            const aName = a.nombre.toLowerCase();
            const bName = b.nombre.toLowerCase();

            const aIdx = minecraftAccOrder.indexOf(aName);
            const bIdx = minecraftAccOrder.indexOf(bName);

            if (aIdx === -1 && bIdx === -1) return 0;
            if (aIdx === -1) return 1;
            if (bIdx === -1) return -1;

            return aIdx - bIdx;
          });
        }

        setPeliculas(peliculasData.map(mapToSlide));
        setVideojuegos(videojuegosData.map(mapToSlide));
        setAccesorios(accesoriosData.map(mapToSlide));
      } catch (err) {
        console.error("Error cargando productos de saga:", err);
      }
    }

    cargarProductosDeSaga();
  }, [selectedSaga, allProducts]);

  const sagaLabel = selectedSaga || "";

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q) return;

    if (!selectedSaga) {
      alert("Primero selecciona una saga del carrusel.");
      return;
    }

    const secciones = {
      peliculas,
      videojuegos,
      accesorios,
    };

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
                      onClick={() => navigate("/mis-compras")}
                    >
                      Mis compras
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
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

              {/* Carrito */}
              <button
                className="carrito-btn me-2"
                onClick={() => setCartOpen((v) => !v)}
              >
                🛒 <span id="contador">{unidades}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO PRINCIPAL */}
      <header className="page-hero text-center">
        <p className="page-subtitle">
          _.- Variedad, estilo y calidad en un solo lugar -._
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
                  offset: -(navH + -33),
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
              onAdd={add}
              navH={navH}
              targetName={
                searchHit?.section === "peliculas" ? searchHit.name : null
              }
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
              onAdd={add}
              navH={navH}
              targetName={
                searchHit?.section === "videojuegos" ? searchHit.name : null
              }
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
              onAdd={add}
              navH={navH}
              targetName={
                searchHit?.section === "accesorios" ? searchHit.name : null
              }
            />
          </>
        )}
      </main>

      {/* PANEL DEL CARRITO FLOANTE */}
      <div
        className={`fondo-carrito ${cartOpen ? "is-open" : ""}`}
        id="modeloCarrito"
        onClick={(e) => {
          if (e.target.id === "modeloCarrito") setCartOpen(false);
        }}
      >
        <div className="modelo-contenido animar">
          <h2>Tu Carrito</h2>

          <ul id="carrito">
            {paginatedItems.map((it, idx) => {
              const realIndex = cartPage * CART_PAGE_SIZE + idx;
              const subtotal = Number(it.precio) * Number(it.cantidad);

              return (
                <li key={realIndex}>
                  <div className="carrito-item-main">
                    <span className="carrito-item-name">{it.nombre}</span>
                    <div className="carrito-item-meta">
                      <span className="carrito-item-qty">x{it.cantidad}</span>
                      <span className="carrito-item-price">
                        {clp(subtotal)}
                      </span>
                    </div>
                  </div>

                  <div className="carrito-item-actions">
                    <button
                      className="btn-cart-qty btn-cart-qty--minus"
                      onClick={() => dec(realIndex)}
                    >
                      -
                    </button>
                    <button
                      className="btn-cart-qty btn-cart-qty--plus"
                      onClick={() => inc(realIndex)}
                    >
                      +
                    </button>
                    <button
                      className="btn-cart-remove"
                      onClick={() => delItem(realIndex)}
                    >
                      ❌
                    </button>
                  </div>
                </li>
              );
            })}

            {items.length === 0 && (
              <li>
                <span className="text-muted">Tu carrito está vacío.</span>
              </li>
            )}
          </ul>

          {/* Paginación del carrito */}
          {items.length > CART_PAGE_SIZE && (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <button
                type="button"
                className="btn-cart-qty btn-cart-qty--minus"
                disabled={cartPage === 0}
                onClick={() => setCartPage((p) => Math.max(0, p - 1))}
              >
                ◀
              </button>
              <small>
                Página {cartPage + 1} de {totalPages}
              </small>
              <button
                type="button"
                className="btn-cart-qty btn-cart-qty--plus"
                disabled={cartPage >= totalPages - 1}
                onClick={() =>
                  setCartPage((p) => Math.min(totalPages - 1, p + 1))
                }
              >
                ▶
              </button>
            </div>
          )}

          <h3>
            Total: <span id="total">{clp(total)}</span>
          </h3>

          <button className="btn-comprar" onClick={() => navigate("/pago")}>
            - Finalizar compra -
          </button>
          <button className="btn-cerrar" onClick={() => setCartOpen(false)}>
            - Cerrar -
          </button>
        </div>
      </div>

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