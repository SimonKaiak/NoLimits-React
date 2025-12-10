import React, { useState } from "react";
import { ForgotPasswordForm } from "../molecules/ForgotPasswordForm";
import avatarImg from "../../assets/img/logos/candado.webp";

/**
 * Componente ForgotPasswordSection
 *
 * Representa la sección principal de la pantalla "Olvidé mi contraseña".
 *
 * Contiene dos partes:
 *  1. Una imagen de un candado que realiza una animación al ser clickeada.
 *  2. El formulario donde el usuario ingresa su correo para recuperar su contraseña.
 */
export const ForgotPasswordSection = () => {

    /**
     * isFlipping:
     * Estado que indica si la animación de giro del candado está activa.
     * - false → la imagen está quieta
     * - true  → la imagen está girando
     */
    const [isFlipping, setIsFlipping] = useState(false);

    /**
     * handleAvatarClick:
     * Se ejecuta cuando el usuario hace click en el candado.
     *
     * Si isFlipping es true, significa que ya está girando,
     * así que no permitimos otra animación para evitar errores visuales.
     *
     * Si isFlipping es false, activamos la animación.
     */
    const handleAvatarClick = () => {
        if (isFlipping) return;
        setIsFlipping(true);
    };

    /**
     * handleAnimationEnd:
     * Se ejecuta cuando la animación del candado termina.
     *
     * Al terminar el giro, isFlipping vuelve a false,
     * permitiendo que el usuario pueda hacer click nuevamente
     * para activar otra animación.
     */
    const handleAnimationEnd = () => {
        setIsFlipping(false);
    };

    /**
     * Render del componente:
     * - Muestra un header con el candado animable.
     * - Muestra el formulario para recuperar la contraseña.
     */
    return (
        <section className="section-forgot-password">

            {/* Encabezado con la imagen animada */}
            <header>
                <div
                    data-testid="image-container"

                    /* Si isFlipping es true, agregamos la clase "backflip"
                       para que se aplique la animación CSS */
                    className={`image-container ${isFlipping ? 'backflip' : ''}`}

                    /* Click que inicia la animación */
                    onClick={handleAvatarClick}

                    /* Evento que detecta cuando termina la animación */
                    onAnimationEnd={handleAnimationEnd}
                >
                    <div className="image">
                        {/* Imagen del candado */}
                        <img 
                            src={avatarImg}
                            className="avatar"
                            alt="candado contraseña"
                        />
                    </div>
                </div>
            </header>

            {/* Contenedor del formulario */}
            <div className="formulario-container" data-testid="form-forgot-password">
                <ForgotPasswordForm />
            </div>

        </section>
    );
};
