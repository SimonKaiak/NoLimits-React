import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectBase from "../../components/atoms/SelectBase.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente SelectBase.
 *
 * SelectBase es un componente que renderiza un menú desplegable <select>.
 * Puede recibir:
 * - un label
 * - un valor inicial
 * - una lista de opciones
 * - un indicador de campo obligatorio
 * - un evento onChange para detectar cambios
 * 
 * Las pruebas verifican que el componente muestre su contenido correctamente,
 * que responda a la interacción del usuario y que los atributos HTML sean aplicados.
 */
describe("Atom: SelectBase", () => {

  /**
   * Esta prueba revisa que el label se renderice correctamente
   * cuando se envía mediante las propiedades del componente.
   */
  it("debe renderizar el label correctamente", () => {
    render(
      <SelectBase
        label="Tipo de Producto"
        value=""
        onChange={() => {}}
        options={[]}
      />
    );

    expect(screen.getByText("Tipo de Producto")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que cuando required=true,
   * el componente agregue un asterisco al texto del label
   * indicando que el campo es obligatorio.
   */
  it("debe mostrar asterisco cuando required=true", () => {
    render(
      <SelectBase
        label="Categoría"
        value=""
        onChange={() => {}}
        options={[]}
        required={true}
      />
    );

    expect(screen.getByText("Categoría *")).toBeTruthy();
  });

  /**
   * Esta prueba verifica que el elemento <select> se renderice correctamente.
   * El rol "combobox" identifica elementos select en Testing Library.
   */
  it("debe renderizar el select", () => {
    render(
      <SelectBase
        label="Estado"
        value=""
        onChange={() => {}}
        options={[]}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeTruthy();
  });

  /**
   * Esta prueba revisa que el componente siempre incluya
   * una opción por defecto llamada "Seleccionar...".
   */
  it("debe renderizar la opción por defecto 'Seleccionar...'", () => {
    render(
      <SelectBase
        label="Estado"
        value=""
        onChange={() => {}}
        options={[]}
      />
    );

    expect(screen.getByText("Seleccionar...")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que las opciones entregadas en la propiedad "options"
   * se rendericen correctamente dentro del select.
   */
  it("debe renderizar las opciones enviadas como props", () => {
    const opciones = [
      { id: 1, nombre: "Activo" },
      { id: 2, nombre: "Inactivo" },
    ];

    render(
      <SelectBase
        label="Estado"
        value=""
        onChange={() => {}}
        options={opciones}
      />
    );

    expect(screen.getByText("Activo")).toBeTruthy();
    expect(screen.getByText("Inactivo")).toBeTruthy();
  });

  /**
   * Esta prueba verifica que al cambiar la selección del menú,
   * se llame correctamente a la función onChange.
   */
  it("debe ejecutar onChange al seleccionar una opción", () => {
    const changeSpy = jasmine.createSpy("changeSpy");

    render(
      <SelectBase
        label="Estado"
        value=""
        onChange={changeSpy}
        options={[
          { id: 1, nombre: "Activo" },
          { id: 2, nombre: "Inactivo" },
        ]}
      />
    );

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "2" } });

    expect(changeSpy).toHaveBeenCalled();
  });

  /**
   * Esta prueba revisa que el elemento <select> tenga la clase "input-base",
   * que se usa para aplicar estilos base a los select de la aplicación.
   */
  it("debe aplicar clase CSS 'input-base' al select", () => {
    render(
      <SelectBase
        label="Estado"
        value=""
        onChange={() => {}}
        options={[]}
      />
    );

    const select = screen.getByRole("combobox");

    expect(select.classList.contains("input-base")).toBeTrue();
  });

  /**
   * Esta prueba revisa que el atributo HTML "required" se aplique
   * cuando la propiedad required=true.
   */
  it("debe aplicar required cuando required=true", () => {
    render(
      <SelectBase
        label="Estado"
        value=""
        onChange={() => {}}
        options={[]}
        required={true}
      />
    );

    const select = screen.getByRole("combobox");

    expect(select.hasAttribute("required")).toBeTrue();
  });

  /**
   * Esta prueba revisa que el atributo "required" NO se aplique
   * cuando required=false.
   */
  it("no debe aplicar required cuando required=false", () => {
    render(
      <SelectBase
        label="Estado"
        value=""
        onChange={() => {}}
        options={[]}
        required={false}
      />
    );

    const select = screen.getByRole("combobox");

    expect(select.hasAttribute("required")).toBeFalse();
  });

});