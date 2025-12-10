/**
 * Test del organismo CrearTipoProducto.
 *
 * Este archivo valida el comportamiento general del formulario utilizado
 * para crear o editar tipos de producto dentro del panel administrativo.
 * Las pruebas incluyen:
 * - Validación del título según el modo.
 * - Verificación de inputs visibles.
 * - Escritura sobre los campos.
 * - Validación de errores locales.
 * - Envío del formulario sin producir excepciones durante los tests.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearTipoProducto from "../../components/organisms/CrearTipoProducto.jsx";

describe("Organism: CrearTipoProducto", () => {

  /**
   * Verifica que el formulario muestre el título correspondiente
   * cuando está configurado en modo creación.
   */
  it("debe mostrar el título correcto en modo 'crear'", () => {
    render(<CrearTipoProducto modo="crear" onCerrar={() => {}} />);
    expect(screen.getByText("Crear Tipo de Producto")).toBeTruthy();
  });

  /**
   * Verifica que el título cambie correctamente en modo edición.
   * El componente recibe un objeto tipo con información previa.
   */
  it("debe mostrar el título correcto en modo 'editar'", () => {
    const tipo = { id: 1, nombre: "RPG", descripcion: "Rol", activo: true };

    render(<CrearTipoProducto modo="editar" tipo={tipo} onCerrar={() => {}} />);

    expect(screen.getByText("Editar Tipo de Producto")).toBeTruthy();
  });

  /**
   * Valida que todos los campos principales del formulario
   * se encuentren correctamente presentes en pantalla:
   * - InputText para el nombre
   * - Textarea para descripción
   * - Checkbox Activo
   */
  it("debe renderizar los campos principales", () => {
    render(<CrearTipoProducto modo="crear" onCerrar={() => {}} />);

    expect(screen.getByLabelText(/Nombre/i)).toBeTruthy();

    // La descripción está en un textarea sin label, se obtiene mediante selector
    const textarea = screen.getByText("", { selector: "textarea" });
    expect(textarea).toBeTruthy();

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeTruthy();
  });

  /**
   * Verifica que el usuario pueda escribir en los campos
   * y que el componente refleje los cambios realizados.
   */
  it("debe actualizar el formulario cuando se escriben valores", () => {
    render(<CrearTipoProducto modo="crear" onCerrar={() => {}} />);

    const nombre = screen.getByLabelText(/Nombre/i);
    const textarea = screen.getByText("", { selector: "textarea" });
    const checkbox = screen.getByRole("checkbox");

    fireEvent.change(nombre, { target: { value: "Acción" } });
    fireEvent.change(textarea, { target: { value: "Descripción larga" } });
    fireEvent.click(checkbox);

    expect(nombre.value).toBe("Acción");
    expect(textarea.value).toBe("Descripción larga");
    expect(checkbox.checked).toBe(false);
  });

  /**
   * Valida que el mensaje de error correspondiente al nombre vacío
   * sea mostrado cuando se intenta guardar sin completar este campo.
   */
  it("debe mostrar error si el nombre está vacío", () => {
    render(<CrearTipoProducto modo="crear" onCerrar={() => {}} />);

    const btn = screen.getByText("Guardar");
    fireEvent.click(btn);

    expect(screen.getByText("Nombre obligatorio (2-100 caracteres)")).toBeTruthy();
  });

  /**
   * Verifica que el formulario pueda enviarse sin producir errores
   * dentro del entorno de pruebas. El test no valida la respuesta
   * del backend porque Karma bloquea las peticiones reales.
   */
  it("debe permitir enviar el formulario sin lanzar errores", () => {
    render(<CrearTipoProducto modo="crear" onCerrar={() => {}} />);

    const nombre = screen.getByLabelText(/Nombre/i);
    const textarea = screen.getByText("", { selector: "textarea" });
    const checkbox = screen.getByRole("checkbox");
    const btn = screen.getByText("Guardar");

    fireEvent.change(nombre, { target: { value: "Shooter" } });
    fireEvent.change(textarea, { target: { value: "" } });
    fireEvent.click(checkbox);

    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});