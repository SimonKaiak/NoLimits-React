import { useEffect, useState } from "react";
import "../styles/perfilUsuario.css";
import { obtenerMiPerfil, actualizarMiPerfil } from "../services/usuarios";

// Componente encargado de mostrar y permitir editar el perfil del usuario logueado.
export default function PerfilUsuario() {
  // Guarda la información completa del usuario obtenida desde el backend.
  const [usuario, setUsuario] = useState(null);

  // Estado que contiene los datos del formulario que el usuario puede modificar.
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    calle: "",
    numero: "",
    complemento: "",
    codigoPostal: "",
    comuna: "",
    region: "",
  });

  // Mensajes informativos que se muestran en pantalla.
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [mensajePass, setMensajePass] = useState("");

  // Al cargar el componente, se obtiene el perfil del usuario desde el backend.
  useEffect(() => {
    obtenerMiPerfil()
      .then((data) => {
        // Se guarda el usuario completo para control general.
        setUsuario(data);

        // Se llena el formulario con los datos recibidos.
        setFormData({
          nombre: data.nombre ?? "",
          apellidos: data.apellidos ?? "",
          correo: data.correo ?? "",
          telefono: data.telefono ?? "",
          calle: data.direccion?.calle ?? "",
          numero: data.direccion?.numero ?? "",
          complemento: data.direccion?.complemento ?? "",
          codigoPostal: data.direccion?.codigoPostal ?? "",
          comuna: data.comunaNombre ?? data.direccion?.comuna?.nombre ?? "",
          region:
            data.regionNombre ??
            data.direccion?.comuna?.region?.nombre ??
            "",
        });
      })
      .catch((e) => {
        // Si ocurre un error, se muestra un mensaje indicando que no se pudo cargar el perfil.
        console.error(e);
        setError("Debes iniciar sesión para ver tu perfil.");
      });
  }, []);

  // Función que actualiza el estado del formulario cada vez que el usuario escribe.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función que se ejecuta al presionar el botón "Guardar cambios".
  // Se encarga de enviar la información actualizada al backend.
  const guardarCambios = async (e) => {
    e.preventDefault();

    // Se arma el objeto que será enviado al backend con los datos editados.
    const payload = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      telefono: formData.telefono ? Number(formData.telefono) : null,
      calle: formData.calle,
      numero: formData.numero,
      complemento: formData.complemento,
      comunaNombre: formData.comuna || null,
      regionNombre: formData.region || null,
    };

    try {
      // Llamada al servicio que actualiza el perfil en la base de datos.
      await actualizarMiPerfil(payload);
      alert("Perfil actualizado correctamente.");
      setMensaje("Perfil actualizado correctamente.");
    } catch (err) {
      // Si ocurre un error, se informa al usuario.
      console.error(err);
      alert("Error al actualizar perfil.");
      setError("Error al actualizar perfil.");
    }
  };

  // Función simulada para solicitar cambio de contraseña.
  // En una implementación real, aquí se podría llamar al backend.
  const solicitarCambioPassword = () => {
    alert(
      `Se ha enviado un correo a ${formData.correo} con instrucciones para cambiar tu contraseña.`
    );
    setMensajePass(
      `Se ha enviado un correo a ${formData.correo} para cambiar tu contraseña.`
    );
  };

  // Mientras se cargan los datos del usuario, se muestra un mensaje.
  if (!usuario && !error) {
    return <p className="perfil-loading">Cargando perfil...</p>;
  }

  // Si existe un error, se muestra directamente.
  if (error) {
    return <p className="perfil-msg-error">{error}</p>;
  }

  // Render principal del formulario de perfil.
  return (
    <main className="perfil-page">
      <section className="perfil-card">
        <h2 className="perfil-title">Mi Perfil</h2>

        {/* Sección de mensajes informativos */}
        {(mensaje || mensajePass || error) && (
          <div className="perfil-alerts">
            {mensaje && <p className="perfil-msg">{mensaje}</p>}
            {mensajePass && (
              <p className="perfil-msg perfil-msg-pass">{mensajePass}</p>
            )}
            {error && <p className="perfil-msg-error">{error}</p>}
          </div>
        )}

        {/* Formulario principal del perfil */}
        <form className="perfil-form" onSubmit={guardarCambios}>
          <div className="perfil-row-principal">
            
            {/* Columna izquierda: datos personales */}
            <div className="perfil-col-datos">
              <h3 className="perfil-subtitle">Datos personales</h3>

              <div className="perfil-grid-dos">
                <div className="perfil-field">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="perfil-field">
                  <label>Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                  />
                </div>

                <div className="perfil-field">
                  <label>Correo</label>
                  {/* El correo no se puede modificar */}
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    disabled
                  />
                </div>

                <div className="perfil-field">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Botón para solicitar cambio de contraseña */}
              <div className="perfil-cambiar-pass-left">
                <button
                  type="button"
                  className="perfil-btn perfil-btn-secundario"
                  onClick={solicitarCambioPassword}
                >
                  Cambiar contraseña
                </button>
              </div>
            </div>

            {/* Columna derecha: datos de dirección */}
            <div className="perfil-col-direccion">
              <h3 className="perfil-subtitle">Dirección</h3>

              <div className="perfil-grid-tres-vertical">
                <div className="perfil-field">
                  <label>Calle</label>
                  <input
                    type="text"
                    name="calle"
                    value={formData.calle}
                    onChange={handleChange}
                  />
                </div>

                <div className="perfil-field">
                  <label>Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                  />
                </div>

                <div className="perfil-field">
                  <label>Complemento</label>
                  <input
                    type="text"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botón central para guardar los cambios */}
          <div className="perfil-actions-center">
            <button type="submit" className="perfil-btn">
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}