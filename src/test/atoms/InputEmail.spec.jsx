import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputEmail } from "../../components/atoms/InputEmail.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente InputEmail.
 * 
 * InputEmail es un campo de entrada diseñado específicamente para correos electrónicos.
 * Este componente:
 * - recibe un valor mediante la propiedad "value"
 * - ejecuta una función cuando el usuario escribe, mediante "onChange"
 * - puede mostrar un estado de error usando la propiedad "hasError"
 * 
 * Las siguientes pruebas verifican que el InputEmail funcione correctamente
 * en cuanto a estructura, atributos, comportamiento y estilo.
 */
describe("Atom: InputEmail", () => {

  /**
   * Esta prueba revisa que el componente renderice un campo <input>
   * con el placeholder "Ingresa tu correo". Este placeholder se utiliza
   * aquí para ubicar el elemento dentro de la pantalla.
   */
  it("debe renderizar el input de correo", () => {
    render(<InputEmail value="" onChange={() => {}} />);

    const input = screen.getByPlaceholderText("Ingresa tu correo");
    expect(input).toBeTruthy();
  });

  /**
   * Esta prueba revisa que el campo posea el atributo type="email",
   * lo cual es importante para validación automática del navegador.
   */
  it("debe tener type='email'", () => {
    render(<InputEmail value="" onChange={() => {}} />);

    const input = screen.getByPlaceholderText("Ingresa tu correo");

    expect(input.getAttribute("type")).toBe("email");
  });

  /**
   * Esta prueba revisa que el input tenga el atributo required,
   * lo que indica que el campo no puede quedar vacío en formularios
   * que utilizan validación HTML estándar.
   */
  it("debe tener el atributo required", () => {
    render(<InputEmail value="" onChange={() => {}} />);

    const input = screen.getByPlaceholderText("Ingresa tu correo");

    // Jasmine no tiene un método directo como toHaveAttribute,
    // por lo que se usa hasAttribute.
    expect(input.hasAttribute("required")).toBeTrue();
  });

  /**
   * Esta prueba revisa que la función enviada en la propiedad onChange
   * se ejecute cuando el usuario escribe dentro del input.
   * 
   * Se usa jasmine.createSpy para verificar si la función fue llamada.
   */
  it("debe ejecutar onChange al escribir", () => {
    const changeSpy = jasmine.createSpy("changeSpy");

    render(<InputEmail value="" onChange={changeSpy} />);

    const input = screen.getByPlaceholderText("Ingresa tu correo");

    // Se simula que el usuario escribe un correo
    fireEvent.change(input, { target: { value: "correo@test.com" } });

    // Verificamos que la función onChange haya sido llamada
    expect(changeSpy).toHaveBeenCalled();
  });

  /**
   * Esta prueba revisa que cuando la propiedad hasError=true,
   * el componente agregue la clase CSS "input-error".
   * 
   * Esta clase se usa normalmente para resaltar el campo con un borde rojo
   * o algún indicador visual de error.
   */
  it("debe aplicar la clase 'input-error' cuando hasError=true", () => {
    render(<InputEmail value="" onChange={() => {}} hasError={true} />);

    const input = screen.getByPlaceholderText("Ingresa tu correo");

    expect(input.classList.contains("input-error")).toBeTrue();
  });

  /**
   * Esta prueba revisa que si hasError=false, entonces
   * el input no debe tener la clase "input-error".
   */
  it("no debe aplicar clase cuando hasError=false", () => {
    render(<InputEmail value="" onChange={() => {}} hasError={false} />);

    const input = screen.getByPlaceholderText("Ingresa tu correo");

    expect(input.classList.contains("input-error")).toBeFalse();
  });

});