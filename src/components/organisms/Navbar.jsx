import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Componente NavbarNL
 * Barra de navegación principal de la aplicación.
 */
export default function NavbarNL() {
  const navigate = useNavigate();
  const location = useLocation();

  // AUTH
  const isLogin = location.pathname === "/login";
  const isRegistro = location.pathname === "/registro";
  const isAuthRoute = isLogin || isRegistro;

  // ADMIN
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminHome = location.pathname === "/admin";
  const adminUsesBack = isAdminRoute && !isAdminHome;

  // BOTÓN VOLVER
  const hasBackButton =
    location.pathname === "/olvide-contrasenia" ||
    location.pathname === "/pago" ||
    location.pathname === "/perfil" ||
    location.pathname === "/perfil/editar" ||
    location.pathname === "/mis-compras" ||
    adminUsesBack;

  // OCULTAR DERECHA
  const hideRightSide =
    hasBackButton ||
    location.pathname === "/comprobante" ||
    isAdminRoute;

  // SESIÓN
  const isLogged =
    typeof window !== "undefined" &&
    localStorage.getItem("nl_auth") === "1";

  const publicPages = ["/", "/soporte"];
  const isPublicPage = publicPages.includes(location.pathname);

  return (
    <nav className={`nl-nav ${isAuthRoute ? "nl-auth-mode" : ""}`}>
      <div className="nl-nav-inner">
        {/* IZQUIERDA */}
        <div className="nl-left">
          {isAuthRoute && (
            <button className="btnSalirNav" onClick={() => navigate("/")}>
              - Salir al Lobby -
            </button>
          )}

          {hasBackButton && (
            <button className="btn_salir" onClick={() => navigate(-1)}>
              - Volver -
            </button>
          )}
        </div>

        {/* CENTRO */}
        <h1 id="brand">°-._ NoLimits _.-°</h1>

        {/* DERECHA */}
        <div className={`nl-right ${hideRightSide ? "is-hidden" : ""}`}>
          {/* Login -> Registro */}
          {isLogin && (
            <>
              <span className="askRight">¿No tienes una cuenta?</span>
              <button className="btn_reg" onClick={() => navigate("/registro")}>
                - Regístrate -
              </button>
            </>
          )}

          {/* Registro -> Login */}
          {isRegistro && (
            <>
              <span className="askRight">¿Ya tienes una cuenta?</span>
              <button className="btn_in" onClick={() => navigate("/login")}>
                - Iniciar Sesión -
              </button>
            </>
          )}

          {/* Normal */}
          {!isAuthRoute && !hideRightSide && (
            <>
              {isPublicPage ? (
                <>
                  <button className="btn_in" onClick={() => navigate("/login")}>
                    - Iniciar Sesión -
                  </button>
                  <button className="btn_reg" onClick={() => navigate("/registro")}>
                    - Registrarse -
                  </button>
                </>
              ) : isLogged ? (
                <>
                  {location.pathname !== "/principal" && (
                    <button className="btn_in" onClick={() => navigate("/principal")}>
                      - Catálogo -
                    </button>
                  )}

                  <button className="btn_in" onClick={() => navigate("/perfil")}>
                    - Perfil -
                  </button>

                  <button
                    className="btn_salir"
                    onClick={() => {
                      localStorage.removeItem("nl_auth");
                      localStorage.removeItem("token");
                      localStorage.removeItem("usuario");
                      navigate("/");
                    }}
                  >
                    - Cerrar sesión -
                  </button>
                </>
              ) : (
                <>
                  <button className="btn_in" onClick={() => navigate("/login")}>
                    - Iniciar Sesión -
                  </button>
                  <button className="btn_reg" onClick={() => navigate("/registro")}>
                    - Registrarse -
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}