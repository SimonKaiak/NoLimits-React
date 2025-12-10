import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AdminNavbar from "../../components/atoms/AdminNavbar.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente AdminNavbar.
 * Usamos Testing Library para verificar que el componente muestra ciertos textos
 * y responde a la interacción del usuario, como abrir un menú lateral.
 * 
 * Cada prueba está dentro de un bloque "it", que describe lo que se espera que ocurra.
 */
describe("Atom: AdminNavbar", () => {

  /**
   * Esta prueba revisa que el título principal del navbar ("NoLimits")
   * se muestre correctamente cuando el componente se renderiza.
   */
  it("debe mostrar el título NoLimits", () => {
    // Se renderiza el componente dentro de MemoryRouter, porque usa navegación
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Se busca el texto exacto del título
    const titulo = screen.getByText("°-._ NoLimits _.-°");

    // Se comprueba que el título existe en pantalla
    expect(titulo).toBeTruthy();
  });

  /**
   * Esta prueba revisa que el botón de menú (la hamburguesa) aparezca en pantalla.
   * Este botón abre el menú lateral.
   */
  it("debe mostrar el botón hamburguesa", () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Se busca el símbolo del botón hamburguesa
    const botonHamburguesa = screen.getByText("☰");

    // Se verifica que el botón exista
    expect(botonHamburguesa).toBeTruthy();
  });

  /**
   * Esta prueba revisa que al hacer clic en el botón hamburguesa,
   * el menú lateral se abra y muestre opciones internas,
   * como el botón "Productos".
   */
  it("debe abrir el menú lateral al hacer click en la hamburguesa", () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Se obtiene el botón hamburguesa
    const botonHamburguesa = screen.getByText("☰");

    // Se simula un clic
    fireEvent.click(botonHamburguesa);

    // Ahora debe aparecer la opción "Productos"
    expect(screen.getByText("- Productos -")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que dentro del menú lateral existe un submenú
   * llamado "Catálogos" y que al hacer clic sobre él,
   * se despliegan más opciones, como "Tipos de Producto".
   */
  it("debe abrir el submenú de Catálogos", () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Primero se abre el menú lateral haciendo clic en el botón hamburguesa
    fireEvent.click(screen.getByText("☰"));

    // Luego se hace clic en la opción "Catálogos"
    fireEvent.click(screen.getByText("- Catálogos -"));

    // Ahora debe aparecer la opción del submenú
    expect(screen.getByText("Tipos de Producto")).toBeTruthy();
  });

});