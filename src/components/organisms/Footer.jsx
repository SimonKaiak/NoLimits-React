import React from "react";

/**
 * Componente FooterNL
 *
 * Representa el pie de página de la aplicación.
 * Su función principal es mostrar una pequeña frase o "sub-marca"
 * en la parte inferior de la página.
 *
 * Este componente es muy simple:
 *  - No recibe props
 *  - Solo muestra contenido estático
 *  - Usa clases CSS para su estilo
 */
export default function FooterNL() {
    return (
        <footer>
            <nav className="nl-nav1">
                <div className="nl-nav1-inner">

                    {/*
                        Texto mostrado en el footer.
                        "sub-brand" puede estilizarse desde CSS.
                    */}
                    <p id="sub-brand">_.-°-._ All in One _.-°-._</p>

                </div>
            </nav>
        </footer>
    );
}
