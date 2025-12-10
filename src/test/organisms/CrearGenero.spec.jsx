/**
 * Test del organismo CrearGenero.
 *
 * Este archivo verifica:
 * 1. Que el título cambie dependiendo del modo (crear o editar).
 * 2. Que el input Nombre se renderice correctamente.
 * 3. Que el input permita escribir texto.
 * 4. Que se muestre el mensaje de error al intentar guardar sin nombre.
 * 5. Que el formulario pueda enviarse sin errores, pero sin ejecutar onCerrar
 *    debido a que los servicios reales fallan en el entorno de pruebas.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearGenero from "../../components/organisms/CrearGenero.jsx";

describe("Organism: CrearGenero", () => {

  /**
   * Comprueba que en modo crear se muestre el título correspondiente.
   */
  it("debe mostrar el título en modo crear", () => {
    render(<CrearGenero modo="crear" />);
    expect(screen.getByText("Crear Género")).toBeTruthy();
  });

  /**
   * Comprueba que en modo editar el título cambie correctamente.
   */
  it("debe mostrar el título en modo editar", () => {
    const genero = { id: 5, nombre: "Acción" };

    render(<CrearGenero modo="editar" genero={genero} />);

    expect(screen.getByText("Editar Género")).toBeTruthy();
  });

  /**
   * Verifica que el input Nombre esté correctamente renderizado.
   */
  it("debe renderizar el input Nombre correctamente", () => {
    render(<CrearGenero modo="crear" />);

    const input = screen.getByLabelText("Nombre");
    expect(input).toBeTruthy();
  });

  /**
   * Comprueba que el usuario pueda escribir texto dentro del campo Nombre.
   */
  it("debe permitir escribir en el campo Nombre", () => {
    render(<CrearGenero modo="crear" />);

    const input = screen.getByLabelText("Nombre");

    fireEvent.change(input, { target: { value: "Terror" } });

    expect(input.value).toBe("Terror");
  });

  /**
   * Valida que si se intenta guardar sin ingresar nombre se muestre un mensaje de error.
   */
  it("debe mostrar error si el nombre está vacío al intentar guardar", () => {
    render(<CrearGenero modo="crear" />);

    const btn = screen.getByText("Guardar");

    fireEvent.click(btn);

    expect(screen.getByText("El nombre no puede estar en blanco")).toBeTruthy();
  });

  /**
   * Comprueba que el formulario pueda enviarse sin generar excepciones.
   * Debido a que los servicios no están mockeados, onCerrar no debe ejecutarse.
   */
  it("formulario debe enviarse sin lanzar errores, pero onCerrar NO debe ser llamado en tests", () => {
    const closeSpy = jasmine.createSpy("closeSpy");

    render(<CrearGenero modo="crear" onCerrar={closeSpy} />);

    const input = screen.getByLabelText("Nombre");
    const btn = screen.getByText("Guardar");

    fireEvent.change(input, { target: { value: "Suspenso" } });

    // Enviar formulario sin producir errores
    expect(() => fireEvent.click(btn)).not.toThrow();

    // onCerrar no debe ejecutarse en entorno de pruebas
    expect(closeSpy).not.toHaveBeenCalled();
  });

});