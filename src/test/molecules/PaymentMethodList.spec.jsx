import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentMethodList } from "../../components/molecules/PaymentMethodList.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente PaymentMethodList.
 *
 * PaymentMethodList es un componente que muestra dos métodos de pago:
 * - "tarjetas" (Crédito, Débito, Prepago)
 * - "onepay" (Otras billeteras digitales)
 *
 * Cada método es seleccionable y permite:
 * - ejecutar una función onSelect al hacer clic
 * - aplicar una clase visual "selected" al método activo
 *
 * Las pruebas verifican que:
 * - los textos se rendericen
 * - las funciones se ejecuten correctamente al hacer clic
 * - las clases se apliquen según el método seleccionado
 */
describe("Molecule: PaymentMethodList", () => {

  /**
   * Esta prueba revisa que los títulos principales de los métodos aparezcan
   * correctamente en pantalla.
   */
  it("debe renderizar los títulos de los métodos", () => {
    render(<PaymentMethodList selected="" onSelect={() => {}} />);

    expect(screen.getByText("Tarjetas")).toBeTruthy();
    expect(screen.getByText("OnePay")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que las descripciones secundarias de ambos métodos
   * también se muestren correctamente.
   */
  it("debe renderizar ambos métodos correctamente", () => {
    render(<PaymentMethodList selected="" onSelect={() => {}} />);

    expect(screen.getByText("Crédito, Débito, Prepago")).toBeTruthy();
    expect(screen.getByText("Otras billeteras digitales")).toBeTruthy();
  });

  /**
   * Esta prueba verifica que cuando se hace clic en el método "tarjetas",
   * se llame a la función onSelect con el valor esperado.
   */
  it("debe ejecutar onSelect('tarjetas') al hacer clic en la primera opción", () => {
    const selectSpy = jasmine.createSpy("selectSpy");

    render(<PaymentMethodList selected="" onSelect={selectSpy} />);

    const tarjetasDiv = screen
      .getByText("Crédito, Débito, Prepago")
      .closest("div");

    fireEvent.click(tarjetasDiv);

    expect(selectSpy).toHaveBeenCalledWith("tarjetas");
  });

  /**
   * Esta prueba revisa que al hacer clic en "onepay",
   * la función onSelect reciba el argumento correcto.
   */
  it("debe ejecutar onSelect('onepay') al hacer clic en la segunda opción", () => {
    const selectSpy = jasmine.createSpy("selectSpy");

    render(<PaymentMethodList selected="" onSelect={selectSpy} />);

    const onepayDiv = screen
      .getByText("Otras billeteras digitales")
      .closest("div");

    fireEvent.click(onepayDiv);

    expect(selectSpy).toHaveBeenCalledWith("onepay");
  });

  /**
   * Esta prueba revisa que cuando selected="tarjetas",
   * la tarjeta correspondiente incluya la clase CSS "selected".
   */
  it("debe aplicar la clase 'selected' cuando selected='tarjetas'", () => {
    render(<PaymentMethodList selected="tarjetas" onSelect={() => {}} />);

    const tarjetasDiv = screen
      .getByText("Crédito, Débito, Prepago")
      .closest("div");

    expect(tarjetasDiv.classList.contains("selected")).toBeTrue();
  });

  /**
   * Esta prueba revisa que cuando selected="onepay",
   * ese método también reciba la clase "selected".
   */
  it("debe aplicar la clase 'selected' cuando selected='onepay'", () => {
    render(<PaymentMethodList selected="onepay" onSelect={() => {}} />);

    const onepayDiv = screen
      .getByText("Otras billeteras digitales")
      .closest("div");

    expect(onepayDiv.classList.contains("selected")).toBeTrue();
  });

  /**
   * Esta prueba revisa que si el método seleccionado es "tarjetas",
   * entonces "onepay" NO debe tener la clase "selected".
   */
  it("no debe aplicar clase 'selected' cuando selected='tarjetas' en la opción onepay", () => {
    render(<PaymentMethodList selected="tarjetas" onSelect={() => {}} />);

    const onepayDiv = screen
      .getByText("Otras billeteras digitales")
      .closest("div");

    expect(onepayDiv.classList.contains("selected")).toBeFalse();
  });

  /**
   * Esta prueba revisa lo contrario: si selected="onepay",
   * entonces la opción "tarjetas" NO debe tener la clase "selected".
   */
  it("no debe aplicar clase 'selected' cuando selected='onepay' en la opción tarjetas", () => {
    render(<PaymentMethodList selected="onepay" onSelect={() => {}} />);

    const tarjetasDiv = screen
      .getByText("Crédito, Débito, Prepago")
      .closest("div");

    expect(tarjetasDiv.classList.contains("selected")).toBeFalse();
  });

});