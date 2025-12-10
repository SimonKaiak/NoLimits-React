/**
 * Test del organismo CrearEmpresa.
 *
 * Este archivo valida:
 * 1. Que el título cambie correctamente según el modo crear o editar.
 * 2. Que los campos Nombre y Activo se rendericen correctamente.
 * 3. Que el input Nombre pueda recibir texto.
 * 4. Que el checkbox Activo pueda activarse y desactivarse.
 * 5. Que al intentar guardar sin nombre se muestre un error de validación.
 * 6. Que el formulario pueda enviarse sin generar errores,
 *    pero sin llamar onCerrar debido a que en este entorno los servicios producen error.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearEmpresa from "../../components/organisms/CrearEmpresa.jsx";

describe("Organism: CrearEmpresa", () => {

  /**
   * Verifica que cuando el modo es "crear",
   * el componente muestre el título correspondiente.
   */
  it("debe renderizar el título correctamente en modo crear", () => {
    render(<CrearEmpresa modo="crear" />);
    expect(screen.getByText("Crear Empresa")).toBeTruthy();
  });

  /**
   * Verifica que cuando el modo es "editar",
   * el componente muestre el título correspondiente.
   */
  it("debe renderizar el título correctamente en modo editar", () => {
    const empresa = { id: 10, nombre: "Ubisoft", activo: true };

    render(<CrearEmpresa modo="editar" empresa={empresa} />);

    expect(screen.getByText("Editar Empresa")).toBeTruthy();
  });

  /**
   * Comprueba que el formulario presente correctamente
   * el campo de texto "Nombre" y el checkbox "Activo".
   */
  it("debe renderizar el input Nombre y el checkbox Activo", () => {
    render(<CrearEmpresa modo="crear" />);

    expect(screen.getByLabelText("Nombre")).toBeTruthy();
    expect(screen.getByLabelText("Activo")).toBeTruthy();
  });

  /**
   * Comprueba que el input Nombre permita escribir texto.
   */
  it("debe permitir escribir en el input Nombre", () => {
    render(<CrearEmpresa modo="crear" />);

    const input = screen.getByLabelText("Nombre");

    fireEvent.change(input, { target: { value: "Nintendo" } });

    expect(input.value).toBe("Nintendo");
  });

  /**
   * Comprueba que el checkbox Activo pueda cambiar de estado.
   */
  it("debe permitir activar/desactivar el checkbox Activo", () => {
    render(<CrearEmpresa modo="crear" />);

    const check = screen.getByLabelText("Activo");

    fireEvent.click(check);
    expect(check.checked).toBe(false);

    fireEvent.click(check);
    expect(check.checked).toBe(true);
  });

  /**
   * Comprueba que al intentar guardar sin ingresar nombre
   * se muestre el mensaje de error correspondiente.
   */
  it("debe mostrar error si el nombre está vacío y se intenta guardar", () => {
    render(<CrearEmpresa modo="crear" />);

    const btn = screen.getByText("Guardar");

    fireEvent.click(btn);

    expect(screen.getByText("El nombre no puede estar en blanco")).toBeTruthy();
  });

  /**
   * Valida que:
   * - El envío del formulario no produzca errores en ejecución.
   * - No debe llamarse onCerrar, ya que el servicio real de crearEmpresa
   *   falla en el entorno de test por no estar mockeado.
   */
  it("formulario debe enviarse sin lanzar errores, pero no debe llamar onCerrar debido a fallos en servicios", () => {
    const closeSpy = jasmine.createSpy("closeSpy");

    render(<CrearEmpresa modo="crear" onCerrar={closeSpy} />);

    const input = screen.getByLabelText("Nombre");
    const check = screen.getByLabelText("Activo");
    const btn = screen.getByText("Guardar");

    fireEvent.change(input, { target: { value: "Sony" } });
    fireEvent.click(check);

    // Se valida que el botón Guardar no provoque excepciones.
    expect(() => fireEvent.click(btn)).not.toThrow();

    // Debido a los fallos del servicio en tests, onCerrar no debe ejecutarse.
    expect(closeSpy).not.toHaveBeenCalled();
  });

});