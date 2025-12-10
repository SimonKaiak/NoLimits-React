// Se importa React para poder usar JSX y componentes
import React from "react";

/**
 * Componente InputNumber
 *
 * Este componente representa un campo de entrada para números.
 * Se utiliza cuando el usuario debe ingresar valores numéricos
 * como cantidades, precios, edades, etc.
 *
 * Parámetros (props):
 *  - label: texto del título que aparece encima del campo.
 *  - value: valor actual del input, controlado desde el componente padre.
 *  - onChange: función que se ejecuta cada vez que el usuario escribe o cambia el número.
 *  - min: valor mínimo permitido (por defecto es 0).
 *  - required: indica si este campo es obligatorio (por defecto es false).
 */
export default function InputNumber({
  label,
  value,
  onChange,
  min = 0,
  required = false,
}) {
  return (
    <div className="input-field">
      {/* Etiqueta del campo. Si es obligatorio, muestra un asterisco */}
      <label className="input-label">
        {label}
        {required && " *"}
      </label>

      <input
        // El tipo "number" permite ingresar solo números
        type="number"

        // Clase CSS base para el estilo del input
        className="input-base"

        // Valor del campo, enviado desde el componente padre
        value={value}

        // Valor mínimo permitido
        min={min}

        // Se ejecuta cuando el usuario cambia el número
        onChange={onChange}

        // Indica si el campo es obligatorio
        required={required}
      />
    </div>
  );
}
