import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Componente NavbarNL
 *
 * Barra de navegación principal de la aplicación.
 * Contiene lógica para:
 *  - Mostrar u ocultar botones según la ruta actual
 *  - Detectar si el usuario está en login o registro
 *  - Detectar si está en rutas del administrador
 *  - Mostrar un botón "Volver"
 *  - Mostrar botones de autenticación o catálogo
 *
 * Este componente depende de la ruta actual (useLocation)
 * y de la navegación interna (useNavigate).
 */
export default function NavbarNL() {

  const navigate = useNavigate();
  const location = useLocation();

  
  /* DETECCIÓN DE RUTAS DE AUTENTICACIÓN                    */
  

  const isLogin = location.pathname === "/login";
  const isRegistro = location.pathname === "/registro";

  /**
   * isAuthRoute:
   * Indica si estamos en una pantalla de login o registro.
   * En estas vistas la barra usa un diseño distinto.
   */
  const isAuthRoute = isLogin || isRegistro;

  
  /* DETECCIÓN DE RUTAS ADMIN                               */
  

  /** isAdminRoute:
   * Si la ruta comienza con "/admin", entonces estamos en el panel admin.
   */
  const isAdminRoute = location.pathname.startsWith("/admin");

  /**
   * isAdminHome:
   * Ruta principal del admin: "/admin"
   * Esta ruta NO debe mostrar botón "Volver".
   */
  const isAdminHome = location.pathname === "/admin";

  /** adminUsesBack:
   * Cualquier ruta admin que NO sea "/admin" debe mostrar "Volver".
   */
  const adminUsesBack = isAdminRoute && !isAdminHome;

  
  /* RUTAS QUE DEBEN MOSTRAR BOTÓN "Volver"                  */
 

  const hasBackButton =
    location.pathname === "/olvide-contrasenia" ||
    location.pathname === "/pago" ||
    location.pathname === "/perfil" ||
    location.pathname === "/perfil/editar" ||
    location.pathname === "/mis-compras" ||
    adminUsesBack;

  
  /* RUTAS QUE OCULTAN BOTONES A LA DERECHA                 */
  

  const hideRightSide =
    hasBackButton ||
    location.pathname === "/comprobante" ||
    isAdminRoute;

  
  /* ESTADO DE SESIÓN                                        */
  

  /**
   * isLogged:
   * Comprueba si localStorage indica que el usuario inició sesión.
   * nl_auth = "1" significa sesión activa.
   */
  const isLogged =
    typeof window !== "undefined" &&
    localStorage.getItem("nl_auth") === "1";

  
  /* RENDER DEL NAVBAR                                      */
 

  return (
    <nav className={`nl-nav ${isAuthRoute ? "nl-auth-mode" : ""}`}>
      <div className="nl-nav-inner">

        
        {/* IZQUIERDA DEL NAV                                   */}
        
        <div className="nl-left">

          {/* Botón: Manual de usuario (solo en la ruta "/") */}
          {location.pathname === "/" && (
            <a
              href="/manual/ManualUsuario_NoLimits.pdf"
              download
              className="btn_manual"
            >
              - Manual de Usuario -
            </a>
          )}

          {/* Botón Salir (solo en login/registro) */}
          {isAuthRoute && (
            <button
              className="btnSalirNav"
              onClick={() => navigate("/")}
            >
              - Salir al Lobby -
            </button>
          )}

          {/* Botón Volver (en rutas que lo requieran) */}
          {hasBackButton && (
            <button
              className="btn_salir"
              onClick={() => navigate(-1)}
            >
              - Volver -
            </button>
          )}
        </div>


        
        {/* CENTRO DEL NAV: BRAND                              */}
       
        <h1 id="brand">°-._ NoLimits _.-°</h1>


        
        {/* DERECHA DEL NAV                                     */}
        
        <div className="nl-right">

          {/* Vista Login → mostrar botón para ir a Registro */}
          {isLogin && (
            <>
              <span className="askRight">¿No tienes una cuenta?</span>
              <button
                className="btn_reg"
                onClick={() => navigate("/registro")}
              >
                - Regístrate -
              </button>
            </>
          )}

          {/* Vista Registro → mostrar botón para ir a Login */}
          {isRegistro && (
            <>
              <span className="askRight">¿Ya tienes una cuenta?</span>
              <button
                className="btn_in"
                onClick={() => navigate("/login")}
              >
                - Iniciar Sesión -
              </button>
            </>
          )}

          {/* Vistas normales (Home y otras), pero NO auth y NO admin */}
          {!isAuthRoute && !hideRightSide && (
            <>
              {/* Si está logueado mostrar Catálogo (excepto en "/") */}
              {isLogged && location.pathname !== "/" && (
                <button
                  className="btn_in"
                  onClick={() => navigate("/principal")}
                >
                  - Catálogo -
                </button>
              )}

              {/* Botones de login y registro */}
              <button
                className="btn_in"
                onClick={() => navigate("/login")}
              >
                - Iniciar Sesión -
              </button>

              <button
                className="btn_reg"
                onClick={() => navigate("/registro")}
              >
                - Registrarse -
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
