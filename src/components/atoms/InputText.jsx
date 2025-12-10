// Se importa React para poder usar JSX y componentes
import React from "react";

/**
 * Componente InputText
 *
 * Este componente representa un campo de texto genérico.
 * Se puede utilizar para nombres, apellidos, direcciones,
 * o cualquier valor que se ingrese como texto.
 *
 * Parámetros (props):
 *  - label: texto que aparece encima del input.
 *  - name: nombre e identificador del input (id y name del HTML).
 *  - value: valor actual del campo, controlado desde el componente padre.
 *  - onChange: función que se ejecuta cada vez que el usuario escribe.
 *  - placeholder: texto que aparece cuando el input está vacío.
 *  - type: tipo de input (por ejemplo "text", "email", "password").
 *  - error: texto del error que se debe mostrar si existe.
 *  - required: indica si el campo es obligatorio.
 */
export default function InputText({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error = "",
  required = false,
}) {
  return (
    <div className="input-text-wrapper">
      {/* Si existe label, se muestra como etiqueta del campo */}
      {label && (
        <label htmlFor={name} className="input-text-label">
          {label}

          {/* Si el campo es obligatorio, se muestra un asterisco */}
          {required && <span className="required">*</span>}
        </label>
      )}

      <input
        // id y name se establecen para identificar este input
        id={name}
        name={name}

        // tipo de input (text, email, password, etc.)
        type={type}

        // aplica estilos, y si hay error, agrega la clase input-error
        className={`input-text-field ${error ? "input-error" : ""}`}

        // texto que se muestra cuando no hay valor
        placeholder={placeholder}

        // valor actual del campo (controlado por el componente padre)
        value={value}

        // función ejecutada cuando el usuario cambia el contenido
        onChange={onChange}
      />

      {/* Si existe un error, se muestra debajo del input */}
      {error && <p className="input-text-error">{error}</p>}
    </div>
  );
}
