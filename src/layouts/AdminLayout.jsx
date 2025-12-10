// Ruta: src/layouts/AdminLayout.jsx

import AdminNavbar from "../components/atoms/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}