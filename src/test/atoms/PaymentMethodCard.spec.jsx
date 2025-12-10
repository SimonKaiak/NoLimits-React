import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentMethodCard } from "../../components/atoms/PaymentMethodCard.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente PaymentMethodCard.
 *
 * PaymentMethodCard representa una tarjeta seleccionable que muestra:
 * - un título del método de pago
 * - un subtítulo con información adicional
 * - un ícono visual
 * 
 * También puede:
 * - ejecutar una función cuando se hace clic en la tarjeta
 * - aplicar una clase visual especial cuando está seleccionada
 *
 * Las pruebas verifican que el componente muestre su contenido,
 * reciba correctamente los eventos y aplique clases según sus propiedades.
 */
describe("Atom: PaymentMethodCard", () => {

  /**
   * Esta prueba revisa que el componente muestre correctamente
   * el título y el subtítulo que se envían como propiedades.
   */
  it("debe mostrar el título y subtítulo", () => {
    render(
      <PaymentMethodCard
        title="Tarjeta de Crédito"
        subtitle="Visa / MasterCard"
        icon={<span></span>}
      />
    );

    expect(screen.getByText("Tarjeta de Crédito")).toBeTruthy();
    expect(screen.getByText("Visa / MasterCard")).toBeTruthy();
  });

  /**
   * Esta prueba verifica que el ícono enviado como propiedad
   * efectivamente se muestre dentro del componente.
   * 
   * Se usa data-testid para identificar el ícono en pantalla.
   */
  it("debe mostrar el ícono enviado", () => {
    render(
      <PaymentMethodCard
        title="Débito"
        subtitle="Banco Estado"
        icon={<span data-testid="iconito"></span>}
      />
    );

    const icon = screen.getByTestId("iconito");
    expect(icon).toBeTruthy();
  });

  /**
   * Esta prueba comprueba que la función enviada mediante la propiedad
   * "oncClick" se ejecute correctamente cuando el usuario hace clic
   * en la tarjeta.
   */
  it("debe ejecutar la función oncClick al hacer clic", () => {
    const clickSpy = jasmine.createSpy("clickSpy");

    render(
      <PaymentMethodCard
        title="Débito"
        subtitle="RedCompra"
        icon={<span></span>}
        oncClick={clickSpy}
      />
    );

    // Se toma el contenedor más cercano al texto principal
    const card = screen.getByText("Débito").closest("div");

    // Se simula el clic
    fireEvent.click(card);

    // Se verifica que la función haya sido llamada
    expect(clickSpy).toHaveBeenCalled();
  });

  /**
   * Esta prueba revisa que cuando la propiedad selected=true,
   * el componente incluya la clase CSS "selected".
   * Esta clase se utiliza para marcar visualmente el elemento como elegido.
   */
  it("debe aplicar la clase 'selected' cuando selected=true", () => {
    render(
      <PaymentMethodCard
        title="PayPal"
        subtitle="Cuenta vinculada"
        icon={<span></span>}
        selected={true}
      />
    );

    const card = screen.getByText("PayPal").closest(".payment-method-card");

    expect(card.classList.contains("selected")).toBeTrue();
  });

  /**
   * Esta prueba verifica que cuando selected=false,
   * la clase "selected" no debe aparecer en el elemento principal.
   */
  it("no debe aplicar la clase 'selected' cuando selected=false", () => {
    render(
      <PaymentMethodCard
        title="PayPal"
        subtitle="Cuenta vinculada"
        icon={<span></span>}
        selected={false}
      />
    );

    const card = screen.getByText("PayPal").closest("div");

    expect(card.classList.contains("selected")).toBeFalse();
  });

});