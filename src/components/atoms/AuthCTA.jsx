// Se importan herramientas de react-router-dom.
// useLocation permite saber en qué ruta estamos.
// useNavigate permite cambiar de ruta.
import { useLocation, useNavigate } from "react-router-dom";
// Se importa React para poder usar JSX
import React from "react";

/**
 * Componente AuthCTA
 *
 * Este componente muestra un pequeño mensaje y un botón dependiendo
 * de si el usuario está en la página de inicio de sesión o en la de registro.
 *
 * Si la persona está en /login, muestra:
 *   "¿No tienes una cuenta?" y un botón para ir a /registro
 *
 * Si la persona está en /registro, muestra:
 *   "¿Ya tienes una cuenta?" y un botón para ir a /login
 *
 * Si está en cualquier otra ruta, el componente no muestra nada.
 *
 * Además, existe una prop llamada "route" que permite forzar el modo,
 * por ejemplo mostrar el modo "login" aunque no estés en /login.
 */
export default function AuthCTA({ route }) {
  // Se obtiene el pathname, que es la ruta actual del navegador
  const { pathname } = useLocation();

  // Se obtiene la función navigate para cambiar a otra página
  const navigate = useNavigate();

  /**
   * Aquí se decide en qué "modo" estamos:
   * - Si la prop route tiene un valor, se usa ese valor.
   * - Si no, se revisa la ruta actual:
   *     Si pathname es "/login", el modo es "login".
   *     Si pathname es "/registro", el modo es "registro".
   *     En cualquier otro caso, el modo es null.
   *
   * Si el modo queda en null, no se debe mostrar el componente.
   */
  const mode =
    route ??
    (pathname === "/login"
      ? "login"
      : pathname === "/registro"
      ? "registro"
      : null);

  // Si no hay modo definido, no se muestra nada en pantalla.
  if (!mode) return null;

  /**
   * Si el modo es "login":
   * Se muestra el texto que invita a registrarse
   * y el botón que lleva a la ruta /registro.
   */
  if (mode === "login") {
    return (
      <>
        <span className="askRight">¿No tienes una cuenta?</span>
        <button
          className="btn_reg"
          type="button"
          onClick={() => navigate("/registro")}
        >
          - Regístrate -
        </button>
      </>
    );
  }

  /**
   * Si el modo NO es "login", entonces es "registro":
   * Se muestra el texto que invita a iniciar sesión
   * y el botón que lleva a la ruta /login.
   */
  return (
    <>
      <span className="askRight">¿Ya tienes una cuenta?</span>
      <button
        className="btn_in"
        type="button"
        onClick={() => navigate("/login")}
      >
        - Iniciar Sesión -
      </button>
    </>
  );
}
