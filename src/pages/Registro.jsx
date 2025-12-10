// Ruta: src/pages/Registro.jsx

/**
 * Página de registro de nuevos usuarios.
 *
 * Este archivo contiene:
 * - Un formulario para registrar usuarios.
 * - Validaciones de nombre, apellidos, correo, teléfono y contraseñas.
 * - Manejo de errores individuales por campo.
 * - Envío de los datos al servicio registrarUsuario() del backend.
 * - Redirección al login al completar el registro.
 */

import React, { useState, useEffect } from "react";
import styles from "../styles/registro.module.css";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/usuarios";

export default function Registro() {
  const navigate = useNavigate();

  /**
   * Efecto que agrega una clase al html cuando la página se monta.
   * Esto permite cambiar estilos globales solo para esta ruta.
   *
   * Al desmontar la página, la clase se elimina.
   */
  useEffect(() => {
    document.documentElement.classList.add("route-register");
    return () => document.documentElement.classList.remove("route-register");
  }, []);

  /**
   * Estado del formulario. Contiene todos los campos editables.
   */
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    contrasena: "",
    contrasena2: "",
  });

  /**
   * Estado para guardar errores de validación.
   *
   * Cada campo puede tener un mensaje independiente.
   * También existe un error general para errores enviados desde el backend.
   */
  const [errores, setErrores] = useState({});

  /**
   * Función que valida si un correo electrónico tiene un formato correcto.
   */
  const esEmailValido = (c) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);

  /**
   * Función que valida si un teléfono corresponde a formatos habituales chilenos.
   *
   * Quita todos los símbolos y letras y revisa la cantidad de dígitos.
   */
  const esTelefonoCLValido = (t) => {
    const soloDigitos = t.replace(/\D/g, "");
    return (
      soloDigitos.length === 9 ||
      soloDigitos.length === 11 ||
      soloDigitos.length === 12
    );
  };

  /**
   * Utilidad para asignar un error a un campo específico.
   */
  const setError = (k, m) => setErrores((p) => ({ ...p, [k]: m }));

  /**
   * Maneja los cambios de cada input del formulario.
   * - Actualiza el valor del campo.
   * - Limpia errores previos del mismo campo.
   * - Limpia el error general.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((p) => ({ ...p, [name]: value }));
    setError(name, "");
    setError("general", "");
  };

  /**
   * Maneja el envío del formulario.
   *
   * Pasos:
   * 1. Previene recarga de página.
   * 2. Ejecuta validaciones de todos los campos.
   * 3. Si algo está mal, muestra los errores y detiene el proceso.
   * 4. Si todo está correcto, llama al servicio registrarUsuario().
   * 5. Redirige al login si el registro fue exitoso.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let valido = true;
    const err = {};

    const { nombre, apellidos, correo, telefono, contrasena, contrasena2 } =
      formData;

    // Validar nombre
    if (!nombre) {
      err.nombre = "* El nombre es obligatorio.";
      valido = false;
    }

    // Validar apellidos
    if (!apellidos) {
      err.apellidos = "* Los apellidos son obligatorios.";
      valido = false;
    }

    // Validar correo electrónico
    if (!correo) {
      err.correo = "* El correo es obligatorio.";
      valido = false;
    } else if (!esEmailValido(correo)) {
      err.correo = "* Ingresa un correo válido.";
      valido = false;
    }

    // Validar teléfono
    if (!telefono) {
      err.telefono = "* El teléfono es obligatorio.";
      valido = false;
    } else if (!esTelefonoCLValido(telefono)) {
      err.telefono = "* Formato válido: +56 9 1234 5678.";
      valido = false;
    }

    // Validar contraseña
    if (!contrasena) {
      err.contrasena = "* La contraseña es obligatoria.";
      valido = false;
    } else if (contrasena.length < 8) {
      err.contrasena = "* Mínimo 8 caracteres.";
      valido = false;
    } else if (contrasena.length > 10) {
      err.contrasena = "* Máximo 10 caracteres.";
      valido = false;
    }

    // Validar repetición de contraseña
    if (!contrasena2) {
      err.contrasena2 = "* Repite la contraseña.";
      valido = false;
    } else if (contrasena !== contrasena2) {
      err.contrasena2 = "* Las contraseñas no coinciden.";
      valido = false;
    }

    // Si hay errores, se muestran y se detiene la ejecución.
    if (!valido) {
      setErrores(err);
      return;
    }

    // Si todos los campos están correctos, enviamos los datos al backend.
    try {
      await registrarUsuario(formData);

      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      console.error(error);

      // Error enviado desde backend (correo ya registrado, etc).
      setErrores((prev) => ({
        ...prev,
        general: error.message || "Error al registrar usuario",
      }));
    }
  };

  // ==========================================================
  // Render principal de la página
  // ==========================================================
  return (
    <>
      {/* Fondo decorativo */}
      <div className={styles.bg} aria-hidden />

      {/* Contenido principal */}
      <main className={styles.page}>
        <form
          className={`${styles.card} ${styles.formGrid}`}
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Título */}
          <h2 className={`${styles.title} ${styles.span2}`}>
            Ingresa tus datos
          </h2>

          {/* Inputs simples: nombre, apellidos, correo, teléfono */}
          {[
            { label: "Nombre", name: "nombre", type: "text" },
            { label: "Apellidos", name: "apellidos", type: "text" },
            { label: "Correo", name: "correo", type: "email" },
            { label: "Teléfono", name: "telefono", type: "tel" },
          ].map(({ label, name, type }) => (
            <div className={styles.field} key={name}>
              <label className={styles.label}>{label}</label>

              <input
                className={styles.input}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />

              {/* Mensaje de error individual */}
              {errores[name] && (
                <small className={styles.error}>{errores[name]}</small>
              )}
            </div>
          ))}

          {/* Contraseña */}
          <div className={`${styles.field} ${styles.span2}`}>
            <label className={styles.label}>Contraseña</label>

            <input
              className={styles.input}
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              minLength={8}
              maxLength={10}
            />

            {errores.contrasena && (
              <small className={styles.error}>{errores.contrasena}</small>
            )}
          </div>

          {/* Repetir Contraseña */}
          <div className={`${styles.field} ${styles.span2}`}>
            <label className={styles.label}>Repetir Contraseña</label>

            <input
              className={styles.input}
              type="password"
              name="contrasena2"
              value={formData.contrasena2}
              onChange={handleChange}
            />

            {errores.contrasena2 && (
              <small className={styles.error}>{errores.contrasena2}</small>
            )}
          </div>

          {/* Error general (backend) */}
          {errores.general && (
            <p className={`${styles.error} ${styles.span2}`}>
              {errores.general}
            </p>
          )}

          {/* Botón principal */}
          <div className={`${styles.actions} ${styles.span2}`}>
            <button type="submit" className={styles.primary}>
              <strong>- Registrarse -</strong>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
