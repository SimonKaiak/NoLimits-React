/**
 * Pruebas para el organismo CrearUsuario.
 *
 * Este archivo verifica que el formulario para crear o editar usuarios
 * funcione correctamente en sus aspectos básicos. Las pruebas revisan:
 * - Que los campos requeridos aparezcan en pantalla.
 * - Que los valores escritos en los inputs se almacenen correctamente.
 * - Que el formulario cargue datos previos cuando está en modo edición.
 * - Que el envío del formulario no cause errores dentro del entorno de pruebas.
 *
 * No se prueban llamadas reales al backend debido a que el entorno Karma
 * bloquea dichas peticiones.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CrearUsuario from "../../components/organisms/CrearUsuario.jsx";

describe("Organism: CrearUsuario", () => {

  /**
   * Verifica que todos los campos necesarios aparezcan
   * correctamente cuando el formulario está en modo creación.
   */
  it("debe renderizar todos los inputs requeridos", () => {
    render(<CrearUsuario modo="crear" />);

    // Campos básicos del usuario
    expect(screen.getByPlaceholderText("Nombre")).toBeTruthy();
    expect(screen.getByPlaceholderText("Apellidos")).toBeTruthy();
    expect(screen.getByPlaceholderText("Correo")).toBeTruthy();
    expect(screen.getByPlaceholderText("Teléfono")).toBeTruthy();

    // Contraseña depende del modo, en modo crear aparece esta versión
    expect(screen.getByPlaceholderText("Contraseña (máx 10)")).toBeTruthy();

    // Rol obligatorio
    expect(screen.getByPlaceholderText("ID rol (obligatorio)")).toBeTruthy();
  });

  /**
   * Valida que los inputs actualicen correctamente su valor
   * cuando el usuario escribe en ellos.
   */
  it("debe actualizar los campos cuando se escribe", () => {
    render(<CrearUsuario modo="crear" />);

    const nombre = screen.getByPlaceholderText("Nombre");
    const apellidos = screen.getByPlaceholderText("Apellidos");
    const correo = screen.getByPlaceholderText("Correo");
    const telefono = screen.getByPlaceholderText("Teléfono");
    const password = screen.getByPlaceholderText("Contraseña (máx 10)");
    const rol = screen.getByPlaceholderText("ID rol (obligatorio)");

    fireEvent.change(nombre, { target: { value: "Alex" } });
    fireEvent.change(apellidos, { target: { value: "Lopez" } });
    fireEvent.change(correo, { target: { value: "correo@mail.com" } });
    fireEvent.change(telefono, { target: { value: "987654321" } });
    fireEvent.change(password, { target: { value: "secreto" } });
    fireEvent.change(rol, { target: { value: "2" } });

    expect(nombre.value).toBe("Alex");
    expect(apellidos.value).toBe("Lopez");
    expect(correo.value).toBe("correo@mail.com");
    expect(telefono.value).toBe("987654321");
    expect(password.value).toBe("secreto");
    expect(rol.value).toBe("2");
  });

  /**
   * Valida que el formulario cargue los datos entregados
   * cuando el componente está en modo edición y se recibe
   * un usuarioInicial.
   */
  it("debe cargar datos cuando existe un usuarioInicial (modo editar)", () => {
    const usuarioMock = {
      id: 5,
      nombre: "Carlos",
      apellidos: "Ramirez",
      correo: "carlos@mail.com",
      telefono: "55555",
      rol: { id: 3 }
    };

    render(
      <CrearUsuario modo="editar" usuarioInicial={usuarioMock} />
    );

    expect(screen.getByPlaceholderText("Nombre").value).toBe("Carlos");
    expect(screen.getByPlaceholderText("Apellidos").value).toBe("Ramirez");
    expect(screen.getByPlaceholderText("Correo").value).toBe("carlos@mail.com");
    expect(screen.getByPlaceholderText("Teléfono").value).toBe("55555");
    expect(screen.getByPlaceholderText("ID rol (obligatorio)").value).toBe("3");

    // En modo editar, la contraseña se deja vacía
    const pwd = screen.getByPlaceholderText("Nueva contraseña (opcional)");
    expect(pwd.value).toBe("");
  });

  /**
   * Verifica que el formulario pueda enviarse sin producir
   * errores dentro del entorno de pruebas. No se valida el backend
   * porque las peticiones externas no funcionan en Karma.
   */
  it("debe permitir enviar el formulario sin lanzar errores", () => {
    render(<CrearUsuario modo="crear" />);

    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Maria" }
    });
    fireEvent.change(screen.getByPlaceholderText("Apellidos"), {
      target: { value: "Diaz" }
    });
    fireEvent.change(screen.getByPlaceholderText("Correo"), {
      target: { value: "maria@mail.com" }
    });
    fireEvent.change(screen.getByPlaceholderText("Teléfono"), {
      target: { value: "111111111" }
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña (máx 10)"), {
      target: { value: "123456" }
    });
    fireEvent.change(screen.getByPlaceholderText("ID rol (obligatorio)"), {
      target: { value: "1" }
    });

    const btn = screen.getByText("Guardar");

    // Debe ejecutar sin causar errores
    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});