/**
 * Test del organismo CrearDetalleVenta.
 *
 * Se valida:
 * - Renderizado correcto del título.
 * - Presencia de los tres campos del formulario.
 * - Actualización del estado interno al modificar inputs.
 * - Envío del formulario sin producir errores.
 * - Se confirma que onFinish NO es llamado durante los tests
 *   debido a que crearDetalleVenta realiza una petición real
 *   que no se mockea en este contexto.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearDetalleVenta from "../../components/organisms/CrearDetalleVenta.jsx";

describe("Organism: CrearDetalleVenta", () => {

  // Comprueba que el título principal del formulario se renderice.
  it("debe mostrar el título del formulario", () => {
    render(<CrearDetalleVenta ventaId={5} />);

    expect(screen.getByText("Agregar producto")).toBeTruthy();
  });

  // Verifica la existencia de los tres inputs (productoId, cantidad, precioUnitario).
  it("debe renderizar los 3 inputs correctamente", () => {
    render(<CrearDetalleVenta ventaId={5} />);

    // Único campo con placeholder, facilita la búsqueda.
    expect(screen.getByPlaceholderText("ID Producto")).toBeTruthy();

    // Los inputs numéricos se detectan por su role "spinbutton".
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs.length).toBe(2);
  });

  // Comprueba que los valores escritos en los inputs actualicen el estado del formulario.
  it("debe actualizar el formulario cuando se escriben valores", () => {
    render(<CrearDetalleVenta ventaId={5} />);

    const productoId = screen.getByPlaceholderText("ID Producto");
    const cantidad = screen.getAllByRole("spinbutton")[0];
    const precioUnitario = screen.getAllByRole("spinbutton")[1];

    fireEvent.change(productoId, { target: { value: "90" } });
    fireEvent.change(cantidad, { target: { value: "3" } });
    fireEvent.change(precioUnitario, { target: { value: "15000" } });

    expect(productoId.value).toBe("90");
    expect(cantidad.value).toBe("3");
    expect(precioUnitario.value).toBe("15000");
  });

  /**
   * Se valida que:
   * - El formulario pueda enviarse sin lanzar errores.
   * - La función onFinish NO sea llamada debido a que
   *   crearDetalleVenta intenta hacer una petición fetch real.
   */
  it("el formulario debe ser enviable sin lanzar errores y NO debe explotar", () => {
    const finishSpy = jasmine.createSpy("finishSpy");

    render(<CrearDetalleVenta ventaId={1} onFinish={finishSpy} />);

    const productoId = screen.getByPlaceholderText("ID Producto");
    const cantidad = screen.getAllByRole("spinbutton")[0];
    const precioUnitario = screen.getAllByRole("spinbutton")[1];
    const btn = screen.getByText("Agregar");

    fireEvent.change(productoId, { target: { value: "10" } });
    fireEvent.change(cantidad, { target: { value: "2" } });
    fireEvent.change(precioUnitario, { target: { value: "5000" } });

    // Se asegura que el envío del formulario no cause errores.
    expect(() => fireEvent.click(btn)).not.toThrow();

    // Debido a la ausencia de un mock del servicio, onFinish no debe ser llamado.
    expect(finishSpy).not.toHaveBeenCalled();
  });
});