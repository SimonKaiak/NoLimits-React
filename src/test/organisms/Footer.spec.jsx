/**
 * Pruebas del componente FooterNL.
 *
 * Este archivo valida el correcto funcionamiento del pie de página de la aplicación.
 *
 * El Footer es un componente visual simple que debería:
 *
 * 1. Renderizar correctamente un elemento <footer>.
 * 2. Mostrar el texto relacionado con la identidad secundaria de la marca.
 * 3. Incluir un elemento con id="sub-brand" que contiene el texto "All in One".
 *
 * Estas pruebas se centran únicamente en verificar la estructura y el
 * contenido estático del componente, ya que no posee lógica o interactividad.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import FooterNL from "../../components/organisms/Footer.jsx";

describe("Atom: FooterNL", () => {

  /**
   * Verifica que el componente renderice un tag <footer>.
   * Este tag es detectado por el role "contentinfo".
   */
  it("debe renderizar el footer correctamente", () => {
    render(<FooterNL />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeTruthy();
  });

  /**
   * Verifica que el texto "All in One" se encuentre dentro del footer.
   * Este texto representa la sub-brand del proyecto.
   */
  it("debe contener el texto de sub-brand", () => {
    render(<FooterNL />);

    expect(screen.getByText(/All in One/i)).toBeTruthy();
  });

  /**
   * Verifica que exista un elemento con id="sub-brand".
   * Luego confirma que dicho elemento contenga el texto esperado.
   */
  it("debe contener el elemento con id 'sub-brand'", () => {
    const { container } = render(<FooterNL />);

    const subBrand = container.querySelector("#sub-brand");
    expect(subBrand).toBeTruthy();
    expect(subBrand.textContent).toContain("All in One");
  });

});