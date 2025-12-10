/**
 * Pruebas del componente NavbarNL.
 *
 * El Navbar cambia dinámicamente según la ruta y el estado del usuario.
 * Este archivo valida:
 *
 * 1. Renderizado del brand principal.
 * 2. Visibilidad del botón "Manual de Usuario" solo en la ruta raíz.
 * 3. Contenido especial en rutas de autenticación (/login, /registro).
 * 4. Botón "Volver" en rutas específicas como /perfil.
 * 5. Ocultamiento de botones en rutas de administración.
 * 6. Mostrar/ocultar el botón "Catálogo" según autenticación del usuario.
 * 7. Validación de que los botones pueden ser presionados sin errores.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavbarNL from "../../components/organisms/Navbar.jsx";

/**
 * Helper para renderizar el Navbar simulando una ruta.
 */
function renderWithRoute(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <NavbarNL />
    </MemoryRouter>
  );
}

describe("Organism: NavbarNL", () => {

  /**
   * El brand debe mostrarse siempre, sin importar la ruta.
   */
  it("debe mostrar el brand siempre", () => {
    renderWithRoute("/");
    expect(screen.getByText("°-._ NoLimits _.-°")).toBeTruthy();
  });

  /**
   * El botón "Manual de Usuario" solo aparece en la ruta '/'.
   */
  it("debe mostrar el botón Manual SOLO en home '/'", () => {
    renderWithRoute("/");
    expect(screen.getByText("- Manual de Usuario -")).toBeTruthy();
  });

  it("no debe mostrar el Manual en otras rutas", () => {
    renderWithRoute("/login");
    expect(screen.queryByText("- Manual de Usuario -")).toBeNull();
  });

  /**
   * En login deben mostrarse los textos de navegación hacia registro.
   */
  it("debe mostrar botones de login/registro en vista de Login", () => {
    renderWithRoute("/login");

    expect(screen.getByText("¿No tienes una cuenta?")).toBeTruthy();
    expect(screen.getByText("- Regístrate -")).toBeTruthy();
  });

  /**
   * En registro deben mostrarse los textos para volver a login.
   */
  it("debe mostrar botones de login desde registro", () => {
    renderWithRoute("/registro");

    expect(screen.getByText("¿Ya tienes una cuenta?")).toBeTruthy();
    expect(screen.getByText("- Iniciar Sesión -")).toBeTruthy();
  });

  /**
   * En /perfil aparece el botón "Volver".
   */
  it("debe mostrar botón Volver en ruta /perfil", () => {
    renderWithRoute("/perfil");

    expect(screen.getByText("- Volver -")).toBeTruthy();
  });

  /**
   * En rutas admin no deben mostrarse botones de inicio/registro.
   */
  it("no debe mostrar botones derechos en rutas admin", () => {
    renderWithRoute("/admin/usuarios");

    const btnIniciar = screen.queryByText("- Iniciar Sesión -");
    const btnRegistro = screen.queryByText("- Registrarse -");

    expect(btnIniciar).toBeNull();
    expect(btnRegistro).toBeNull();
  });

  /**
   * Si el usuario está autenticado (nl_auth=1) debe aparecer "Catálogo".
   */
  it("debe mostrar el botón Catálogo si el usuario está logeado", () => {
    localStorage.setItem("nl_auth", "1");

    renderWithRoute("/home");

    expect(screen.getByText("- Catálogo -")).toBeTruthy();

    localStorage.removeItem("nl_auth");
  });

  /**
   * Si el usuario NO está logeado, "Catálogo" no debe mostrarse.
   */
  it("no debe mostrar Catálogo si el usuario NO está logeado", () => {
    localStorage.removeItem("nl_auth");

    renderWithRoute("/home");

    expect(screen.queryByText("- Catálogo -")).toBeNull();
  });

  /**
   * Validación mínima: presionar un botón no debe lanzar errores.
   * (La navegación real no se prueba aquí).
   */
  it("debe navegar hacia login al presionar botón Iniciar Sesión", () => {
    const { container } = renderWithRoute("/");

    const btn = screen.getByText("- Iniciar Sesión -");

    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});