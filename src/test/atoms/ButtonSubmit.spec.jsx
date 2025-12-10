import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ButtonSubmit } from "../../components/atoms/ButtonSubmit.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente ButtonSubmit.
 * 
 * ButtonSubmit es un botón simple utilizado para enviar formularios.
 * Acepta propiedades como:
 * - text: el texto que se muestra dentro del botón
 * - onClick: la función que se ejecuta cuando el usuario hace clic
 * - className: clases CSS personalizadas
 * 
 * En estas pruebas se revisa que el componente muestre el texto correcto,
 * responda a eventos de clic y reciba clases externas cuando se le envían.
 */
describe("Atom: ButtonSubmit", () => {

  /**
   * Esta prueba revisa que el botón muestre correctamente
   * el texto proporcionado mediante la propiedad "text".
   */
  it("debe renderizar el texto correctamente", () => {
    render(<ButtonSubmit text="Enviar" />);

    // Se busca el texto dentro del botón
    expect(screen.getByText("Enviar")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que la función enviada en la propiedad "onClick"
   * se ejecute cuando el usuario presiona el botón.
   * 
   * Se usa jasmine.createSpy para verificar si la función fue llamada.
   */
  it("debe ejecutar onClick cuando se hace click", () => {
    const clickSpy = jasmine.createSpy("clickSpy");

    render(<ButtonSubmit text="Guardar" onClick={clickSpy} />);

    const btn = screen.getByText("Guardar");

    // Simulación del clic
    fireEvent.click(btn);

    // Se verifica que la función haya sido llamada
    expect(clickSpy).toHaveBeenCalled();
  });

  /**
   * Esta prueba revisa que cuando se envía una clase CSS a través de "className",
   * el botón realmente la incluya en su lista de clases.
   */
  it("debe aplicar className cuando se envía", () => {
    render(<ButtonSubmit text="Descargar" className="btn-submit" />);

    const btn = screen.getByText("Descargar");

    // Se revisa que el botón tenga la clase CSS enviada
    expect(btn.classList.contains("btn-submit")).toBeTrue();
  });

  /**
   * Esta prueba verifica que el botón exista y que pueda recibir un clic
   * sin generar errores, incluso si no se envía una función onClick.
   */
  it("el botón debe existir y ser clickeable sin lanzar errores", () => {
    render(<ButtonSubmit text="Aceptar" />);

    const btn = screen.getByText("Aceptar");

    // Se revisa que hacer clic no provoque fallos
    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});