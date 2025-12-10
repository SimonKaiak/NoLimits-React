/**
 * Pruebas del componente ForgotPasswordSection.
 *
 * Este componente representa la sección principal de "Olvidé mi contraseña",
 * incluyendo la animación del candado y el formulario de recuperación.
 *
 * Las pruebas validan:
 * 
 * 1. Que el contenedor de la imagen se renderice correctamente.
 * 2. Que la animación se active al hacer click en la imagen.
 * 3. Que la animación se desactive cuando finaliza (onAnimationEnd).
 * 4. Que el formulario interno ForgotPasswordForm se renderice.
 *
 * Para simular navegación se utiliza MemoryRouter, ya que el componente
 * internamente incluye lógica asociada al enrutamiento.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ForgotPasswordSection } from "../../components/organisms/ForgotPasswordSection.jsx";

/**
 * Utilidad para renderizar el componente dentro de un MemoryRouter.
 * Esto permite simular rutas sin necesidad de un navegador real.
 */
function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Organism: ForgotPasswordSection", () => {

  /**
   * Verifica que el contenedor de la imagen (candado) se renderice.
   * Este contenedor utiliza data-testid="image-container".
   */
  it("debe renderizar correctamente el contenedor de la imagen", () => {
    renderWithRouter(<ForgotPasswordSection />);

    const imgContainer = screen.getByTestId("image-container");
    expect(imgContainer).toBeTruthy();
  });

  /**
   * Verifica que al hacer click en la imagen se agregue la clase "backflip",
   * la cual es utilizada para activar la animación CSS.
   */
  it("debe activar la animación cuando se hace click en la imagen", () => {
    renderWithRouter(<ForgotPasswordSection />);

    const imgContainer = screen.getByTestId("image-container");

    expect(imgContainer.classList.contains("backflip")).toBeFalse();

    fireEvent.click(imgContainer);

    expect(imgContainer.classList.contains("backflip")).toBeTrue();
  });

  /**
   * Verifica que la animación se desactive cuando se dispara el evento
   * onAnimationEnd, removiendo la clase "backflip".
   */
  it("debe desactivar animación al terminar el evento onAnimationEnd", () => {
    renderWithRouter(<ForgotPasswordSection />);

    const imgContainer = screen.getByTestId("image-container");

    fireEvent.click(imgContainer);
    expect(imgContainer.classList.contains("backflip")).toBeTrue();

    fireEvent.animationEnd(imgContainer);

    expect(imgContainer.classList.contains("backflip")).toBeFalse();
  });

  /**
   * Verifica que el formulario de recuperación esté presente.
   * El componente ForgotPasswordForm se marca con data-testid="form-forgot-password".
   */
  it("debe renderizar el formulario de recuperación", () => {
    renderWithRouter(<ForgotPasswordSection />);

    const form = screen.getByTestId("form-forgot-password");
    expect(form).toBeTruthy();
  });

});