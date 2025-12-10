import React, { useState } from "react";
import InputText from ".././components/atoms/InputText";
import { ButtonAction } from "../components/atoms/ButtonAction";
import { actualizarMiPerfil } from ".././services/usuarios";

export default function EditarPerfil({ usuario, onCerrar, onActualizado }) {

    const [form, setForm] = useState({
        nombre: usuario?.nombre || "",
        apellidos: usuario?.apellidos || "",
        correo: usuario?.correo || "",
        telefono: usuario?.telefono || "",
        password: ""   // write-only
    });

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrores((prev) => ({ ...prev, [name]: "" }));
    };

    const validar = () => {
        const err = {};
        let ok = true;

        // Nombre
        if (!form.nombre.trim()) {
            err.nombre = "El nombre no puede estar en blanco";
            ok = false;
        }

        // Apellidos
        if (!form.apellidos.trim()) {
            err.apellidos = "Los apellidos no pueden estar en blanco";
            ok = false;
        }

        // Correo
        if (!form.correo.trim()) {
            err.correo = "El correo es obligatorio";
            ok = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
            err.correo = "Formato de correo inválido";
            ok = false;
        }

        // Teléfono
        if (form.telefono && !/^\d+$/.test(form.telefono)) {
            err.telefono = "El teléfono debe contener solo números";
            ok = false;
        }

        setErrores(err);
        return ok;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;

        // Solo mandamos password si el usuario la escribe
        const payload = {
            nombre: form.nombre.trim(),
            apellidos: form.apellidos.trim(),
            correo: form.correo.trim(),
            telefono: form.telefono.trim(),
            ...(form.password ? { password: form.password } : {}) // write-only
        };

        try {
            await actualizarMiPerfil(usuario.id, payload);
            alert("Perfil actualizado correctamente");

            onActualizado(); // recargar datos del usuario en PerfilUsuario
            onCerrar();      // cerrar modal

        } catch (err) {
            alert("❌ Error al actualizar perfil");
            console.error(err);
        }
    };

    return (
        <div className="modal-bg-perfil">
            <div className="modal-content">

                <h2>Editar Perfil</h2>

                <form onSubmit={handleSubmit}>

                    <InputText 
                        label="Nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        error={errores.nombre}
                    />

                    <InputText 
                        label="Apellidos"
                        name="apellidos"
                        value={form.apellidos}
                        onChange={handleChange}
                        error={errores.apellidos}
                    />

                    <InputText 
                        label="Correo"
                        name="correo"
                        type="email"
                        value={form.correo}
                        onChange={handleChange}
                        error={errores.correo}
                    />

                    <InputText 
                        label="Teléfono"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        error={errores.telefono}
                    />

                    <InputText 
                        label="Contraseña (opcional)"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        error={errores.password}
                    />

                    <div className="modal-buttons">
                        <ButtonAction text="Guardar" type="submit" />
                        <ButtonAction text="Cancelar" onClick={onCerrar} />
                    </div>
                </form>

            </div>
        </div>
    );
}
