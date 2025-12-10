/**
 * Test del organismo AccionCompra.
 * 
 * Este archivo verifica que el componente renderice correctamente:
 * - El mensaje principal de confirmación.
 * - La información del carrito almacenada en localStorage.
 * - El formato del precio mostrado.
 * - La fecha entregada por props.
 * - El correcto funcionamiento del botón de retorno.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccionCompra } from "../../components/organisms/AccionCompra.jsx";
import { MemoryRouter } from "react-router-dom";

describe("Organism: AccionCompra", () => {

  // Antes de cada test, simula un carrito dentro de localStorage.
  // Esto permite comprobar que el componente lea la información correctamente.
  beforeEach(() => {
    localStorage.setItem(
      "CART",
      JSON.stringify([
        { nombre: "PS5" }
      ])
    );
  });

  // Después de cada test, se limpia localStorage para evitar contaminación
  // entre casos de prueba.
  afterEach(() => {
    localStorage.clear();
  });

  // Verifica que el componente renderice su contenedor principal
  it("debe renderizar el contenedor principal", () => {
    render(
      <MemoryRouter>
        <AccionCompra precio={500000} fecha="2025-11-23" />
      </MemoryRouter>
    );

    // Se busca el texto principal y se obtiene el section padre
    const section = screen.getByText("¡Compra realizada con éxito!").closest("section");
    expect(section).toBeTruthy();
  });

  // Comprueba que el mensaje de confirmación esté presente en la pantalla
  it("debe mostrar el componente MensajeConfirmacion", () => {
    render(
      <MemoryRouter>
        <AccionCompra precio={500000} fecha="2025-11-23" />
      </MemoryRouter>
    );

    expect(screen.getByText("¡Compra realizada con éxito!")).toBeTruthy();
  });

  // Valida que el producto almacenado en localStorage sea mostrado
  it("debe mostrar el producto desde localStorage", () => {
    render(
      <MemoryRouter>
        <AccionCompra precio={500000} fecha="2025-11-23" />
      </MemoryRouter>
    );

    // Busca el texto "Producto:" y luego el nombre del producto
    expect(screen.getByText(/Producto:/)).toBeTruthy();
    expect(screen.getByText("PS5")).toBeTruthy();
  });

  // Verifica que el precio recibido por props se muestre con formato chileno
  it("debe mostrar el precio formateado", () => {
    render(
      <MemoryRouter>
        <AccionCompra precio={500000} fecha="2025-11-23" />
      </MemoryRouter>
    );

    // Resultado esperado: $500.000
    expect(screen.getByText("$500.000")).toBeTruthy();
  });

  // Comprueba que la fecha proporcionada por props se renderice
  it("debe mostrar la fecha enviada", () => {
    render(
      <MemoryRouter>
        <AccionCompra precio={500000} fecha="2025-11-23" />
      </MemoryRouter>
    );

    expect(screen.getByText("2025-11-23")).toBeTruthy();
  });

  // Verifica que el botón pueda ser clickeado sin generar errores
  it("el botón 'Volver al inicio' debe ser clickeable sin lanzar errores", () => {
    render(
      <MemoryRouter>
        <AccionCompra precio={500000} fecha="2025-11-23" />
      </MemoryRouter>
    );

    const btn = screen.getByText("Volver al inicio");

    // fireEvent.click no debe lanzar excepciones
    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});