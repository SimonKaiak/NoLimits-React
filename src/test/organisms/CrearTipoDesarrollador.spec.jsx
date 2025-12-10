/**
 * Test del organismo CrearTipoDesarrollador.
 *
 * Este archivo valida el comportamiento del formulario encargado de registrar
 * o editar tipos de desarrollador. Las pruebas cubren:
 * - Renderización del título según el modo (crear o editar).
 * - Existencia del campo de entrada principal.
 * - Escritura en el input.
 * - Envío del formulario sin generar excepciones (sin ejecutar servicios reales).
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearTipoDesarrollador from "../../components/organisms/CrearTipoDesarrollador.jsx";

describe("Organism: CrearTipoDesarrollador", () => {

  /**
   * Verifica que el título apropiado se muestre cuando
   * el componente está configurado en modo crear.
   */
  it("debe mostrar el título en modo crear", () => {
    render(<CrearTipoDesarrollador modo="crear" />);
    expect(screen.getByText("Crear Tipo de Desarrollador")).toBeTruthy();
  });

  /**
   * Verifica que el título correspondiente se muestre
   * cuando el componente opera en modo editar.
   */
  it("debe mostrar el título en modo editar", () => {
    render(
      <CrearTipoDesarrollador
        modo="editar"
        tipo={{ id: 1, nombre: "Indie" }}
      />
    );
    expect(screen.getByText("Editar Tipo de Desarrollador")).toBeTruthy();
  });

  /**
   * Confirma que el input principal del formulario existe
   * y utiliza el placeholder definido en el componente.
   */
  it("debe renderizar el input nombre", () => {
    render(<CrearTipoDesarrollador modo="crear" />);

    const input = screen.getByPlaceholderText(
      "Ej: Estudio, Publisher, Freelancer..."
    );

    expect(input).toBeTruthy();
  });

  /**
   * Verifica que el campo de texto permita ingreso de valores.
   */
  it("debe permitir escribir en el input", () => {
    render(<CrearTipoDesarrollador modo="crear" />);

    const input = screen.getByPlaceholderText(
      "Ej: Estudio, Publisher, Freelancer..."
    );

    fireEvent.change(input, { target: { value: "Publisher" } });

    expect(input.value).toBe("Publisher");
  });

  /**
   * Confirma que el botón de envío no produzca errores,
   * aun cuando no se ejecuten servicios del backend durante las pruebas.
   */
  it("NO debe explotar al presionar Crear (pero sin ejecutar servicio)", () => {
    render(<CrearTipoDesarrollador modo="crear" />);

    const btn = screen.getByText("Crear");

    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});