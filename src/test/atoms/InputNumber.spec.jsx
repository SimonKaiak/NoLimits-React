import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputNumber from "../../components/atoms/InputNumber.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente InputNumber.
 *
 * InputNumber es un campo de entrada para valores numéricos.
 * Este componente:
 * - muestra un label
 * - permite agregar un asterisco cuando el campo es obligatorio
 * - utiliza un input de tipo "number"
 * - ejecuta una función cuando cambia el valor
 * - puede recibir atributos adicionales como "min" o "required"
 *
 * Las siguientes pruebas verifican que el componente funcione
 * correctamente en cuanto a estructura, comportamiento y atributos.
 */
describe("Atom: InputNumber", () => {

  /**
   * Esta prueba revisa que el texto del label se muestre correctamente.
   * Se usa getByText para encontrar el label en pantalla.
   */
  it("debe renderizar el label correctamente", () => {
    render(<InputNumber label="Cantidad" value={0} onChange={() => {}} />);

    expect(screen.getByText("Cantidad")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que cuando required=true,
   * el componente añada un asterisco al label.
   * Esto indica visualmente que el campo es obligatorio.
   */
  it("debe mostrar asterisco cuando required=true", () => {
    render(
      <InputNumber
        label="Stock"
        value={1}
        onChange={() => {}}
        required={true}
      />
    );

    expect(screen.getByText("Stock *")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que cuando required=false,
   * el label no debe incluir el asterisco.
   */
  it("no debe mostrar asterisco cuando required=false", () => {
    render(
      <InputNumber
        label="Stock"
        value={1}
        onChange={() => {}}
        required={false}
      />
    );

    expect(screen.queryByText("Stock *")).toBeNull();
  });

  /**
   * Esta prueba verifica que el input interno sea de tipo number.
   * Los inputs de tipo number tienen el rol "spinbutton",
   * por lo que se usa getByRole("spinbutton") para encontrarlos.
   */
  it("debe tener type='number'", () => {
    render(<InputNumber label="Edad" value={0} onChange={() => {}} />);

    const input = screen.getByRole("spinbutton");

    expect(input.getAttribute("type")).toBe("number");
  });

  /**
   * Esta prueba revisa que la función onChange se ejecute correctamente
   * cuando el usuario modifica el valor del input.
   *
   * Se usa jasmine.createSpy para detectar si la función fue llamada.
   */
  it("debe ejecutar onChange al modificar valor", () => {
    const changeSpy = jasmine.createSpy("changeSpy");

    render(<InputNumber label="Cantidad" value={0} onChange={changeSpy} />);

    const input = screen.getByRole("spinbutton");

    fireEvent.change(input, { target: { value: "5" } });

    expect(changeSpy).toHaveBeenCalled();
  });

  /**
   * Esta prueba revisa que al enviar el atributo "min",
   * el input reciba correctamente ese valor.
   */
  it("debe aplicar el atributo min cuando se envía", () => {
    render(
      <InputNumber
        label="Cantidad"
        value={0}
        onChange={() => {}}
        min={3}
      />
    );

    const input = screen.getByRole("spinbutton");

    expect(input.getAttribute("min")).toBe("3");
  });

  /**
   * Esta prueba revisa que el input incluya el atributo required
   * cuando required=true.
   */
  it("debe tener el atributo required cuando required=true", () => {
    render(
      <InputNumber
        label="Cantidad"
        value={0}
        onChange={() => {}}
        required={true}
      />
    );

    const input = screen.getByRole("spinbutton");

    expect(input.hasAttribute("required")).toBeTrue();
  });

  /**
   * Esta prueba revisa que el input NO incluya el atributo required
   * cuando required=false.
   */
  it("no debe incluir el atributo required cuando required=false", () => {
    render(
      <InputNumber
        label="Cantidad"
        value={0}
        onChange={() => {}}
        required={false}
      />
    );

    const input = screen.getByRole("spinbutton");

    expect(input.hasAttribute("required")).toBeFalse();
  });

  /**
   * Esta prueba revisa que el input tenga una clase CSS base.
   * Esa clase se utiliza para dar estilo común a todos los inputs numéricos.
   */
  it("debe tener la clase CSS correcta en el input", () => {
    render(<InputNumber label="Cantidad" value={0} onChange={() => {}} />);

    const input = screen.getByRole("spinbutton");

    expect(input.classList.contains("input-base")).toBeTrue();
  });

});