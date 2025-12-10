// Ruta: src/pages/Home.jsx

/**
 * Página: Home
 * ---------------------------------------------------------
 * Esta es la página principal pública del sitio.
 *
 * Lo único que muestra es el componente HomeCarousel,
 * que contiene el carrusel con las secciones informativas:
 *   - Quiénes somos
 *   - Sucursales
 *   - Soporte
 *
 * Esta página no tiene más estructura porque todo el
 * contenido visual está dentro del componente HomeCarousel.
 */

import HomeCarousel from "../components/organisms/HomeCarousel.jsx";

export default function Home() {
    // Renderiza el carrusel tal cual
    return <HomeCarousel />;
}
