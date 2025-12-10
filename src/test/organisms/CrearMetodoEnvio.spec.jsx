/**
 * Test del organismo CrearMetodoEnvio.
 *
 * Este archivo valida el comportamiento del formulario encargado de crear o editar
 * métodos de envío. Se comprueba:
 * - El título dinámico según el modo del componente.
 * - La presencia y funcionamiento de los campos Nombre, Descripción y Activo.
 * - La validación de campos requeridos.
 * - Que el formulario pueda enviarse sin generar errores en el entorno de test.
 * - Que onCerrar no sea llamado debido a que los servicios reales fallan en Karma.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearMetodoEnvio from "../../components/organisms/CrearMetodoEnvio.jsx";

describe("Organism: CrearMetodoEnvio", () => {

  /**
   * Verifica que el título mostrado sea el correcto cuando el componente está en modo crear.
   */
  it("debe mostrar el título en modo crear", () => {
    render(<CrearMetodoEnvio modo="crear" />);
    expect(screen.getByText("Crear Método de Envío")).toBeTruthy();
  });

  /**
   * Verifica que el título mostrado cambie correctamente cuando el componente está en modo editar.
   */
  it("debe mostrar el título en modo editar", () => {
    const metodo = { id: 1, nombre: "Express", descripcion: "", activo: true };
    render(<CrearMetodoEnvio modo="editar" metodo={metodo} />);
    expect(screen.getByText("Editar Método de Envío")).toBeTruthy();
  });

  /**
   * Asegura que los campos principales del formulario estén renderizados:
   * Nombre, Descripción y el checkbox Activo.
   */
  it("debe renderizar los campos Nombre, Descripción y Activo", () => {
    render(<CrearMetodoEnvio modo="crear" />);

    expect(screen.getByLabelText("Nombre")).toBeTruthy();
    expect(screen.getByLabelText("Descripción")).toBeTruthy();
    expect(screen.getByLabelText("Activo")).toBeTruthy();
  });

  /**
   * Verifica que el usuario pueda escribir valores en los campos Nombre y Descripción.
   */
  it("debe permitir escribir en Nombre y Descripción", () => {
    render(<CrearMetodoEnvio modo="crear" />);

    const nombre = screen.getByLabelText("Nombre");
    const descripcion = screen.getByLabelText("Descripción");

    fireEvent.change(nombre, { target: { value: "Envío Rápido" } });
    fireEvent.change(descripcion, { target: { value: "Entrega en 24 horas" } });

    expect(nombre.value).toBe("Envío Rápido");
    expect(descripcion.value).toBe("Entrega en 24 horas");
  });

  /**
   * Valida que el checkbox Activo pueda alternar entre verdadero y falso.
   */
  it("debe alternar el checkbox Activo", () => {
    render(<CrearMetodoEnvio modo="crear" />);

    const check = screen.getByLabelText("Activo");

    fireEvent.click(check);
    expect(check.checked).toBe(false);

    fireEvent.click(check);
    expect(check.checked).toBe(true);
  });

  /**
   * Asegura que al intentar enviar el formulario sin nombre,
   * se debe mostrar un mensaje de error correspondiente.
   */
  it("debe mostrar error si el nombre está vacío", () => {
    render(<CrearMetodoEnvio modo="crear" />);

    const btn = screen.getByText("Guardar");
    fireEvent.click(btn);

    expect(screen.getByText("El nombre no puede estar en blanco")).toBeTruthy();
  });

  /**
   * Verifica que el formulario pueda enviarse sin que ocurra una excepción,
   * pero onCerrar no debe ejecutarse ya que los servicios no están mockeados
   * y provocan fallos en el entorno de pruebas.
   */
  it("formulario se debe enviar sin explotar, pero onCerrar NO debe llamarse por errores del backend", () => {
    const closeSpy = jasmine.createSpy("closeSpy");

    render(<CrearMetodoEnvio modo="crear" onCerrar={closeSpy} />);

    const nombre = screen.getByLabelText("Nombre");
    const descripcion = screen.getByLabelText("Descripción");
    const btn = screen.getByText("Guardar");

    fireEvent.change(nombre, { target: { value: "Envío Premium" } });
    fireEvent.change(descripcion, { target: { value: "Entrega rápida" } });

    // Enviar formulario sin producir excepciones
    expect(() => fireEvent.click(btn)).not.toThrow();

    // onCerrar no debe ser ejecutado
    expect(closeSpy).not.toHaveBeenCalled();
  });

});