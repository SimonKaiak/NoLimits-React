import React, { useState } from "react";
import { PaymentMethodList } from "../molecules/PaymentMethodList";
import { ButtonSubmit } from "../atoms/ButtonSubmit";
import "../../styles/paymentMethodCard.css";
import { useNavigate } from "react-router-dom";
import { ButtonAction } from "../atoms/ButtonAction";
import { crearVenta } from "../../services/ventas";

// Componente que se encarga de todo el flujo de pago.
// Recibe por props el objeto "pago", que trae el total a pagar.
export const PaymentSection = ({ pago }) => {
  // Guarda el método de pago seleccionado (tarjetas, onepay, etc.).
  const [metodo, setMetodo] = useState(null);
  // Guarda el número de tarjeta escrito por el usuario.
  const [tarjeta, setTarjeta] = useState("");
  // Guarda la fecha de vencimiento de la tarjeta (formato MM/AA).
  const [vencimiento, setVencimiento] = useState("");
  // Guarda el PIN que se usa cuando el método es OnePay.
  const [onepayPin, setOnePayPin] = useState("");
  // Controla si el PIN se muestra como texto o se oculta.
  const [mostrarPin, setMostrarPin] = useState(false);
  // Navegación entre pantallas después de completar el pago.
  const navigate = useNavigate();

  // Función principal que se ejecuta cuando el usuario hace clic en "Pagar ahora".
  const handlePagar = async () => {
    // Si no se ha elegido un método de pago, no se puede continuar.
    if (!metodo) {
      alert("Debes seleccionar un método de pago");
      return;
    }

    // Validaciones según el método de pago escogido.
    // Primero validamos los datos cuando el usuario paga con tarjeta.
    if (metodo === "tarjetas") {
      // Validamos que el número de tarjeta tenga al menos 16 dígitos reales.
      if (!tarjeta || tarjeta.replace(/\s/g, "").length < 16) {
        alert("Número de tarjeta inválido");
        return;
      }

      // Validamos que la fecha de vencimiento tenga el formato correcto.
      if (!vencimiento || vencimiento.length !== 5) {
        alert("Debes ingresar la fecha de vencimiento (MM/AA)");
        return;
      }

      // Separamos mes y año a partir del texto que escribió el usuario.
      const [mm, yy] = vencimiento.split("/").map(Number);
      const hoy = new Date();
      // Tomamos los últimos dos dígitos del año actual.
      const currentYear = hoy.getFullYear() % 100;
      const currentMonth = hoy.getMonth() + 1;

      // Verificamos que el mes esté dentro del rango válido.
      if (mm < 1 || mm > 12) {
        alert("El mes de vencimiento es inválido");
        return;
      }

      // Verificamos que la tarjeta no esté vencida comparando con la fecha actual.
      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        alert("La tarjeta está vencida");
        return;
      }
    }

    // Si el método es OnePay, solo revisamos que el PIN tenga 5 dígitos.
    if (metodo === "onepay") {
      if (onepayPin.length !== 5) {
        alert("El PIN de OnePay debe tener 5 dígitos");
        return;
      }
    }

    try {
      // A partir de aquí se arma la venta real que se enviará al backend.

      // Tomamos el carrito guardado en el navegador.
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      // Si el carrito está vacío, no tiene sentido intentar pagar.
      if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      // Obtenemos el usuario actual, que se guardó al iniciar sesión.
      const user = JSON.parse(localStorage.getItem("nl_user") || "null");
      if (!user?.id) {
        alert("Debes iniciar sesión para completar la compra.");
        return;
      }

      // Convertimos el método de pago seleccionado en un ID real para la base de datos.
      const metodoPagoId =
        metodo === "tarjetas" ? 1 :
        metodo === "onepay"   ? 2 :
        3; // En este caso, 3 sería para otras billeteras o métodos.

      // Estos IDs son valores por defecto para método de envío y estado de la venta.
      // Se pueden ajustar según los datos reales de la base de datos.
      const metodoEnvioId = 1; // Ejemplo: "Retiro en tienda".
      const estadoId      = 1; // Ejemplo: "PENDIENTE".

      // Aquí armamos el objeto completo que se enviará al backend.
      const payload = {
        usuarioId: user.id,
        metodoPagoId,
        metodoEnvioId,
        estadoId,
        totalVenta: pago.total,
        // Por cada producto del carrito, armamos un detalle de la venta.
        detalles: carrito.map((item) => ({
          productoId: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
        })),
      };

      console.log("[PaymentSection] Payload venta:", payload);

      // Llamamos al servicio que crea la venta en el backend.
      const ventaCreada = await crearVenta(payload);
      console.log("[PaymentSection] Venta creada:", ventaCreada);

      // Con la venta ya creada, guardamos un resumen simple para el comprobante.
      const compraRealizada = {
        ventaId: ventaCreada?.id,
        fecha: new Date().toLocaleString("es-CL"),
        precio: pago.total,
        productos: carrito.map((item) => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
        })),
      };

      // Guardamos la compra en localStorage para mostrarla luego en la pantalla de comprobante.
      localStorage.setItem("compra", JSON.stringify(compraRealizada));

      // Limpiamos el carrito y el total, ya que la compra se completó.
      localStorage.removeItem("carrito");
      localStorage.removeItem("totalCompra");

      // Enviamos al usuario a la pantalla donde verá su comprobante.
      navigate("/comprobante");
    } catch (error) {
      // Si algo falla al registrar la venta, mostramos un mensaje de error.
      console.error("Error al registrar venta:", error);
      alert("No se pudo completar la compra.");
    }
  };

  // Aquí se define lo que se muestra en pantalla.
  return (
    <div className="payment-container">
      <div className="info-box">
        {/* Muestra el total que el usuario va a pagar. */}
        <h2>Estás pagando</h2>
        <p className="producto-nombre">Total a pagar</p>
        <p className="monto">
          ${pago.total.toLocaleString("es-CL")}
        </p>
      </div>

      <h3>Selecciona tu método de pago</h3>

      <div className="payment-row">
        {/* Columna izquierda: lista de métodos de pago disponibles. */}
        <div className="payment-col payment-col-left">
          <PaymentMethodList selected={metodo} onSelect={setMetodo} />
        </div>

        {/* Columna derecha: formulario que cambia según el método elegido. */}
        <div
          className={`payment-col payment-col-right ${
            metodo === "onepay" ? "onepay-active" : ""
          }`}
        >
          {/* Si el usuario eligió tarjeta, mostramos los campos de tarjeta. */}
          {metodo === "tarjetas" && (
            <>
              <label>Número de Tarjeta</label>
              <input
                className="input-tarjeta"
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19}
                value={tarjeta}
                onChange={(e) => {
                  // Limpiamos todo lo que no sea número y dejamos máximo 16 dígitos.
                  const cleaned = e.target.value.replace(/\D/g, "").slice(0, 16);
                  // Formateamos el número en grupos de 4 separados por espacio.
                  const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
                  setTarjeta(formatted);
                }}
              />

              <label>Fecha de vencimiento (MM/AA)</label>
              <input
                className="input-tarjeta"
                type="text"
                placeholder="MM/AA"
                maxLength={5}
                value={vencimiento}
                onChange={(e) => {
                  // Solo dejamos números y máximo 4 dígitos para luego armar MM/AA.
                  let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (val.length >= 3) {
                    // Insertamos la barra después de los dos primeros dígitos.
                    val = val.slice(0, 2) + "/" + val.slice(2);
                  }
                  setVencimiento(val);
                }}
              />
            </>
          )}

          {/* Si el usuario eligió OnePay, mostramos el campo para el PIN. */}
          {metodo === "onepay" && (
            <>
              <label>PIN de OnePay</label>
              <div className="pin-wrapper">
                <input
                  className="input-tarjeta"
                  type={mostrarPin ? "text" : "password"}
                  placeholder="Ingresa tu PIN"
                  maxLength={5}
                  value={onepayPin}
                  onChange={(e) => {
                    // Solo guardamos números y máximo 5 dígitos para el PIN.
                    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 5);
                    setOnePayPin(cleaned);
                  }}
                />

                {/* Botón para alternar entre mostrar u ocultar el PIN. */}
                <ButtonAction
                  text={mostrarPin ? "🙈" : "👁️"}
                  variant="icon"
                  onClick={() => setMostrarPin(!mostrarPin)}
                  className="btn-ver-pin"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Botón final que dispara todo el proceso de validación y creación de la venta. */}
      <ButtonSubmit
        text="Pagar ahora"
        onClick={handlePagar}
        className="btn-pagar-ahora"
      />
    </div>
  );
};