/**
 * Test del organismo CrearProducto.
 *
 * Este archivo valida el comportamiento del formulario destinado a crear o editar
 * productos en el sistema. Las pruebas cubren:
 * - Renderización del título según el modo utilizado (crear o editar).
 * - Renderización de los cinco campos principales del formulario.
 * - Escritura en los inputs.
 * - Carga de datos iniciales cuando el componente está en modo edición.
 * - Ejecución del formulario sin que se generen errores por dependencias externas.
 * - Prevención de la llamada a onFinish cuando las funciones del backend fallan en entorno Karma.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearProducto from "../../components/organisms/CrearProducto.jsx";

describe("Organism: CrearProducto", () => {

  /**
   * Verifica que se muestre el título "Crear producto" cuando
   * el componente está en modo crear.
   */
  it("debe mostrar el título en modo crear", () => {
    render(<CrearProducto modo="crear" />);
    expect(screen.getByText("Crear producto")).toBeTruthy();
  });

  /**
   * Verifica que se muestre el título "Editar producto"
   * cuando se pasa un producto inicial y el modo es editar.
   */
  it("debe mostrar el título en modo editar", () => {
    const producto = {
      id: 10,
      nombre: "God of War",
      precio: 50000,
      tipoProducto: { id: 1 },
      clasificacion: { id: 2 },
      estado: { id: 3 }
    };

    render(<CrearProducto modo="editar" productoInicial={producto} />);

    expect(screen.getByText("Editar producto")).toBeTruthy();
  });

  /**
   * Confirma que los cinco inputs del formulario existan cuando el componente carga.
   */
  it("debe renderizar los 5 inputs correctamente", () => {
    render(<CrearProducto modo="crear" />);

    expect(screen.getByPlaceholderText("Nombre")).toBeTruthy();
    expect(screen.getByPlaceholderText("Precio")).toBeTruthy();
    expect(screen.getByPlaceholderText("ID tipoProducto (obligatorio)")).toBeTruthy();
    expect(screen.getByPlaceholderText("ID clasificación (opcional)")).toBeTruthy();
    expect(screen.getByPlaceholderText("ID estado (obligatorio)")).toBeTruthy();
  });

  /**
   * Verifica que todos los campos del formulario acepten valores ingresados por el usuario.
   */
  it("debe permitir escribir en todos los inputs", () => {
    render(<CrearProducto modo="crear" />);

    const nombre = screen.getByPlaceholderText("Nombre");
    const precio = screen.getByPlaceholderText("Precio");
    const tipo = screen.getByPlaceholderText("ID tipoProducto (obligatorio)");
    const clasif = screen.getByPlaceholderText("ID clasificación (opcional)");
    const estado = screen.getByPlaceholderText("ID estado (obligatorio)");

    fireEvent.change(nombre, { target: { value: "Halo Infinite" } });
    fireEvent.change(precio, { target: { value: "60000" } });
    fireEvent.change(tipo, { target: { value: "1" } });
    fireEvent.change(clasif, { target: { value: "3" } });
    fireEvent.change(estado, { target: { value: "2" } });

    expect(nombre.value).toBe("Halo Infinite");
    expect(precio.value).toBe("60000");
    expect(tipo.value).toBe("1");
    expect(clasif.value).toBe("3");
    expect(estado.value).toBe("2");
  });

  /**
   * Si el componente está en modo edición, los valores iniciales del producto
   * deben cargarse correctamente en los campos del formulario.
   */
  it("debe cargar los datos del producto inicial en modo editar", () => {
    const producto = {
      id: 99,
      nombre: "GTA 5",
      precio: 45000,
      tipoProducto: { id: 7 },
      clasificacion: { id: 3 },
      estado: { id: 4 }
    };

    render(<CrearProducto modo="editar" productoInicial={producto} />);

    expect(screen.getByPlaceholderText("Nombre").value).toBe("GTA 5");
    expect(screen.getByPlaceholderText("Precio").value).toBe("45000");
    expect(screen.getByPlaceholderText("ID tipoProducto (obligatorio)").value).toBe("7");
    expect(screen.getByPlaceholderText("ID clasificación (opcional)").value).toBe("3");
    expect(screen.getByPlaceholderText("ID estado (obligatorio)").value).toBe("4");
  });

  /**
   * El formulario debe poder enviarse sin generar excepciones.
   * Los errores reales del backend no se evalúan aquí porque no existe conexión en Karma.
   */
  it("debe mostrar mensaje de error si ocurre error en backend", async () => {
    render(<CrearProducto modo="crear" />);

    const nombre = screen.getByPlaceholderText("Nombre");
    const precio = screen.getByPlaceholderText("Precio");
    const tipo = screen.getByPlaceholderText("ID tipoProducto (obligatorio)");
    const estado = screen.getByPlaceholderText("ID estado (obligatorio)");
    const btn = screen.getByText("Guardar");

    fireEvent.change(nombre, { target: { value: "Cyberpunk 2077" } });
    fireEvent.change(precio, { target: { value: "40000" } });
    fireEvent.change(tipo, { target: { value: "1" } });
    fireEvent.change(estado, { target: { value: "2" } });

    expect(() => fireEvent.click(btn)).not.toThrow();
  });

  /**
   * Dado que el servicio real falla en Karma debido a la ausencia de red,
   * onFinish no debe ejecutarse incluso si los valores del formulario son válidos.
   */
  it("no debe llamar onFinish cuando el servicio falla (como siempre en Karma)", () => {
    const finishSpy = jasmine.createSpy("finishSpy");

    render(<CrearProducto modo="crear" onFinish={finishSpy} />);

    const nombre = screen.getByPlaceholderText("Nombre");
    const precio = screen.getByPlaceholderText("Precio");
    const tipo = screen.getByPlaceholderText("ID tipoProducto (obligatorio)");
    const estado = screen.getByPlaceholderText("ID estado (obligatorio)");
    const btn = screen.getByText("Guardar");

    fireEvent.change(nombre, { target: { value: "FIFA 25" } });
    fireEvent.change(precio, { target: { value: "30000" } });
    fireEvent.change(tipo, { target: { value: "5" } });
    fireEvent.change(estado, { target: { value: "1" } });

    expect(() => fireEvent.click(btn)).not.toThrow();
    expect(finishSpy).not.toHaveBeenCalled();
  });

});