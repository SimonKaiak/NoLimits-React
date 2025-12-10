import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { ButtonAction } from "../../components/atoms/ButtonAction";
import "../../styles/adminCatalogos.css";

/**
 * Página AdminCatalogos
 *
 * Esta página muestra un menú con todos los catálogos disponibles
 * dentro del sistema, para que el administrador pueda gestionarlos.
 *
 * Cada catálogo se representa como un botón, y al hacer clic en uno,
 * el sistema navega hacia su respectiva pantalla de administración.
 *
 * La página está envuelta dentro de AdminLayout para mantener el estilo
 * del panel de administración.
 */
export default function AdminCatalogos() {

  // Hook de navegación de React Router
  const navigate = useNavigate();

  return (
    <AdminLayout>

      {/*
        Título principal de la página
        Explica que estamos en la sección general de catálogos.
      */}
      <h2 className="catalogos-title">Catálogos del Sistema</h2>
      <p className="catalogos-sub">Selecciona un catálogo para gestionarlo.</p>

      {/*
        Grid que contiene todos los botones que representan
        los diferentes catálogos disponibles para administrar.
      */}
      <div className="catalogos-grid">

        {/* Cada botón dirige a una ruta de administración distinta */}
        <ButtonAction
          text="Tipos de Producto"
          onClick={() => navigate("/admin/tipos-producto")}
        />

        <ButtonAction
          text="Clasificaciones"
          onClick={() => navigate("/admin/clasificaciones")}
        />

        <ButtonAction
          text="Estados"
          onClick={() => navigate("/admin/estados")}
        />

        <ButtonAction
          text="Géneros"
          onClick={() => navigate("/admin/generos")}
        />

        <ButtonAction
          text="Plataformas"
          onClick={() => navigate("/admin/plataformas")}
        />

        <ButtonAction
          text="Empresas"
          onClick={() => navigate("/admin/empresas")}
        />

        <ButtonAction
          text="Desarrolladores"
          onClick={() => navigate("/admin/desarrolladores")}
        />

        <ButtonAction
          text="Métodos de Pago"
          onClick={() => navigate("/admin/metodos-pago")}
        />

        <ButtonAction
          text="Métodos de Envío"
          onClick={() => navigate("/admin/metodos-envio")}
        />

        <ButtonAction
          text="Tipos de Empresa"
          onClick={() => navigate("/admin/tipos-empresa")}
        />

        <ButtonAction
          text="Tipos de Desarrollador"
          onClick={() => navigate("/admin/tipos-desarrollador")}
        />

      </div>
    </AdminLayout>
  );
}