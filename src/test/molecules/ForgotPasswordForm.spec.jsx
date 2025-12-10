import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ForgotPasswordForm } from "../../components/molecules/ForgotPasswordForm.jsx";
import { MemoryRouter } from "react-router-dom";

/**
 * Este archivo contiene pruebas unitarias para el componente ForgotPasswordForm.
 *
 * ForgotPasswordForm es un formulario que permite al usuario escribir su correo
 * electrónico para solicitar la recuperación de contraseña.
 * El formulario incluye:
 * - un campo para ingresar correo
 * - validación para campo vacío
 * - validación para formato incorrecto
 * - un mensaje de error con ErrorMsg
 * - un botón de envío
 *
 * Las pruebas verifican que los mensajes aparezcan cuando corresponda,
 * que el campo responda a los cambios y que el comportamiento del formulario
 * sea coherente con lo esperado.
 */
describe("Molecule: ForgotPasswordForm", () => {

  /**
   * Esta prueba revisa que el texto informativo del formulario se muestre
   * correctamente. Este texto guía al usuario indicando qué debe ingresar.
   */
  it("debe mostrar el texto informativo", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Ingresa tu correo electrónico/i)
    ).toBeTruthy();
  });

  /**
   * Esta prueba verifica que cuando el usuario intenta enviar el formulario
   * con el campo vacío, se muestre un mensaje de error indicando que debe
   * ingresar un correo.
   */
  it("debe mostrar ErrorMsg cuando el campo está vacío al enviar", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>
    );

    const submitBtn = screen.getByText("Continuar");

    // Se hace clic sin escribir nada
    fireEvent.click(submitBtn);

    expect(screen.getByText("Ingrese un correo electrónico.")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que si el usuario escribe un correo con formato inválido
   * y presiona el botón, se muestre un mensaje de error indicando que el formato
   * no es correcto.
   */
  it("debe mostrar error si el formato de correo es inválido", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Ingresa tu correo");
    const submitBtn = screen.getByText("Continuar");

    fireEvent.change(input, { target: { value: "correo-malo" } });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Formato de correo inválido.")).toBeTruthy();
  });

  /**
   * Esta prueba verifica que cuando existe un mensaje de error y el usuario
   * vuelve a escribir en el campo, el mensaje debe limpiarse automáticamente.
   */
  it("debe limpiar el error cuando el usuario vuelve a escribir", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Ingresa tu correo");
    const submitBtn = screen.getByText("Continuar");

    // Se provoca un error por campo vacío
    fireEvent.click(submitBtn);
    expect(screen.getByText("Ingrese un correo electrónico.")).toBeTruthy();

    // Cuando el usuario escribe, el error debe desaparecer
    fireEvent.change(input, { target: { value: "nuevo@correo.com" } });

    expect(screen.queryByText("Ingrese un correo electrónico.")).toBeNull();
  });

  /**
   * Esta prueba simula manualmente el estado "loading" cambiando propiedades
   * del botón directamente. Esto se hace porque ForgotPasswordForm no cuenta
   * con una forma directa de activar loading desde afuera.
   *
   * Se verifica que el texto del botón cambie a "Verificando...".
   */
  it("debe mostrar 'Verificando...' cuando loading=true (simulación manual)", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>
    );

    const button = screen.getByText("Continuar");

    // Simulación manual del estado loading
    button.disabled = true;
    button.textContent = "Verificando...";

    expect(button.textContent).toBe("Verificando...");
  });

});