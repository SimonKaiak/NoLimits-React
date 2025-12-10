import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthCTA from "../../components/atoms/AuthCTA.jsx";
import { MemoryRouter } from "react-router-dom";

/**
 * Este archivo contiene pruebas unitarias para el componente AuthCTA.
 * 
 * El componente AuthCTA muestra un mensaje y un botón dependiendo
 * de la ruta actual. Si el usuario está en /login o en /registro,
 * el componente cambia su contenido para guiar al usuario a la otra pantalla.
 * 
 * También permite forzar un modo manual usando la prop "route".
 * 
 * En estas pruebas utilizamos MemoryRouter para simular rutas dentro de los tests.
 */
describe("Atom: AuthCTA", () => {

  /**
   * Esta prueba revisa que cuando la ruta NO es /login ni /registro,
   * el componente no debe mostrar ningún mensaje.
   * 
   * Se usa "queryByText" porque devuelve null cuando el elemento no existe,
   * en lugar de lanzar un error como "getByText".
   */
  it("no debe renderizar nada fuera de /login o /registro", () => {
    render(
      <MemoryRouter initialEntries={["/otra-ruta"]}>
        <AuthCTA />
      </MemoryRouter>
    );

    expect(screen.queryByText("¿No tienes una cuenta?")).toBeNull();
    expect(screen.queryByText("¿Ya tienes una cuenta?")).toBeNull();
  });

  /**
   * Esta prueba revisa que cuando la ruta es /login,
   * el componente debe mostrar el mensaje que invita a registrarse
   * y un botón con el texto "- Regístrate -".
   */
  it("debe mostrar el CTA de login en /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthCTA />
      </MemoryRouter>
    );

    expect(screen.getByText("¿No tienes una cuenta?")).toBeTruthy();
    expect(screen.getByRole("button").textContent.trim()).toBe("- Regístrate -");
  });

  /**
   * Esta prueba revisa que cuando la ruta es /registro,
   * el componente debe mostrar el mensaje que invita a iniciar sesión
   * y un botón con el texto "- Iniciar Sesión -".
   */
  it("debe mostrar el CTA de registro en /registro", () => {
    render(
      <MemoryRouter initialEntries={["/registro"]}>
        <AuthCTA />
      </MemoryRouter>
    );

    expect(screen.getByText("¿Ya tienes una cuenta?")).toBeTruthy();
    expect(screen.getByRole("button").textContent.trim()).toBe("- Iniciar Sesión -");
  });

  /**
   * Esta prueba revisa que se puede forzar de manera manual
   * que el componente se comporte como si la ruta fuera /login,
   * usando la propiedad "route".
   */
  it("debe permitir forzar modo route='login'", () => {
    render(
      <MemoryRouter>
        <AuthCTA route="login" />
      </MemoryRouter>
    );

    expect(screen.getByText("¿No tienes una cuenta?")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que se puede forzar de manera manual
   * que el componente se comporte como si la ruta fuera /registro,
   * usando la propiedad "route".
   */
  it("debe permitir forzar modo route='registro'", () => {
    render(
      <MemoryRouter>
        <AuthCTA route="registro" />
      </MemoryRouter>
    );

    expect(screen.getByText("¿Ya tienes una cuenta?")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que el botón del componente existe
   * y que puede recibir un clic sin producir errores.
   * 
   * Esta prueba no revisa la navegación, solo valida que el evento click
   * se ejecuta sin lanzar excepciones.
   */
  it("el botón debe existir y ser clickeable sin lanzar errores", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthCTA />
      </MemoryRouter>
    );

    const btn = screen.getByRole("button");
    expect(btn).toBeTruthy();

    // Se revisa que hacer clic no genere errores
    expect(() => fireEvent.click(btn)).not.toThrow();
  });

});