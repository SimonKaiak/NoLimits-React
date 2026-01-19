// Ruta: src/App.jsx
// Componente principal que define el ruteo, el layout general y el control
// de autenticación y autorización para secciones públicas, de usuario y de administrador.

import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Layouts globales
import NavbarNL from "./components/organisms/Navbar.jsx";
import FooterNL from "./components/organisms/Footer.jsx";

// Público
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.jsx";
import PaymentMethod from "./pages/PaymentMethod.jsx";
import { Comprobante } from "./pages/Comprobante.jsx";

// Usuario normal
import Principal from "./pages/Principal.jsx";
import PerfilUsuario from "./pages/PerfilUsuario.jsx";
import EditarPerfil from "./pages/EditarPerfil.jsx";
import MisCompras from "./pages/MisCompras.jsx";

// Administrador – Dashboard
import AdminHome from "./pages/admin/AdminHome.jsx";

// Administrador – Productos
import AdminProductList from "./pages/admin/AdminProductList.jsx";

// Administrador – Catálogos
import AdminTipoProductoList from "./pages/admin/AdminTipoProductoList.jsx";
import AdminClasificacionList from "./pages/admin/AdminClasificacionList.jsx";
import AdminEstadoList from "./pages/admin/AdminEstadoList.jsx";
import AdminGeneroList from "./pages/admin/AdminGeneroList.jsx";
import AdminPlataformaList from "./pages/admin/AdminPlataformaList.jsx";
import AdminEmpresaList from "./pages/admin/AdminEmpresaList.jsx";
import AdminDesarrolladorList from "./pages/admin/AdminDesarrolladorList.jsx";
import AdminCatalogos from "./pages/admin/AdminCatalogos.jsx";
import AdminTipoEmpresaList from "./pages/admin/AdminTipoEmpresaList.jsx";
import AdminTipoDesarrolladorList from "./pages/admin/AdminTipoDesarrolladorList.jsx";
import AdminUbicacion from "./pages/admin/AdminUbicacion.jsx";

// Administrador – Métodos
import AdminMetodoPago from "./pages/admin/AdminMetodoPago.jsx";
import AdminMetodoEnvioList from "./pages/admin/AdminMetodoEnvioList.jsx";

// Administrador – Ventas
import AdminVentasList from "./pages/admin/AdminVentasList.jsx";
import AdminVentaDetalle from "./pages/admin/AdminVentasList.jsx";
import AdminUsuarioList from "./pages/admin/AdminUsuarioList.jsx";

export default function App() {
  const { pathname } = useLocation();

  /**
   * Control de clases CSS dinámicas según la ruta.
   * Esto permite aplicar estilos globales específicos para distintas secciones,
   * como login, admin o pantallas principales.
   */
  useEffect(() => {
    const root = document.documentElement;

    // Limpia clases previas
    root.classList.remove(
      "route-home",
      "route-login",
      "route-register",
      "route-principal",
      "route-admin"
    );

    // Agrega clase correspondiente a la ruta actual
    if (pathname === "/login") root.classList.add("route-login");
    else if (pathname === "/registro") root.classList.add("route-register");
    else if (pathname === "/principal") root.classList.add("route-principal");
    else if (pathname.startsWith("/admin")) root.classList.add("route-admin");
    else root.classList.add("route-home");

    // Asegura que cada cambio de ruta inicie arriba de la página
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);


  /**
   * Sistema de autenticación basado en localStorage.
   * nl_auth = "1" indica sesión activa.
   */
  const isLogged =
    typeof window !== "undefined" &&
    localStorage.getItem("nl_auth") === "1";

  /**
   * Rol del usuario según localStorage.
   * nl_role = "ADMIN" da acceso a rutas protegidas de administración.
   */
  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("nl_role")
      : null;

  // Normalizamos el rol para evitar fallos por "ROLE_ADMIN", minúsculas o espacios
  const roleNormalized = (role || "").toUpperCase().trim();

  const isAdmin =
    isLogged && (roleNormalized === "ADMIN" || roleNormalized === "ROLE_ADMIN");

  /**
   * Control para ocultar Navbar y Footer en rutas específicas
   * como pantallas internas o de autenticación.
   */
  const ocultarLayout =
    pathname === "/principal" ||
    pathname === "/olvide-contrasenia";

  return (
    <>
      {/* Navbar solo si la ruta lo permite */}
      {!ocultarLayout && <NavbarNL />}

      <main className="main-container">
        <Routes>

          {/* Sección Pública */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/olvide-contrasenia" element={<ForgotPasswordPage />} />
          <Route path="/pago" element={<PaymentMethod />} />
          <Route path="/comprobante" element={<Comprobante />} />

          {/* Usuario normal */}
          <Route
            path="/principal"
            element={isLogged ? <Principal /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/perfil"
            element={isLogged ? <PerfilUsuario /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/perfil/editar"
            element={isLogged ? <EditarPerfil /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/mis-compras"
            element={isLogged ? <MisCompras /> : <Navigate to="/login" replace />}
          />

          {/* Administrador – Home */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminHome /> : <Navigate to="/login" replace />}
          />

          {/* Administrador – Usuarios */}
          <Route
            path="/admin/usuarios"
            element={isAdmin ? <AdminUsuarioList /> : <Navigate to="/login" replace />}
          />

          {/* Administrador – Productos */}
          <Route
            path="/admin/productos"
            element={isAdmin ? <AdminProductList /> : <Navigate to="/login" replace />}
          />

          {/* Administrador – Catálogos principales */}
          <Route
            path="/admin/catalogos"
            element={isAdmin ? <AdminCatalogos /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/tipos-producto"
            element={isAdmin ? <AdminTipoProductoList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/clasificaciones"
            element={isAdmin ? <AdminClasificacionList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/estados"
            element={isAdmin ? <AdminEstadoList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/generos"
            element={isAdmin ? <AdminGeneroList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/plataformas"
            element={isAdmin ? <AdminPlataformaList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/empresas"
            element={isAdmin ? <AdminEmpresaList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/desarrolladores"
            element={isAdmin ? <AdminDesarrolladorList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/tipos-empresa"
            element={isAdmin ? <AdminTipoEmpresaList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/tipos-desarrollador"
            element={isAdmin ? <AdminTipoDesarrolladorList /> : <Navigate to="/login" replace />}
          />

          {/* Administrador – Métodos */}
          <Route
            path="/admin/metodos-pago"
            element={isAdmin ? <AdminMetodoPago /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/metodos-envio"
            element={isAdmin ? <AdminMetodoEnvioList /> : <Navigate to="/login" replace />}
          />

          {/* Administrador – Ventas */}
          <Route
            path="/admin/ventas"
            element={isAdmin ? <AdminVentasList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/ventas/:id"
            element={isAdmin ? <AdminVentaDetalle /> : <Navigate to="/login" replace />}
          />

          {/* Administrador – Ubicación */}
          <Route path="/admin/ubicacion"
           element={isAdmin ? <AdminUbicacion /> : <Navigate to="/login" replace />} />

        </Routes>
      </main>

      {/* Footer solo si corresponde */}
      {!ocultarLayout && <FooterNL />}
    </>
  );
}