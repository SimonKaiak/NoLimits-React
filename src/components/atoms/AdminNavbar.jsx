// Se importa React para poder usar componentes
import React from "react";
// Se importa useState para manejar estados dentro del componente
import { useState } from "react";
// Se importa useNavigate para cambiar la ruta en la aplicación
import { useNavigate } from "react-router-dom";
import "../../styles/adminCatalogos.css";

export default function AdminNavbar() {
  // Se obtiene la función navigate, que permite movernos entre páginas
  const navigate = useNavigate();

  // menuOpen indica si el menú lateral está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false);

  // openCatalogos indica si el submenú "Catálogos" está desplegado o no
  const [openCatalogos, setOpenCatalogos] = useState(false);

  // Función para navegar a otra ruta
  // También cierra el menú y el submenú para mantener todo ordenado
  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
    setOpenCatalogos(false);
  };

  return (
    <>
      {/* Barra superior */}
      <nav className="nl-nav">
        <div className="nl-nav-inner">

          {/* Parte izquierda: botón hamburguesa que abre el menú lateral */}
          <div className="nl-left">
            <button
              className="btn_in"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
          </div>

          {/* Título de la marca en el centro */}
          <h1 id="brand">°-._ NoLimits _.-°</h1>

          {/* Parte derecha vacía (solo mantiene estructura simétrica) */}
          <div className="nl-right"></div>
        </div>
      </nav>

      {/* Menú lateral visible solo cuando menuOpen es true */}
      {menuOpen && (
        <div className="admin-sidebar">

          {/* Cabecera del menú lateral con botón para cerrarlo */}
          <div className="admin-sidebar-header">
            <button onClick={() => setMenuOpen(false)}>✖</button>
          </div>

          {/* Botón para ir a la sección Productos */}
          <button onClick={() => go("/admin/productos")}>- Productos -</button>

          {/* Botón + submenú "Catálogos" envueltos para poder posicionar el dropdown */}
          <div className="menu-item-with-sub">
            <button onClick={() => setOpenCatalogos(!openCatalogos)}>
              {openCatalogos ? "▷ Catálogos -" : "▼ Catálogos -"}
            </button>

            {openCatalogos && (
              <div className="submenu-catalogos">
                <button onClick={() => go("/admin/tipos-producto")}>Tipos de Producto</button>
                <button onClick={() => go("/admin/clasificaciones")}>Clasificaciones</button>
                <button onClick={() => go("/admin/estados")}>Estados</button>
                <button onClick={() => go("/admin/generos")}>Géneros</button>
                <button onClick={() => go("/admin/plataformas")}>Plataformas</button>
                <button onClick={() => go("/admin/empresas")}>Empresas</button>

                <button onClick={() => go("/admin/tipos-empresa")}>Tipos de Empresa</button>
                <button onClick={() => go("/admin/desarrolladores")}>Desarrolladores</button>
                <button onClick={() => go("/admin/tipos-desarrollador")}>Tipos de Desarrollador</button>

                <button onClick={() => go("/admin/metodos-pago")}>Métodos de Pago</button>
                <button onClick={() => go("/admin/metodos-envio")}>Métodos de Envío</button>
              </div>
            )}
          </div>

          {/* Más botones del menú lateral */}
          <button onClick={() => go("/admin/usuarios")}>- Usuarios -</button>
          <button onClick={() => go("/admin/ventas")}>- Ventas -</button>
          <button onClick={() => go("/admin/ubicacion")}>Ubicación</button>

          {/* Botón para salir del panel de administración */}
          <button
            style={{
              marginTop: "20px",
              borderColor: "#ff25d0",
              color: "#ff25d0"
            }}
            onClick={() => go("/")}
          >
            - Salir del Admin -
          </button>

        </div>
      )}
    </>
  );
}