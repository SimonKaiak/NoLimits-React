/**
 * Test del organismo CrearDesarrollador.
 *
 * Se valida:
 * - Renderizado correcto del título según el modo (crear o editar).
 * - Presencia del campo obligatorio "Nombre".
 * - Validaciones de longitud y vacío.
 * - Funcionamiento del checkbox "Activo".
 * - Ejecución correcta de la función onCerrar al cancelar.
 * - Envío del formulario sin errores cuando los datos son válidos.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearDesarrollador from "../../components/organisms/CrearDesarrollador.jsx";

describe("Organism: CrearDesarrollador", () => {

  // Comprueba que el título mostrado corresponde al modo crear.
  it("debe mostrar el título 'Crear Desarrollador' cuando modo='crear'", () => {
    render(<CrearDesarrollador modo="crear" onCerrar={() => {}} />);

    expect(screen.getByText("Crear Desarrollador")).toBeTruthy();
  });

  // Verifica que al estar en modo editar el título cambie correctamente.
  it("debe mostrar el título 'Editar Desarrollador' cuando modo='editar'", () => {
    render(
      <CrearDesarrollador
        modo="editar"
        desarrollador={{ id: 1, nombre: "DevX" }}
        onCerrar={() => {}}
      />
    );

    expect(screen.getByText("Editar Desarrollador")).toBeTruthy();
  });

  // Comprueba que el campo Nombre exista en el formulario.
  it("debe renderizar el campo Nombre", () => {
    render(<CrearDesarrollador modo="crear" onCerrar={() => {}} />);

    const inputNombre = screen.getByLabelText("Nombre");
    expect(inputNombre).toBeTruthy();
  });

  // Verifica la validación del formulario cuando el nombre está vacío.
  it("debe mostrar error si el nombre está vacío al enviar", () => {
    render(<CrearDesarrollador modo="crear" onCerrar={() => {}} />);

    const btnGuardar = screen.getByText("Guardar");
    fireEvent.click(btnGuardar);

    expect(screen.getByText("El nombre no puede estar en blanco")).toBeTruthy();
  });

  // Comprueba que se valide correctamente el límite de 120 caracteres.
  it("debe mostrar error si el nombre supera 120 caracteres", () => {
    render(<CrearDesarrollador modo="crear" onCerrar={() => {}} />);

    const nombre = screen.getByLabelText("Nombre");
    fireEvent.change(nombre, { target: { value: "a".repeat(130) } });

    const btnGuardar = screen.getByText("Guardar");
    fireEvent.click(btnGuardar);

    expect(screen.getByText("Máximo 120 caracteres")).toBeTruthy();
  });

  // Valida el funcionamiento del checkbox Activo, verificando que cambie su estado.
  it("debe permitir activar y desactivar el checkbox 'Activo'", () => {
    render(<CrearDesarrollador modo="crear" onCerrar={() => {}} />);

    const checkbox = screen.getByLabelText("Activo");

    // Estado inicial del checkbox
    expect(checkbox.checked).toBeTrue();

    // Se desactiva
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBeFalse();

    // Se vuelve a activar
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBeTrue();
  });

  // Verifica que al hacer clic en Cancelar se llame la función onCerrar.
  it("debe llamar onCerrar al hacer click en 'Cancelar'", () => {
    const cerrarSpy = jasmine.createSpy("cerrarSpy");

    render(<CrearDesarrollador modo="crear" onCerrar={cerrarSpy} />);

    const btnCancelar = screen.getByText("Cancelar");
    fireEvent.click(btnCancelar);

    expect(cerrarSpy).toHaveBeenCalled();
  });

  // Comprueba que el formulario se pueda enviar sin errores cuando es válido.
  it("el formulario debe ser enviable sin lanzar errores", () => {
    render(<CrearDesarrollador modo="crear" onCerrar={() => {}} />);

    const nombre = screen.getByLabelText("Nombre");
    fireEvent.change(nombre, { target: { value: "Nuevo Dev" } });

    const btnGuardar = screen.getByText("Guardar");

    // Confirma que el envío no cause ninguna excepción.
    expect(() => fireEvent.click(btnGuardar)).not.toThrow();
  });

});