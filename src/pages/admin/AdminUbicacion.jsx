import React, { useEffect, useState } from "react";
import { obtenerRegiones as listarRegiones, crearRegion, editarRegion, eliminarRegion } 
from "../../services/regiones";

import {
  obtenerComunas as listarComunas,
  crearComuna,
  editarComuna,
  eliminarComuna,
} from "../../services/comunas";

import {
  listarDirecciones,
  crearDireccion,
  actualizarDireccion as editarDireccion,
  eliminarDireccion,
} from "../../services/direcciones";

import { ButtonAction } from "../../components/atoms/ButtonAction";

export default function AdminUbicacion() {
  // ============================
  // ESTADOS PARA REGIONES
  // ============================
  const [regiones, setRegiones] = useState([]);
  const [loadingReg, setLoadingReg] = useState(false);
  const [formRegion, setFormRegion] = useState({ nombre: "" });
  const [editandoRegion, setEditandoRegion] = useState(null);

  // ============================
  // ESTADOS PARA COMUNAS
  // ============================
  const [comunas, setComunas] = useState([]);
  const [loadingCom, setLoadingCom] = useState(false);
  const [formComuna, setFormComuna] = useState({ nombre: "", regionId: "" });
  const [editandoComuna, setEditandoComuna] = useState(null);

  // ============================
  // ESTADOS PARA DIRECCIONES
  // ============================
  const [direcciones, setDirecciones] = useState([]);
  const [loadingDir, setLoadingDir] = useState(false);
  const [formDireccion, setFormDireccion] = useState({
    calle: "",
    numero: "",
    complemento: "",
    codigoPostal: "",
    comunaId: "",
    usuarioId: "",
  });

  const [editandoDireccion, setEditandoDireccion] = useState(null);

  // ============================================================
  // CARGAS INICIALES
  // ============================================================
  useEffect(() => {
    cargarRegiones();
    cargarComunas();
    cargarDirecciones();
  }, []);

  // ============================================================
  // CARGAR LISTAS
  // ============================================================
  async function cargarRegiones() {
    setLoadingReg(true);
    const data = await listarRegiones();
    setRegiones(data || []);
    setLoadingReg(false);
  }

  async function cargarComunas() {
    setLoadingCom(true);
    const data = await listarComunas();
    setComunas(data || []);
    setLoadingCom(false);
  }

  async function cargarDirecciones() {
    setLoadingDir(true);
    const data = await listarDirecciones();
    setDirecciones(data || []);
    setLoadingDir(false);
  }

  // ============================================================
  // SUBMIT REGION
  // ============================================================
  async function submitRegion(e) {
    e.preventDefault();

    try {
      if (editandoRegion) {
        await editarRegion(editandoRegion.id, formRegion);
        alert("Región actualizada");
      } else {
        await crearRegion(formRegion);
        alert("Región creada");
      }

      setFormRegion({ nombre: "" });
      setEditandoRegion(null);
      cargarRegiones();
    } catch (err) {
      alert(err.message);
    }
  }

  // ============================================================
  // SUBMIT COMUNA
  // ============================================================
  async function submitComuna(e) {
    e.preventDefault();

    try {
      if (editandoComuna) {
        await editarComuna(editandoComuna.id, formComuna);
        alert("Comuna actualizada");
      } else {
        await crearComuna(formComuna);
        alert("Comuna creada");
      }

      setFormComuna({ nombre: "", regionId: "" });
      setEditandoComuna(null);
      cargarComunas();
    } catch (err) {
      alert(err.message);
    }
  }

  // ============================================================
  // SUBMIT DIRECCION
  // ============================================================
  async function submitDireccion(e) {
    e.preventDefault();

    try {
      if (editandoDireccion) {
        await editarDireccion(editandoDireccion.id, formDireccion);
        alert("Dirección actualizada");
      } else {
        await crearDireccion(formDireccion);
        alert("Dirección creada");
      }

      setFormDireccion({
        calle: "",
        numero: "",
        complemento: "",
        codigoPostal: "",
        comunaId: "",
        usuarioId: "",
      });

      setEditandoDireccion(null);
      cargarDirecciones();
    } catch (err) {
      alert(err.message);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="admin-wrapper admin-ubicacion-container">
        <h1 className="admin-title">Ubicación</h1>

        {/* ============================================================
            BLOQUE REGIONES
        ============================================================ */}
        <div className="admin-block">
            <h2 className="admin-block-title">Regiones</h2>

            <form onSubmit={submitRegion} className="admin-form">

                <input
                    className="admin-input"
                    type="text"
                    placeholder="Nombre de la región"
                    value={formRegion.nombre}
                    onChange={(e) => setFormRegion({ nombre: e.target.value })}
                />

                <ButtonAction
                    text={editandoRegion ? "Actualizar" : "Crear"}
                    type="submit"
                />
            </form>

            {loadingReg ? (
                <p>Cargando regiones...</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {regiones.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.nombre}</td>

                                    <td className="admin-actions">
                                        <ButtonAction
                                            text="Editar"
                                            onClick={() => {
                                                setEditandoRegion(r);
                                                setFormRegion({ nombre: r.nombre });
                                            }}
                                        />
                                        
                                        <ButtonAction
                                            text="Eliminar"
                                            onClick={async () => {
                                                if (!window.confirm("¿Eliminar región?")) return;
                                                try {
                                                    await eliminarRegion(r.id);
                                                    cargarRegiones();
                                                } catch (e) {
                                                    alert(e.message);
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>

        {/* ============================================================
            BLOQUE COMUNAS
        ============================================================ */}
        <div className="admin-block">
            <h2 className="admin-block-title">Comunas</h2>

            <form onSubmit={submitComuna} className="admin-form">
                <input
                    className="admin-input"
                    type="text"
                    placeholder="Nombre de la comuna"
                    value={formComuna.nombre}
                    onChange={(e) =>
                        setFormComuna({ ...formComuna, nombre: e.target.value })
                    }
                />

                <select
                    className="admin-input"
                    value={formComuna.regionId}
                    onChange={(e) =>
                        setFormComuna({ ...formComuna, regionId: e.target.value })
                    }
                >
                    <option value="">Seleccione región</option>
                    {regiones.map((r) => (
                        <option key={r.id} value={r.id}> 
                            {r.nombre}
                        </option>
                    ))}
                </select>

                <ButtonAction
                    text={editandoComuna ? "Actualizar" : "Crear"}
                    type="submit"
                />
            </form>

            {loadingCom ? (
                <p>Cargando comunas...</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Región</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {comunas.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.nombre}</td>
                                    <td>{c.regionNombre}</td>

                                    <td className="admin-actions">

                                        <ButtonAction
                                            text="Editar"
                                            onClick={() => {
                                                setEditandoComuna(c);
                                                setFormComuna({
                                                    nombre: c.nombre,
                                                    regionId: c.regionId,

                                                });
                                            }}
                                        />

                                        <ButtonAction
                                            text="Eliminar"
                                            onClick={async () => {
                                                if (!window.confirm("¿Eliminar comuna?")) return;
                                                try {
                                                    await eliminarComuna(c.id);
                                                    cargarComunas();
                                                } catch (e) {
                                                    alert(e.message);
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>

        {/* ============================================================
            BLOQUE DIRECCIONES
        ============================================================ */}
        <div className="admin-block">
            <h2 className="admin-block-title">Direcciones</h2>

            <form onSubmit={submitDireccion} className="admin-form direcciones-form">
                <input
                    className="admin-input"
                    type="text"
                    placeholder="Calle"
                    value={formDireccion.calle}
                    onChange={(e) =>
                        setFormDireccion({ ...formDireccion, calle: e.target.value })
                    }
                />

                <input
                    className="admin-input"
                    type="text"
                    placeholder="Número"
                    value={formDireccion.numero}
                    onChange={(e) =>
                        setFormDireccion({ ...formDireccion, numero: e.target.value })
                    }
                />

                <input
                    className="admin-input"
                    type="text"
                    placeholder="Complemento"
                    value={formDireccion.complemento}
                    onChange={(e) =>
                        setFormDireccion({
                            ...formDireccion,
                            complemento: e.target.value,
                        })
                    }
                />

                <input
                    className="admin-input"
                    type="text"
                    placeholder="Código postal"
                    value={formDireccion.codigoPostal}
                    onChange={(e) =>
                        setFormDireccion({
                            ...formDireccion,
                            codigoPostal: e.target.value,
                        })
                    }
                />

                <select
                    className="admin-input"
                    value={formDireccion.comunaId}
                    onChange={(e) =>
                        setFormDireccion({
                            ...formDireccion,
                            comunaId: e.target.value,
                        })
                    }
                >

                    <option value="">Seleccione comuna</option>
                    {comunas.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>     
                    ))}
                </select>

                <input
                    className="admin-input"
                    type="number"
                    placeholder="ID Usuario"
                    value={formDireccion.usuarioId}
                    onChange={(e) =>
                        setFormDireccion({
                            ...formDireccion,
                            usuarioId: e.target.value,
                        })
                    }
                />

                <ButtonAction
                    text={editandoDireccion ? "Actualizar" : "Crear"}
                    type="submit"
                />
            </form>

            {loadingDir ? (
                <p>Cargando direcciones...</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>

                                <th>ID</th>
                                <th>Calle</th>
                                <th>Número</th>
                                <th>Comuna</th>
                                <th>Región</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {direcciones.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td>{d.calle}</td>
                                    <td>{d.numero}</td>
                                    <td>{d.comuna}</td>
                                    <td>{d.region}</td>
                                    
                                    <td className="admin-actions">

                                        <ButtonAction
                                            text="Editar"
                                            onClick={() => {
                                                setEditandoDireccion(d);
                                                setFormDireccion({
                                                    calle: d.calle,
                                                    numero: d.numero,
                                                    complemento: d.complemento,
                                                    codigoPostal: d.codigoPostal,
                                                    comunaId:
                                                    comunas.find((c) => c.nombre === d.comuna)?.id || "",
                                                    usuarioId: "",
                                                });
                                            }}
                                        />

                                        <ButtonAction
                                            text="Eliminar"
                                            onClick={async () => {
                                                if (!window.confirm("¿Eliminar dirección?")) return;
                                                try {
                                                    await eliminarDireccion(d.id);
                                                    cargarDirecciones();
                                                } catch (e) {
                                                    alert(e.message);
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}