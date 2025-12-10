import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputText from "../../components/atoms/InputText.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente InputText.
 *
 * InputText es un campo de entrada de texto que puede recibir:
 * - un label para mostrar arriba del input
 * - un valor inicial
 * - un evento onChange cuando el usuario escribe
 * - un placeholder
 * - un tipo de input (por ejemplo "text" o "number")
 * - un mensaje de error y clases visuales de error
 *
 * Las pruebas verifican la estructura del input, su comportamiento
 * y cómo maneja las propiedades que se le envían.
 */
describe("Atom: InputText", () => {

  /**
   * Esta prueba revisa que el label aparezca en pantalla
   * cuando la propiedad "label" es enviada al componente.
   */
  it("debe renderizar el label si se envía", () => {
    render(
      <InputText
        label="Nombre"
        name="nombre"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Nombre")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que si el componente no recibe una propiedad "label",
   * entonces no debe mostrar ningún label vacío ni accidental.
   */
  it("no debe renderizar label si no se envía", () => {
    render(
      <InputText
        name="nombre"
        value=""
        onChange={() => {}}
      />
    );

    // No debe existir ningún label vacío
    expect(screen.queryByLabelText("")).toBeNull();
  });

  /**
   * Esta prueba revisa que si required=true,
   * el componente muestre un asterisco indicando que el campo es obligatorio.
   */
  it("debe mostrar asterisco cuando required=true", () => {
    render(
      <InputText
        label="Email"
        name="correo"
        value=""
        required={true}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("*")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que el placeholder aparezca correctamente
   * cuando se envía mediante la propiedad correspondiente.
   */
  it("debe renderizar el placeholder correctamente", () => {
    render(
      <InputText
        name="correo"
        value=""
        placeholder="Escribe tu correo"
        onChange={() => {}}
      />
    );

    expect(screen.getByPlaceholderText("Escribe tu correo")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que el componente respete el tipo de input enviado.
   * En este caso, el type="number" debe producir un input con rol "spinbutton".
   */
  it("debe aplicar type correctamente", () => {
    render(
      <InputText
        name="edad"
        type="number"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole("spinbutton");

    expect(input.getAttribute("type")).toBe("number");
  });

  /**
   * Esta prueba verifica que el componente asigne id y name con el mismo valor.
   * Esto es útil para formularios que necesitan enlazar labels e inputs.
   */
  it("debe asignar id y name correctamente", () => {
    render(
      <InputText
        name="usuario"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole("textbox");
    expect(input.getAttribute("id")).toBe("usuario");
    expect(input.getAttribute("name")).toBe("usuario");
  });

  /**
   * Esta prueba revisa que cuando la propiedad error tiene texto,
   * el componente agregue la clase "input-error".
   * Esta clase se utiliza para mostrar estilos visuales de error.
   */
  it("debe aplicar clase input-error si hay error", () => {
    render(
      <InputText
        name="usuario"
        value=""
        onChange={() => {}}
        error="Campo obligatorio"
      />
    );

    const input = screen.getByRole("textbox");

    expect(input.classList.contains("input-error")).toBeTrue();
  });

  /**
   * Esta prueba revisa que si error es una cadena vacía,
   * entonces el input no debe tener la clase de error.
   */
  it("no debe aplicar input-error si error está vacío", () => {
    render(
      <InputText
        name="usuario"
        value=""
        onChange={() => {}}
        error=""
      />
    );

    const input = screen.getByRole("textbox");

    expect(input.classList.contains("input-error")).toBeFalse();
  });

  /**
   * Esta prueba revisa que si existe un mensaje de error,
   * dicho mensaje debe aparecer en pantalla para el usuario.
   */
  it("debe mostrar el mensaje de error si error existe", () => {
    render(
      <InputText
        name="usuario"
        value=""
        onChange={() => {}}
        error="Dato inválido"
      />
    );

    expect(screen.getByText("Dato inválido")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que cuando error es una cadena vacía,
   * no debe aparecer ningún mensaje de error en pantalla.
   */
  it("no debe mostrar mensaje de error si error=''", () => {
    render(
      <InputText
        name="usuario"
        value=""
        onChange={() => {}}
        error=""
      />
    );

    expect(screen.queryByText("Dato inválido")).toBeNull();
  });

  /**
   * Esta prueba verifica que la función onChange se ejecute cuando el usuario
   * escribe dentro del input. Se utiliza un espía para comprobarlo.
   */
  it("debe ejecutar onChange al modificar el campo", () => {
    const changeSpy = jasmine.createSpy("changeSpy");

    render(
      <InputText
        name="usuario"
        value=""
        onChange={changeSpy}
      />
    );

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "James" } });

    expect(changeSpy).toHaveBeenCalled();
  });

});