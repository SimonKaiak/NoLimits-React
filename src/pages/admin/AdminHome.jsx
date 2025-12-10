// Ruta: src/pages/admin/AdminHome.jsx

import "../../styles/adminHome.css";
import "../../styles/principal.css"; // <-- donde está hero-logo / hero-logo-img
import AdminLayout from "../../layouts/AdminLayout";
import logoNoLimits from "../../assets/img/logos/NoLimits.webp";

export default function AdminHome() {
  return (
    <AdminLayout>
      {/* Contenedor propio del panel admin */}
      <div className="admin-home-container">
        {/* Reutilizamos el mismo bloque que en el hero principal */}
        <div className="hero-logo">
          <img
            src={logoNoLimits}
            alt="NoLimits Panel de Administración"
            className="hero-logo-img"
          />
        </div>
      </div>
    </AdminLayout>
  );
}