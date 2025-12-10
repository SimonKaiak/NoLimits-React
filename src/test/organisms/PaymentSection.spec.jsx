/**
 * Pruebas del componente PaymentSection.
 *
 * Este componente incluye:
 * - Renderizado del total a pagar con formato CLP.
 * - Selección de método de pago: tarjetas o OnePay.
 * - Validaciones específicas según el método elegido.
 * - Alerts para errores de validación.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PaymentSection } from "../../components/organisms/PaymentSection.jsx";

/**
 * Mock de datos de pago para pruebas.
 */
const pagoMock = { total: 19990, correoUsuario: "test@mail.com" };

/**
 * Helper para renderizar el componente con MemoryRouter.
 */
function renderSection() {
  return render(<PaymentSection pago={pagoMock} />, { wrapper: MemoryRouter });
}

describe("Organism: PaymentSection", () => {

  // -----------------------------------------------------------
  // TOTAL A PAGAR
  // -----------------------------------------------------------

  it("debe mostrar el total a pagar", () => {
    renderSection();

    expect(
      screen.getByText((t) => t.includes("19.990"))
    ).toBeTruthy();
  });

  // -----------------------------------------------------------
  // SELECCIÓN DE MÉTODOS DE PAGO
  // -----------------------------------------------------------

  it("debe mostrar inputs de tarjeta cuando selecciono 'tarjetas'", () => {
    renderSection();

    const btnTarjetas = screen.getByTestId("btn-tarjetas");
    fireEvent.click(btnTarjetas);

    expect(screen.getByPlaceholderText("XXXX XXXX XXXX XXXX")).toBeTruthy();
    expect(screen.getByPlaceholderText("MM/AA")).toBeTruthy();
  });

  it("debe mostrar input PIN cuando selecciono 'onepay'", () => {
    renderSection();

    const btnOnePay = screen.getByTestId("btn-onepay");
    fireEvent.click(btnOnePay);

    expect(screen.getByPlaceholderText("Ingresa tu PIN")).toBeTruthy();
  });

  // -----------------------------------------------------------
  // VALIDACIONES
  // -----------------------------------------------------------

  it("debe alertar si intentas pagar sin método de pago", () => {
    renderSection();

    spyOn(window, "alert");

    const btnPagar = screen.getByText(/Pagar ahora/i);
    fireEvent.click(btnPagar);

    expect(window.alert).toHaveBeenCalledWith("Debes seleccionar un método de pago");
  });

  it("debe validar número de tarjeta", () => {
    renderSection();

    spyOn(window, "alert");

    fireEvent.click(screen.getByTestId("btn-tarjetas"));

    const inputTarjeta = screen.getByPlaceholderText("XXXX XXXX XXXX XXXX");
    const btnPagar = screen.getByText(/Pagar ahora/i);

    fireEvent.change(inputTarjeta, { target: { value: "123" } });
    fireEvent.click(btnPagar);

    expect(window.alert).toHaveBeenCalledWith("Número de tarjeta inválido");
  });

  it("debe validar vencimiento", () => {
    renderSection();

    spyOn(window, "alert");

    fireEvent.click(screen.getByTestId("btn-tarjetas"));

    const inputTarjeta = screen.getByPlaceholderText("XXXX XXXX XXXX XXXX");
    const inputVenc = screen.getByPlaceholderText("MM/AA");
    const btnPagar = screen.getByText(/Pagar ahora/i);

    fireEvent.change(inputTarjeta, { target: { value: "1234567890123456" } });
    fireEvent.change(inputVenc, { target: { value: "13/99" } });
    fireEvent.click(btnPagar);

    expect(window.alert).toHaveBeenCalledWith("El mes de vencimiento es inválido");
  });

  it("debe validar PIN de OnePay", () => {
    renderSection();

    spyOn(window, "alert");

    fireEvent.click(screen.getByTestId("btn-onepay"));

    const inputPin = screen.getByPlaceholderText("Ingresa tu PIN");
    const btnPagar = screen.getByText(/Pagar ahora/i);

    fireEvent.change(inputPin, { target: { value: "12" } });
    fireEvent.click(btnPagar);

    expect(window.alert).toHaveBeenCalledWith("El PIN de OnePay debe tener 5 dígitos");
  });

});