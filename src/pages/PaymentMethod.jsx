import React from "react";
import Footer from "../components/organisms/Footer.jsx";
import Navbar from "../components/organisms/Navbar.jsx";
import { PaymentSection } from "../components/organisms/PaymentSection.jsx";
import "../styles/paymentMethodCard.css";

/**
 * Página que muestra el método de pago.
 * 
 * Esta página reúne:
 * - El Navbar superior
 * - La sección de pago (PaymentSection)
 * - El Footer inferior
 * 
 * Aquí se preparan los datos del pago usando el contenido del carrito 
 * almacenado en localStorage.
 */
const PaymentMethod = () => {

  /**
   * Recuperamos el total guardado en localStorage.
   * Se guarda cuando el usuario llega a la pantalla de pago.
   * Si no existe, usamos 0 para evitar errores.
   */
  const storedTotal = localStorage.getItem("totalCompra");
  const total = storedTotal ? Number(storedTotal) : 0;

  /**
   * Obtenemos los productos guardados en el carrito.
   * Se almacena un arreglo con todos los productos seleccionados.
   */
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  /**
   * Formateamos los productos para enviarlos al comprobante o al backend.
   * Cada producto mantiene:
   * - nombre: dependiendo de cómo venga en el carrito
   * - cantidad: si no existe, asumimos 1
   */
  const productos = carrito.map(item => ({
    nombre: item.nombre || item.titulo || item.producto,
    cantidad: item.cantidad || 1
  }));

  /**
   * Objeto final que se envía a PaymentSection.
   * Puede incluir más campos dependiendo de la lógica de tu backend.
   */
  const pago = {
    total,
    correoUsuario: "usuario@gmail.com",   // Se reemplaza por el correo real luego del login
    productos
  };

  return (
    <>
      {/* Barra superior */}
      <Navbar />

      {/* Contenido principal de pago */}
      <div className="payment-page">
        <PaymentSection pago={pago} />
      </div>

      {/* Pie de página */}
      <Footer />
    </>
  );
};

export default PaymentMethod;
