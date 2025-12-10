/**
 * Pruebas del componente CrearVenta.
 *
 * Este archivo valida que el formulario para crear una venta funcione
 * correctamente en sus aspectos básicos. Se revisa lo siguiente:
 *
 * 1. Que el título y todos los campos necesarios aparezcan al renderizar
 *    el componente.
 *
 * 2. Que los inputs puedan recibir texto y que los valores escritos se
 *    almacenen correctamente dentro del formulario.
 *
 * 3. Que el formulario pueda enviarse sin producir errores en el entorno
 *    de pruebas, ya que en Karma las peticiones al backend no funcionan
 *    y no deben causar fallos.
 *
 * No se validan respuestas reales del backend ni se comprueba que la venta
 * sea creada en el servidor. Solo se asegura que el formulario funciona
 * correctamente en su parte visual y de interacción.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearVenta from "../../components/organisms/CrearVenta.jsx";

describe("Organism: CrearVenta", () => {

  /**
   * Verifica que el título principal y todos los campos del formulario
   * aparezcan correctamente en pantalla cuando el componente se carga.
   */
  it("debe renderizar el título y los inputs", () => {
    render(<CrearVenta />);

    // Título del formulario
    expect(screen.getByText("Crear Venta")).toBeTruthy();

    // Campos principales de la venta
    expect(screen.getByPlaceholderText("ID Usuario")).toBeTruthy();
    expect(screen.getByPlaceholderText("ID Método Pago")).toBeTruthy();
    expect(screen.getByPlaceholderText("ID Método Envío")).toBeTruthy();
    expect(screen.getByPlaceholderText("ID Estado")).toBeTruthy();
  });

  /**
   * Revisa que los inputs puedan recibir texto y que el valor ingresado
   * se refleje correctamente en cada uno de los campos.
   */
  it("debe permitir escribir en todos los campos", () => {
    render(<CrearVenta />);

    const usuario = screen.getByPlaceholderText("ID Usuario");
    const pago = screen.getByPlaceholderText("ID Método Pago");
    const envio = screen.getByPlaceholderText("ID Método Envío");
    const estado = screen.getByPlaceholderText("ID Estado");

    fireEvent.change(usuario, { target: { value: "10" } });
    fireEvent.change(pago, { target: { value: "3" } });
    fireEvent.change(envio, { target: { value: "2" } });
    fireEvent.change(estado, { target: { value: "5" } });

    expect(usuario.value).toBe("10");
    expect(pago.value).toBe("3");
    expect(envio.value).toBe("2");
    expect(estado.value).toBe("5");
  });

  /**
   * Comprueba que el formulario pueda enviarse sin producir errores.
   * Esto es importante porque en los tests no existe backend real,
   * por lo que la acción de guardar no debe causar fallos.
   */
  it("debe permitir enviar el formulario sin lanzar errores", () => {
    render(<CrearVenta />);

    fireEvent.change(screen.getByPlaceholderText("ID Usuario"), {
      target: { value: "1" }
    });
    fireEvent.change(screen.getByPlaceholderText("ID Método Pago"), {
      target: { value: "2" }
    });
    fireEvent.change(screen.getByPlaceholderText("ID Método Envío"), {
      target: { value: "3" }
    });
    fireEvent.change(screen.getByPlaceholderText("ID Estado"), {
      target: { value: "4" }
    });

    const btn = screen.getByText("Guardar venta");

    // La acción no debe producir errores en el entorno de pruebas
    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});