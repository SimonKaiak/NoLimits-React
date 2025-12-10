// Se importa React para poder usar JSX y componentes
import React from "react";

/**
 * Componente SelectBase
 *
 * Este componente representa un campo de selección (select) genérico.
 * Se utiliza cuando el usuario debe elegir una opción desde una lista,
 * como tipos de producto, clasificaciones, estados, regiones, etc.
 *
 * Parámetros (props):
 *  - label: texto que aparece encima del select.
 *  - value: el valor actualmente seleccionado (controlado desde el padre).
 *  - onChange: función que se ejecuta cada vez que el usuario cambia la opción.
 *  - options: lista de opciones disponibles. Cada opción debe tener:
 *      { id: valorDelSelect, nombre: textoQueSeMuestra }
 *  - required: indica si la selección es obligatoria.
 */
export default function SelectBase({
  label,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div className="input-field">
      {/* Etiqueta del campo. Si es obligatorio, aparece un asterisco */}
      <label className="input-label">
        {label}
        {required && " *"}
      </label>

      <select
        // Clase para aplicar estilos
        className="input-base"

        // Opción seleccionada actualmente
        value={value}

        // Se ejecuta cuando el usuario cambia la selección
        onChange={onChange}

        // Indica si este campo debe ser obligatorio
        required={required}
      >
        {/* Primera opción vacía para obligar a seleccionar algo */}
        <option value="">Seleccionar...</option>

        {/* Se generan todas las opciones que llegan desde props */}
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
