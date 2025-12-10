/**
 * Test del organismo CrearClasificacion.
 *
 * Este archivo valida:
 * - Renderizado correcto del título según modo (crear o editar).
 * - Existencia de los campos principales.
 * - Validaciones de nombre y descripción.
 * - Cambio del estado del checkbox "Activo".
 * - Ejecución de onCerrar al cancelar.
 * - Envío básico del formulario sin errores.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearClasificacion from "../../components/organisms/CrearClasificacion.jsx";

describe("Organism: CrearClasificacion", () => {

  // Verifica que cuando el modo corresponde a crear,
  // el título mostrado sea "Crear Clasificación".
  it("debe mostrar el título 'Crear Clasificación' cuando modo='crear'", () => {
    render(<CrearClasificacion modo="crear" onCerrar={() => {}} />);
    expect(screen.getByText("Crear Clasificación")).toBeTruthy();
  });

  // Valida que el título cambie correctamente cuando el modo es editar.
  it("debe mostrar el título 'Editar Clasificación' cuando modo='editar'", () => {
    render(
      <CrearClasificacion
        modo="editar"
        clasificacion={{ id: 1, nombre: "Aventura" }}
        onCerrar={() => {}}
      />
    );

    expect(screen.getByText("Editar Clasificación")).toBeTruthy();
  });

  // Comprueba que los campos Nombre y Descripción están presentes en el formulario.
  it("debe renderizar campos de Nombre y Descripción", () => {
    render(<CrearClasificacion modo="crear" onCerrar={() => {}} />);

    // Input asociado a la etiqueta "Nombre".
    const nombre = screen.getByLabelText("Nombre");

    // Se obtiene el textarea manualmente porque no tiene label explícito.
    const descripcion = document.querySelector("textarea");

    expect(nombre).toBeTruthy();
    expect(descripcion).toBeTruthy();
  });

  // Verifica que se muestra un error si se intenta guardar sin nombre.
  it("debe mostrar error si el nombre está vacío al enviar", () => {
    render(<CrearClasificacion modo="crear" onCerrar={() => {}} />);

    const btnGuardar = screen.getByText("Guardar");
    fireEvent.click(btnGuardar);

    expect(screen.getByText("El nombre no puede estar en blanco")).toBeTruthy();
  });

  // Valida que se muestre error cuando el nombre supera el límite de 50 caracteres.
  it("debe mostrar error si el nombre excede 50 caracteres", () => {
    render(<CrearClasificacion modo="crear" onCerrar={() => {}} />);

    const nombre = screen.getByLabelText("Nombre") || screen.getByPlaceholderText("");
    fireEvent.change(nombre, { target: { value: "a".repeat(60) } });

    const btnGuardar = screen.getByText("Guardar");
    fireEvent.click(btnGuardar);

    expect(screen.getByText("Máximo 50 caracteres")).toBeTruthy();
  });

  // Comprueba que el textarea de descripción valide correctamente el límite de 255 caracteres.
  it("debe mostrar error si la descripción excede 255 caracteres", () => {
    render(<CrearClasificacion modo="crear" onCerrar={() => {}} />);

    const textarea = document.querySelector("textarea");
    fireEvent.change(textarea, { target: { value: "b".repeat(300) } });

    const btnGuardar = screen.getByText("Guardar");
    fireEvent.click(btnGuardar);

    expect(
      screen.getByText("La descripción no puede superar los 255 caracteres")
    ).toBeTruthy();
  });

  // Verifica que el checkbox "Activo" pueda cambiar su estado.
  it("debe actualizar el checkbox de activo", () => {
    render(<CrearClasificacion modo="crear" onCerrar={() => {}} />);

    const checkbox = screen.getByLabelText("Activo");

    // Por defecto debe venir marcado.
    expect(checkbox.checked).toBeTrue();

    // Después de hacer click debe desmarcarse.
    fireEvent.click(checkbox);

    expect(checkbox.checked).toBeFalse();
  });

  // Asegura que el botón Cancelar llame la función onCerrar recibida por props.
  it("debe llamar onCerrar cuando se hace click en 'Cancelar'", () => {
    const cerrarSpy = jasmine.createSpy("cerrarSpy");

    render(<CrearClasificacion modo="crear" onCerrar={cerrarSpy} />);

    const btnCancelar = screen.getByText("Cancelar");
    fireEvent.click(btnCancelar);

    expect(cerrarSpy).toHaveBeenCalled();
  });

  // Comprueba que el formulario se puede enviar con datos válidos
  // sin que se generen errores de ejecución.
  it("el formulario debe ser enviable sin lanzar errores (sin mockear servicios)", () => {
    render(<CrearClasificacion modo="crear" onCerrar={() => {}} />);

    const nombre = screen.getByLabelText("Nombre") || screen.getByText("Nombre");
    fireEvent.change(nombre, { target: { value: "Acción" } });

    const btn = screen.getByText("Guardar");

    // Verifica que el click no cause excepciones.
    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});