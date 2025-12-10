// Se importa React y useState para manejar estados dentro del componente
import React, { useState } from "react";

// Se importan componentes reutilizables del proyecto
import { InputEmail } from "../atoms/InputEmail";
import { ErrorMsg } from "../atoms/ErrorMsg";
import { ButtonSubmit } from "../atoms/ButtonSubmit";

// useNavigate permite redirigir a otras páginas
import { useNavigate } from "react-router-dom";

// Función del backend que valida si un correo existe en la base de datos
import { verificarCorreoRegistrado } from "../../services/usuarios";

/**
 * Componente ForgotPasswordForm
 *
 * Este componente muestra un formulario donde el usuario ingresa su correo electrónico.
 * El sistema valida el formato y consulta al backend para verificar si el correo pertenece
 * a una cuenta registrada.
 *
 * Si todo es correcto, se simula el envío de un enlace de recuperación y se redirige al login.
 */
export const ForgotPasswordForm = () => {
  // Permite redirigir al usuario a otra página
  const navigate = useNavigate();

  // Valor actual del correo electrónico ingresado
  const [email, setEmail] = useState("");

  // Mensaje de error asociado a validaciones
  const [errorMsg, setErrorMsg] = useState("");

  // Controla si el sistema está validando el correo (animación, deshabilitar botón, etc.)
  const [loading, setLoading] = useState(false);

  /**
   * handleSubmit
   *
   * Se ejecuta cuando el usuario envía el formulario.
   * Realiza tres validaciones:
   *  1. El correo no puede estar vacío.
   *  2. El formato debe ser válido.
   *  3. El correo debe existir en la base de datos (validación en backend).
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Expresión regular sencilla para validar formato de correo
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Validación: campo vacío
    if (!email) {
      setErrorMsg("Ingrese un correo electrónico.");
      return;
    }

    // Validación: formato incorrecto
    if (!isEmail) {
      setErrorMsg("Formato de correo inválido.");
      return;
    }

    // Todo correcto hasta ahora
    setErrorMsg("");
    setLoading(true);

    try {
      // Validación con backend: verifica si el correo existe
      await verificarCorreoRegistrado(email);

      // Simula el envío de un correo real
      alert(`Enviamos un enlace de recuperación a: ${email}`);

      // Redirección después de unos segundos
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      // Si el backend responde "NOT_FOUND"
      if (err.message === "NOT_FOUND") {
        setErrorMsg("El correo no está asociado a ninguna cuenta registrada.");
      } else {
        setErrorMsg("Ocurrió un error al validar el correo. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false); // Siempre se ejecuta, incluso si hubo error
    }
  };

  /**
   * handleChange
   *
   * Se ejecuta cuando el usuario escribe en el input.
   * Actualiza el correo y elimina cualquier mensaje de error previo.
   */
  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errorMsg) setErrorMsg(""); // Limpia el error mientras el usuario escribe
  };

  /**
   * Render del formulario
   *
   * Incluye:
   * - Texto explicativo
   * - Campo para ingresar el correo
   * - Mensaje de error si existe
   * - Botón para confirmar
   */
  return (
    <form id="formOlvide" onSubmit={handleSubmit} noValidate>
      {/* Texto que explica el proceso al usuario */}
      <strong>
        Ingresa tu correo electrónico y te enviaremos las instrucciones para una nueva contraseña. <br />
        Una vez hecho, se te dirigirá a la página principal.
      </strong>

      <footer>
        {/* Campo de correo + mensaje de error */}
        <div className="field">
          <InputEmail
            value={email}
            onChange={handleChange}
            hasError={!!errorMsg} // true si existe error
          />
          <ErrorMsg message={errorMsg} />
        </div>

        {/* Botón de envío: cambia su texto si está cargando */}
        <ButtonSubmit
          text={loading ? "Verificando..." : "Continuar"}
          className="nl-forgot-btn"
          disabled={loading}
        />
      </footer>
    </form>
  );
};
