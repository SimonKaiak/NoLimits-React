// Ruta: src/pages/Login.jsx

/**
 * Página: Login
 * ---------------------------------------------------------------
 * Esta página muestra el formulario donde el usuario ingresa:
 *  - su correo electrónico
 *  - su contraseña
 *
 * Al presionar "Iniciar Sesión", se valida la información
 * y luego se llama al backend para autenticar al usuario.
 *
 * Si el usuario existe y los datos son correctos, el backend
 * crea una sesión y el frontend guarda algunos datos básicos
 * en localStorage (para mostrar información en la interfaz).
 *
 * Después:
 *   - si el usuario tiene rol ADMIN, lo enviamos al panel /admin
 *   - si no es admin, se envía al catálogo /principal
 */

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/login.module.css";
import avatarImg from "../assets/img/fondos/ticket.webp";

// Servicio que llama al backend para iniciar sesión
import { login } from "../services/usuarios";

export default function Login() {
  const navigate = useNavigate();

  // Campos del formulario
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Mensajes de error
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");

  // Estado para evitar doble envío
  const [submitting, setSubmitting] = useState(false);

  /**
   * Al entrar a esta ruta agregamos una clase al tag <html>
   * para poder aplicar estilos específicos del login.
   * Al salir la removemos.
   */
  useEffect(() => {
    document.documentElement.classList.add("route-login");
    return () => document.documentElement.classList.remove("route-login");
  }, []);

  /**
   * Expresión regular para validar un formato de email.
   */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  /**
   * Validación básica del formulario:
   *  - el email debe tener un formato válido
   *  - la contraseña debe tener al menos 6 caracteres
   */
  const validar = () => {
    let ok = true;

    if (!EMAIL_RE.test(email)) {
      setEmailErr("* Email inválido");
      ok = false;
    } else {
      setEmailErr("");
    }

    if (pass.trim().length < 6) {
      setPassErr("* Mínimo 6 caracteres");
      ok = false;
    } else {
      setPassErr("");
    }

    return ok;
  };

  /**
   * Maneja el envío del formulario.
   * Primero valida.
   * Luego llama al backend.
   * Si el backend responde con éxito, se guarda la información
   * y se redirige al panel correcto según el rol.
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setSubmitting(true);
    setPassErr("");

    try {
      // Llamada al backend, que crea la sesión
      const data = await login(email, pass);

      if (!data) {
        setPassErr("* Error al procesar respuesta del servidor.");
        return;
      }

      /**
       * Aquí guardamos lo mínimo en localStorage.
       * Esto NO es seguridad, solo sirve para que el frontend
       * pueda mostrar información del usuario actual.
       */
      localStorage.setItem("nl_auth", "1");
      localStorage.setItem("nl_user", JSON.stringify(data));
      localStorage.setItem("nl_role", data.rolNombre || data.rol || "");

      /**
       * Se determina si el usuario es administrador.
       * Esto puede usarse de tres formas:
       *  - rolNombre (versión nueva)
       *  - rol (por compatibilidad)
       *  - rolId (si el backend solo envía ID)
       */
      const esAdmin =
        data.rolNombre === "ADMIN" ||
        data.rol === "ADMIN" ||
        data.rolId === 2;

      // Redirige según el perfil
      if (esAdmin) {
        navigate("/admin");
      } else {
        navigate("/principal");
      }

    } catch (error) {
      // Error del backend: credenciales incorrectas
      setPassErr("* Correo o contraseña incorrectos.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.section} aria-labelledby="login-title">

        {/* Imagen decorativa superior */}
        <header className={styles.header}>
          <div className={styles.imageContainer}>
            <div className={styles.image}>
              <img src={avatarImg} alt="avatar" className={styles.avatar} />
            </div>
          </div>
        </header>

        {/* Formulario de inicio de sesión */}
        <form className={styles.form} onSubmit={onSubmit} noValidate>

          {/* Campo email */}
          <div className={styles.field}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailErr("");
              }}
              aria-describedby="emailError"
              className={styles.input}
              autoComplete="email"
              required
            />
            {emailErr && (
              <small id="emailError" className={styles.error}>
                {emailErr}
              </small>
            )}
          </div>

          {/* Campo contraseña */}
          <div className={styles.field}>
            <input
              type="password"
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setPassErr("");
              }}
              aria-describedby="passError"
              className={styles.input}
              autoComplete="current-password"
              required
            />
            {passErr && (
              <small id="passError" className={styles.error}>
                {passErr}
              </small>
            )}
          </div>

          {/* Enlace a recuperar contraseña */}
          <Link to="/olvide-contrasenia" className={styles.forgot}>
            - Olvidé mi contraseña -
          </Link>

          {/* Botón de envío */}
          <button type="submit" className={styles.btn} disabled={submitting}>
            {submitting ? "Ingresando..." : "- Iniciar Sesión -"}
          </button>
        </form>
      </section>
    </main>
  );
}
