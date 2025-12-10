/**
 * Pruebas del componente DetallesCompra.
 *
 * Este archivo verifica el comportamiento del componente que muestra
 * la información final de una compra realizada por un usuario.
 *
 * Las pruebas revisan lo siguiente:
 *
 * 1. Que los textos principales aparezcan correctamente cuando el
 *    componente se dibuja en pantalla.
 *
 * 2. Que cuando no existe un carrito almacenado en el navegador,
 *    se muestre un mensaje indicando que no hay productos definidos.
 *
 * 3. Que el componente pueda leer el carrito guardado en localStorage
 *    y mostrar el nombre del producto encontrado.
 *
 * 4. Que el precio recibido se muestre en formato chileno con puntos
 *    como separadores.
 *
 * Estas pruebas no realizan conexiones reales con un backend ni requieren
 * servicios externos. Solo validan el comportamiento visual y lógico del
 * componente dentro del navegador simulado.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { DetallesCompra } from "../../components/organisms/DetallesCompra.jsx";

describe("Organism: DetallesCompra", () => {

  /**
   * Antes de cada prueba se limpia el localStorage.
   * Esto asegura que cada test comience con un estado limpio y sin datos
   * que puedan interferir con las pruebas.
   */
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * Verifica que el título principal, el precio y la fecha se muestren
   * correctamente cuando se renderiza el componente.
   */
  it("debe mostrar los datos base: titulo, precio y fecha", () => {
    render(<DetallesCompra precio={5000} fecha="2025-01-01" />);

    expect(screen.getByText("Detalles de la compra")).toBeTruthy();
    expect(screen.getByText(/Precio:/i)).toBeTruthy();
    expect(screen.getByText("2025-01-01")).toBeTruthy();
  });

  /**
   * Verifica que, cuando no hay datos en el carrito del localStorage,
   * el componente muestre el mensaje “No definido”.
   */
  it("debe mostrar 'No definido' cuando no hay productos en el carrito", () => {
    render(<DetallesCompra precio={10000} fecha="2025-02-10" />);

    expect(screen.getByText(/No definido/i)).toBeTruthy();
  });

  /**
   * Verifica que el componente pueda leer un carrito almacenado en
   * localStorage y mostrar los nombres de los productos guardados.
   */
  it("debe leer el carrito del localStorage y mostrar el producto", () => {
    const carritoMock = [
      { nombre: "God of War Ragnarok" }
    ];

    // Se guarda manualmente el carrito en localStorage para simular datos reales
    localStorage.setItem("CART", JSON.stringify(carritoMock));

    render(<DetallesCompra precio={25000} fecha="2025-03-15" />);

    expect(screen.getByText(/God of War Ragnarok/i)).toBeTruthy();
  });

  /**
   * Verifica que el precio se muestre con formato chileno, es decir,
   * con puntos como separadores de miles.
   */
  it("debe formatear el precio correctamente", () => {
    render(<DetallesCompra precio={123456} fecha="2025-02-02" />);

    expect(screen.getByText("$123.456")).toBeTruthy();
  });

});