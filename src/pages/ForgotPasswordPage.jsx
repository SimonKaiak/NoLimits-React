// Ruta: src/pages/ForgotPasswordPage.jsx
/**
 * Página: ForgotPasswordPage
 * -------------------------------------------------------
 * Esta página muestra la sección completa para recuperar
 * la contraseña:
 *
 *  - Navbar superior
 *  - Sección "ForgotPasswordSection" (organism)
 *  - Footer inferior
 *
 * Usa la clase "nl-full-page-layout" para respetar el
 * layout global del sistema NoLimits.
 */

import React from "react";
import { ForgotPasswordSection } from "../components/organisms/ForgotPasswordSection";
import "../styles/olvideMiContrasenia.css";
import Footer from "../components/organisms/Footer.jsx";
import Navbar from "../components/organisms/Navbar.jsx";

export const ForgotPasswordPage = () => {
    return (
        <div className="nl-full-page-layout no-dark-overlay">
            
            {/* Navbar superior */}
            <Navbar />

            {/* Contenido principal */}
            <ForgotPasswordSection />

            {/* Footer inferior */}
            <Footer />
        </div>
    );
};
