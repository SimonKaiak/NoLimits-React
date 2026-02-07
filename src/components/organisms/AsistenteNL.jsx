import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/asistenteNL.css";
import botIcon from "../../assets/img/logos/bot.webp";

const getHelpByPath = (pathname) => {
  // ayudas cortas por pantalla (puedes agregar más)
  if (pathname === "/principal") {
    return {
      title: "Asistente – Catálogo",
      tips: [
        "Usa la búsqueda para encontrar productos más rápido.",
        "En cada producto puedes ver más información y añadir a favoritos.",
        "Si un producto no muestra plataformas, revisa sus datos en detalle.",
      ],
    };
  }

  if (pathname === "/perfil") {
    return {
      title: "Asistente – Perfil",
      tips: [
        "Aquí puedes revisar tus datos de usuario.",
        "En 'Editar perfil' puedes actualizar tu información.",
        "Si no ves cambios, refresca la página e intenta nuevamente.",
      ],
    };
  }

  if (pathname === "/mis-compras") {
    return {
      title: "Asistente – Mis compras",
      tips: [
        "Revisa el historial de compras y el estado de cada orden.",
        "Si una compra no aparece, valida tu sesión (cerrar sesión / iniciar).",
      ],
    };
  }

  // Admin
  if (pathname.startsWith("/admin")) {
    return {
      title: "Asistente – Administración",
      tips: [
        "En Admin puedes gestionar catálogos, productos y ventas.",
        "Si una lista no carga, revisa que tengas rol ADMIN en sesión.",
      ],
    };
  }

  // default
  return {
    title: "Asistente NoLimits",
    tips: [
      "Cuéntame qué te pasó y en qué pantalla estás.",
      "Puedo guiarte con pasos según la sección de la app.",
    ],
  };
};

export default function AsistenteNL() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hola 👋 Soy tu asistente. ¿Qué necesitas hacer?" },
  ]);

  const help = useMemo(() => getHelpByPath(pathname), [pathname]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    // Respuesta local simple (para cumplir la tarea sin backend)
    const reply =
      `Estoy en: ${pathname}\n` +
      `Sugerencia rápida: ${help.tips[0] || "Cuéntame más y te guío."}`;

    setMessages((prev) => [...prev, { role: "bot", text: reply }]);
  };

  return (
    <>
      <button
        className="nl-assist-fab"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir asistente"
        title="Asistente"
      >
        <img
            src={botIcon}
            alt="Logo bot"
            className="nl-assist-icon"
        />
      </button>

      <div className={`nl-assist-panel ${open ? "is-open" : ""}`}>
        <div className="nl-assist-header">
          <div className="nl-assist-title">{help.title}</div>
          <button className="nl-assist-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="nl-assist-context">
          <div className="nl-assist-context-path">Página: {pathname}</div>
          <ul className="nl-assist-tips">
            {help.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="nl-assist-chat">
          {messages.map((m, i) => (
            <div key={i} className={`nl-msg ${m.role === "user" ? "me" : "bot"}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="nl-assist-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu duda..."
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send}>Enviar</button>
        </div>
      </div>
    </>
  );
}