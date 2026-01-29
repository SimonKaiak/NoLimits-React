import React from "react";
import { Carousel } from 'react-bootstrap';

/**
 * Componente HomeCarousel
 *
 * Muestra un carrusel (slider) de imágenes en la página principal.
 * Cada diapositiva incluye:
 *  - Una imagen de fondo
 *  - Un texto o bloque informativo
 *
 * Usa el componente Carousel de react-bootstrap para manejar:
 *  - El cambio automático de imágenes
 *  - Animaciones internas
 *  - Controles predeterminados (que aquí se desactivan)
 */
export default function HomeCarousel() {
    return (
        <div className="nl-carousel">

            {/*
                Carousel:
                - interval={4000} → cambia cada 4 segundos
                - pause={false} → no se detiene al pasar el mouse
                - controls={false} → oculta flechas de navegación
                - indicators={false} → oculta puntos inferiores
            */}
            <Carousel
                interval={6000}
                pause={false}
                controls={true}
                indicators={false}
            >

                {/* -------------------------------------------------- */}
                {/* Slide 1 */}
                {/* -------------------------------------------------- */}
                <Carousel.Item>

                    {/* Imagen de fondo que ocupa todo el ancho */}
                    <img
                        className="d-block w-100"
                        src="/assets/img/carrusel/slide2.webp"
                        alt="slide 1"
                    />

                    {/* Contenedor del texto que va sobre la imagen */}
                    <div className="nl-slide-caption">
                        <div>
                            <h2 className="titulo-carrusel">¿Quiénes somos?</h2>

                            <p className="nosotros-texto">
                                <strong>
                                    NoLimits es una plataforma All-in-One diseñada para centralizar todo tu entretenimiento en un solo lugar: películas, videojuegos y accesorios.
                                </strong>
                            </p>
                        </div>
                    </div>

                </Carousel.Item>


                {/* -------------------------------------------------- */}
                {/* Slide 2 */}
                {/* -------------------------------------------------- */}
                <Carousel.Item>

                    <img
                        className="d-block w-100"
                        src="/assets/img/carrusel/slide2.webp"
                        alt="slide 2"
                    />

                    <div className="nl-slide-caption">
                        <div>
                            <h2 className="titulo-carrusel">¿Por qué NoLimits?</h2>

                            <p className="nosotros-texto1">
                                <strong>
                                    Porque ya no necesitas visitar múltiples sitios.
                                    En NoLimits encuentras todo tu entretenimiento organizado en un solo lugar.
                                </strong>
                            </p>
                        </div>
                    </div>

                </Carousel.Item>


                {/* -------------------------------------------------- */}
                {/* Slide 3 */}
                {/* -------------------------------------------------- */}
                <Carousel.Item>

                    <img
                        className="d-block w-100"
                        src="/assets/img/carrusel/slide2.webp"
                        alt="slide 3"
                    />

                    <div className="nl-slide-caption">
                        <div>
                            <h2 className="titulo-carrusel">Soporte</h2>

                            <p className="soporte-texto">
                                <strong>¿Tienes dudas o problemas?</strong><br />
                                <strong>Escríbenos al correo: </strong>
                                <strong>NoLimits@gmail.com</strong>
                            </p>
                        </div>
                    </div>

                </Carousel.Item>

            </Carousel>
        </div>
    );
}
