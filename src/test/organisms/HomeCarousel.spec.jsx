/**
 * Pruebas del componente HomeCarousel.
 *
 * Este organismo muestra un carrusel estático con 3 diapositivas,
 * cada una con su título e imagen respectiva.
 * 
 * Las pruebas verifican:
 * 
 * 1. Que el carrusel principal se renderice correctamente.
 * 2. Que existan exactamente 3 slides.
 * 3. Que los títulos de cada slide aparezcan en pantalla.
 * 4. Que se rendericen 3 imágenes correspondientes a los slides.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import HomeCarousel from "../../components/organisms/HomeCarousel.jsx";

describe("Organism: HomeCarousel", () => {

  /**
   * Verifica que el componente renderice el contenedor principal
   * identificado por la clase .nl-carousel.
   */
  it("debe renderizar el carrusel", () => {
    const { container } = render(<HomeCarousel />);
    const carousel = container.querySelector(".nl-carousel");

    expect(carousel).toBeTruthy();
  });

  /**
   * Verifica que existan exactamente 3 slides,
   * identificados mediante la clase .carousel-item.
   */
  it("debe renderizar los 3 slides", () => {
    const { container } = render(<HomeCarousel />);

    const items = container.querySelectorAll(".carousel-item");
    expect(items.length).toBe(3);
  });

  /**
   * Verifica que los títulos principales de cada slide
   * aparezcan correctamente en pantalla.
   */
  it("debe mostrar los títulos de cada slide", () => {
    render(<HomeCarousel />);

    expect(screen.getByText("¿Quiénes somos?")).toBeTruthy();
    expect(screen.getByText("Sucursales")).toBeTruthy();
    expect(screen.getByText("Soporte")).toBeTruthy();
  });

  /**
   * Verifica que cada slide muestre una imagen.
   * Se espera un total de 3 imágenes dentro del carrusel.
   * 
   * Nota: la ruta puede ser la misma en los tres slides dependiendo
   * del componente original.
   */
  it("debe mostrar las imágenes del carrusel", () => {
    const { container } = render(<HomeCarousel />);

    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBe(3);

    imgs.forEach((img) => {
      expect(img.src).toContain("/assets/img/carrusel/slide2.webp");
    });
  });

});