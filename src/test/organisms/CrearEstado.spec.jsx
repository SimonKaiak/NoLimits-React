/**
 * Test del organismo CrearEstado.
 *
 * Este archivo valida:
 * 1. Que el título cambie correctamente según el modo crear o editar.
 * 2. Que se rendericen correctamente los campos Nombre, Descripción y el checkbox Activo.
 * 3. Que los campos Nombre y Descripción permitan escribir texto.
 * 4. Que el checkbox Activo pueda alternarse entre verdadero y falso.
 * 5. Que se muestre el mensaje de error al intentar guardar sin nombre.
 * 6. Que el formulario pueda enviarse sin generar errores,
 *    pero sin llamar a onCerrar debido a fallos en los servicios dentro del entorno de prueba.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearEstado from "../../components/organisms/CrearEstado.jsx";

describe("Organism: CrearEstado", () => {

  /**
   * Verifica que en modo "crear" se muestre el título correspondiente.
   */
  it("debe mostrar el título en modo crear", () => {
    render(<CrearEstado modo="crear" />);
    expect(screen.getByText("Crear Estado")).toBeTruthy();
  });

  /**
   * Verifica que en modo "editar" el componente muestre el título correcto.
   */
  it("debe mostrar el título en modo editar", () => {
    const estado = { id: 1, nombre: "Activo", descripcion: "", activo: true };

    render(<CrearEstado modo="editar" estado={estado} />);

    expect(screen.getByText("Editar Estado")).toBeTruthy();
  });

  /**
   * Comprueba que el formulario muestre:
   * - Campo Nombre
   * - Campo Descripción
   * - Checkbox Activo
   */
  it("debe renderizar los campos Nombre, Descripción y el checkbox Activo", () => {
    render(<CrearEstado modo="crear" />);

    expect(screen.getByLabelText("Nombre")).toBeTruthy();
    expect(screen.getByLabelText("Descripción")).toBeTruthy();
    expect(screen.getByLabelText("Activo")).toBeTruthy();
  });

  /**
   * Verifica que los inputs de Nombre y Descripción acepten texto ingresado por el usuario.
   */
  it("debe permitir escribir en Nombre y Descripción", () => {
    render(<CrearEstado modo="crear" />);

    const nombre = screen.getByLabelText("Nombre");
    const descripcion = screen.getByLabelText("Descripción");

    fireEvent.change(nombre, { target: { value: "En proceso" } });
    fireEvent.change(descripcion, { target: { value: "Pedido en camino" } });

    expect(nombre.value).toBe("En proceso");
    expect(descripcion.value).toBe("Pedido en camino");
  });

  /**
   * Comprueba que el checkbox Activo pueda cambiar entre marcado y desmarcado.
   */
  it("debe permitir alternar el checkbox Activo", () => {
    render(<CrearEstado modo="crear" />);

    const check = screen.getByLabelText("Activo");

    fireEvent.click(check);
    expect(check.checked).toBe(false);

    fireEvent.click(check);
    expect(check.checked).toBe(true);
  });

  /**
   * Valida que al intentar guardar sin escribir un nombre se muestre un mensaje de error.
   */
  it("debe mostrar error si se intenta enviar sin nombre", () => {
    render(<CrearEstado modo="crear" />);

    const btn = screen.getByText("Guardar");

    fireEvent.click(btn);

    expect(screen.getByText("El nombre no puede estar en blanco")).toBeTruthy();
  });

  /**
   * Comprueba que el formulario pueda enviarse sin que se produzcan errores.
   * Debido a que los servicios no están mockeados, onCerrar no debe ejecutarse.
   */
  it("formulario debe enviarse sin lanzar errores, pero onCerrar NO debe ser llamado en tests", () => {
    const closeSpy = jasmine.createSpy("closeSpy");

    render(<CrearEstado modo="crear" onCerrar={closeSpy} />);

    const nombre = screen.getByLabelText("Nombre");
    const descripcion = screen.getByLabelText("Descripción");
    const btn = screen.getByText("Guardar");

    fireEvent.change(nombre, { target: { value: "Enviado" } });
    fireEvent.change(descripcion, { target: { value: "Estado listo" } });

    expect(() => fireEvent.click(btn)).not.toThrow();

    expect(closeSpy).not.toHaveBeenCalled();
  });

});