/**
 * Test del organismo CrearTipoEmpresa.
 *
 * Este archivo valida el comportamiento del formulario utilizado para crear
 * o editar tipos de empresa. Las pruebas cubren:
 * - Renderización del título según el modo (crear o editar).
 * - Presencia del campo de entrada principal.
 * - Escritura en el input.
 * - Envío del formulario sin lanzar excepciones, evitando cualquier llamada real al backend.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearTipoEmpresa from "../../components/organisms/CrearTipoEmpresa.jsx";

describe("Organism: CrearTipoEmpresa", () => {

  /**
   * Verifica que el formulario muestre el título correcto
   * cuando está configurado en modo crear.
   */
  it("debe mostrar el título en modo crear", () => {
    render(<CrearTipoEmpresa modo="crear" />);
    expect(screen.getByText("Crear Tipo de Empresa")).toBeTruthy();
  });

  /**
   * Verifica que el componente muestre el título adecuado
   * cuando recibe modo editar y un tipo cargado.
   */
  it("debe mostrar el título en modo editar", () => {
    render(
      <CrearTipoEmpresa
        modo="editar"
        tipo={{ id: 1, nombre: "Distribuidora" }}
      />
    );
    expect(screen.getByText("Editar Tipo de Empresa")).toBeTruthy();
  });

  /**
   * Confirma que el campo de texto principal se renderiza correctamente
   * utilizando el placeholder definido dentro del componente.
   */
  it("debe renderizar el input nombre", () => {
    render(<CrearTipoEmpresa modo="crear" />);
    const input = screen.getByPlaceholderText("Ej: Publisher");
    expect(input).toBeTruthy();
  });

  /**
   * Permite validar que el input recibe texto y actualiza su valor.
   */
  it("debe permitir escribir en el campo nombre", () => {
    render(<CrearTipoEmpresa modo="crear" />);
    const input = screen.getByPlaceholderText("Ej: Publisher");

    fireEvent.change(input, { target: { value: "Proveedor" } });

    expect(input.value).toBe("Proveedor");
  });

  /**
   * Verifica que el botón de envío pueda presionarse sin producir errores,
   * evitando cualquier ejecución de servicios externos durante la prueba.
   */
  it("NO debe lanzar errores al presionar el botón (sin enviar datos al backend)", () => {
    render(<CrearTipoEmpresa modo="crear" />);

    const btn = screen.getByText("Crear");

    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});