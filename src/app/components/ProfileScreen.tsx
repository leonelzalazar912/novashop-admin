import { useState } from "react";
import {
  Gamepad2,
  Trophy,
  Clock,
  Star,
  ShoppingCart,
  Bell,
  LogOut,
  Users,
  TrendingUp,
  ChevronRight,
  Zap,
  Shield,
  Sword,
} from "lucide-react";

interface Props {
  onGoLogin: () => void;
  onGoHome: () => void;
}

const JUEGOS = [
  {
    id: 1,
    title: "Void Protocol",
    genero: "RPG de Acción",
    horas: 247,
    progreso: 78,
    ultimaVez: "Hace 2 horas",
    bg: "linear-gradient(135deg, #1a0a40, #2d1070)",
    icon: <Sword size={20} color="#6A3CE6" />,
    rating: 4.8,
    precio: 29.99,
  },
  {
    id: 2,
    title: "Neon Siege",
    genero: "Estrategia",
    horas: 89,
    progreso: 45,
    ultimaVez: "Ayer",
    bg: "linear-gradient(135deg, #0a1a40, #103060)",
    icon: <Shield size={20} color="#3CE6B0" />,
    rating: 4.5,
    precio: 19.99,
  },
  {
    id: 3,
    title: "Phantom Rush",
    genero: "Carreras",
    horas: 312,
    progreso: 92,
    ultimaVez: "Hace 3 días",
    bg: "linear-gradient(135deg, #1a0a20, #401060)",
    icon: <Zap size={20} color="#E63CA0" />,
    rating: 4.9,
    precio: 24.99,
  },
  {
    id: 4,
    title: "Cyber Nexus",
    genero: "Disparos",
    horas: 56,
    progreso: 31,
    ultimaVez: "Hace 1 semana",
    bg: "linear-gradient(135deg, #0a1810, #106030)",
    icon: <Gamepad2 size={20} color="#3CE66A" />,
    rating: 4.3,
    precio: 34.99,
  },
];

const LOGROS = [
  { label: "Primera Sangre", desc: "Ganá tu primera partida", obtenido: true },
  { label: "Leyenda", desc: "Alcanzá el rango Platino", obtenido: true },
  { label: "Demonio de Velocidad", desc: "Terminá una carrera en menos de 2 min", obtenido: true },
  { label: "Completista", desc: "Completá al 100% todas las misiones", obtenido: false },
  { label: "Alma Social", desc: "Uníte a 10 gremios", obtenido: false },
];

const PESTANAS = ["Biblioteca", "Logros", "Actividad", "Amigos"];

export function ProfileScreen({ onGoLogin, onGoHome }: Props) {
  const [pestanaActiva, setPestanaActiva] = useState("Biblioteca");

  return (
    <div className="min-h-screen" style={{ background: "#0D0E12" }}>
      {/* Barra superior */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(13,14,18,0.95)",
          borderBottom: "1px solid rgba(106,60,230,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 36, height: 36, background: "#6A3CE6" }}
          >
            <Gamepad2 size={18} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#E8E9F0",
            }}
          >
            PIXELVAULT
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {["Tienda", "Biblioteca", "Comunidad", "Novedades"].map((item) => (
            <button
              key={item}
  onClick={() => {
    if (item === "Tienda") onGoHome();
  }}
              className="px-4 py-2 rounded-md transition-all duration-200"
                onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(106,60,230,0.15)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "none";
  }}
              style={{
                background: "none",
                border: "none",
                color: "#6B6E85",
                cursor: "pointer",
                fontSize: 13,
                letterSpacing: "0.04em",
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="relative flex items-center justify-center rounded-lg transition-all duration-200"
            style={{
              width: 36,
              height: 36,
              background: "#181A24",
              border: "1px solid rgba(106,60,230,0.2)",
              cursor: "pointer",
              color: "#B0B3C6",
            }}
          >
            <Bell size={15} />
            <span
              className="absolute flex items-center justify-center rounded-full"
              style={{
                width: 16,
                height: 16,
                background: "#6A3CE6",
                top: -4,
                right: -4,
                fontSize: 9,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              3
            </span>
          </button>
          <button
            onClick={onGoLogin}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
            style={{
              background: "#181A24",
              border: "1px solid rgba(106,60,230,0.2)",
              color: "#B0B3C6",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Hero de perfil */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #181A24 0%, #1a1040 100%)",
            border: "1px solid rgba(106,60,230,0.2)",
          }}
        >
          <div
            className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ width: 300, height: 300, background: "#6A3CE6", top: -80, right: -40 }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(106,60,230,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(106,60,230,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{
                  width: 90,
                  height: 90,
                  background: "linear-gradient(135deg, #6A3CE6, #3C6AE6)",
                  boxShadow: "0 0 32px rgba(106,60,230,0.5)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  CS
                </span>
              </div>
              <div
                className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full"
                style={{ width: 22, height: 22, background: "#22c55e", border: "2px solid #0D0E12" }}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#E8E9F0",
                  }}
                >
                  CyberSlayer9000
                </h1>
                <span
                  className="px-2 py-1 rounded"
                  style={{ background: "rgba(106,60,230,0.2)", color: "#6A3CE6", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}
                >
                  PLATINO
                </span>
              </div>
              <p style={{ color: "#6B6E85", fontSize: 13, marginBottom: 16 }}>
                Miembro desde marzo 2022 · Buenos Aires, Argentina
              </p>
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: <Gamepad2 size={14} />, val: "4 juegos", label: "Biblioteca" },
                  { icon: <Clock size={14} />, val: "704 hs", label: "Jugadas" },
                  { icon: <Trophy size={14} />, val: "147", label: "Logros" },
                  { icon: <Users size={14} />, val: "38", label: "Amigos" },
                ].map(({ icon, val, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span style={{ color: "#6A3CE6" }}>{icon}</span>
                    <div>
                      <div style={{ color: "#E8E9F0", fontSize: 13, fontWeight: 600 }}>{val}</div>
                      <div style={{ color: "#6B6E85", fontSize: 11 }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
          </div>
        </div>

        {/* Barra de XP */}
        <div
          className="rounded-xl px-6 py-4 mb-6 flex items-center gap-4"
          style={{ background: "#181A24", border: "1px solid rgba(106,60,230,0.15)" }}
        >
          <TrendingUp size={16} color="#6A3CE6" />
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span style={{ fontSize: 12, color: "#B0B3C6", letterSpacing: "0.05em" }}>NIVEL 42 — SIGUIENTE NIVEL</span>
              <span style={{ fontSize: 12, color: "#6A3CE6", fontFamily: "'JetBrains Mono', monospace" }}>7.240 / 10.000 XP</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#1E2030" }}>
              <div
                className="rounded-full h-full transition-all duration-700"
                style={{ width: "72.4%", background: "linear-gradient(90deg, #6A3CE6, #9060f0)" }}
              />
            </div>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex gap-1 mb-6">
          {PESTANAS.map((tab) => (
            <button
              key={tab}
              onClick={() => setPestanaActiva(tab)}
              className="px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                background: pestanaActiva === tab ? "#6A3CE6" : "#181A24",
                border: `1px solid ${pestanaActiva === tab ? "#6A3CE6" : "rgba(106,60,230,0.15)"}`,
                color: pestanaActiva === tab ? "#fff" : "#6B6E85",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: pestanaActiva === tab ? 600 : 400,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Pestaña: Biblioteca */}
        {pestanaActiva === "Biblioteca" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {JUEGOS.map((juego) => (
                <div
                  key={juego.id}
                  className="rounded-xl p-5 flex items-start gap-4 transition-all duration-200 cursor-pointer"
                  style={{ background: "#181A24", border: "1px solid rgba(106,60,230,0.15)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(106,60,230,0.4)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(106,60,230,0.15)"; }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width: 52, height: 52, background: juego.bg, border: "1px solid rgba(106,60,230,0.2)" }}
                  >
                    {juego.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <div style={{ color: "#E8E9F0", fontSize: 14, fontWeight: 600 }}>{juego.title}</div>
                        <div style={{ color: "#6B6E85", fontSize: 12 }}>{juego.genero}</div>
                      </div>
                      <ChevronRight size={14} color="#6B6E85" />
                    </div>

                    <div className="flex items-center gap-4 my-2">
                      <span style={{ fontSize: 11, color: "#B0B3C6" }}>
                        <Clock size={10} style={{ display: "inline", marginRight: 4 }} />
                        {juego.horas}h jugadas
                      </span>
                      <span style={{ fontSize: 11, color: "#6B6E85" }}>{juego.ultimaVez}</span>
                      <span className="flex items-center gap-1" style={{ fontSize: 11, color: "#e8a020" }}>
                        <Star size={10} fill="#e8a020" />
                        {juego.rating}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span style={{ fontSize: 11, color: "#6B6E85" }}>Completado</span>
                        <span style={{ fontSize: 11, color: "#6A3CE6", fontFamily: "'JetBrains Mono', monospace" }}>
                          {juego.progreso}%
                        </span>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{ height: 4, background: "#1E2030" }}>
                        <div
                          className="rounded-full h-full"
                          style={{ width: `${juego.progreso}%`, background: "linear-gradient(90deg, #6A3CE6, #9060f0)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            
          </div>
        )}

        {/* Pestaña: Logros */}
        {pestanaActiva === "Logros" && (
          <div className="flex flex-col gap-3">
            <div
              className="rounded-xl p-4 mb-2"
              style={{ background: "#181A24", border: "1px solid rgba(106,60,230,0.15)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 13, color: "#B0B3C6" }}>Progreso general</span>
                <span style={{ fontSize: 13, color: "#6A3CE6", fontFamily: "'JetBrains Mono', monospace" }}>3 / 5</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#1E2030" }}>
                <div
                  className="rounded-full h-full"
                  style={{ width: "60%", background: "linear-gradient(90deg, #6A3CE6, #9060f0)" }}
                />
              </div>
            </div>
            {LOGROS.map((logro) => (
              <div
                key={logro.label}
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                style={{
                  background: "#181A24",
                  border: `1px solid ${logro.obtenido ? "rgba(106,60,230,0.3)" : "rgba(106,60,230,0.1)"}`,
                  opacity: logro.obtenido ? 1 : 0.5,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    background: logro.obtenido ? "rgba(106,60,230,0.2)" : "#1E2030",
                    border: `1px solid ${logro.obtenido ? "#6A3CE6" : "rgba(106,60,230,0.15)"}`,
                  }}
                >
                  <Trophy size={18} color={logro.obtenido ? "#6A3CE6" : "#6B6E85"} />
                </div>
                <div className="flex-1">
                  <div style={{ color: logro.obtenido ? "#E8E9F0" : "#6B6E85", fontSize: 14, fontWeight: 600 }}>
                    {logro.label}
                  </div>
                  <div style={{ color: "#6B6E85", fontSize: 12 }}>{logro.desc}</div>
                </div>
                {logro.obtenido && (
                  <span
                    className="px-2 py-1 rounded"
                    style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 11, fontWeight: 600 }}
                  >
                    OBTENIDO
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pestaña: Actividad */}
        {pestanaActiva === "Actividad" && (
          <div
            className="rounded-xl p-6"
            style={{ background: "#181A24", border: "1px solid rgba(106,60,230,0.15)" }}
          >
            <h3 style={{ color: "#E8E9F0", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Actividad Reciente</h3>
            {[
              { accion: "Logro desbloqueado", detalle: '"Demonio de Velocidad" en Phantom Rush', tiempo: "Hace 2 horas", color: "#6A3CE6" },
              { accion: "Compra realizada", detalle: "Cyber Nexus — Edición Estándar", tiempo: "Hace 3 días", color: "#22c55e" },
              { accion: "Rango alcanzado", detalle: "Platino en Void Protocol", tiempo: "Hace 1 semana", color: "#e8a020" },
              { accion: "Reseña publicada", detalle: "Neon Siege — 5 estrellas", tiempo: "Hace 2 semanas", color: "#3CE6B0" },
              { accion: "Gremio unido", detalle: '"Shadow Protocol" con 142 miembros', tiempo: "Hace 1 mes", color: "#E63CA0" },
            ].map((ev, i) => (
              <div key={i} className="flex gap-4 mb-5 last:mb-0">
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-full flex-shrink-0"
                    style={{ width: 10, height: 10, background: ev.color, marginTop: 4, boxShadow: `0 0 8px ${ev.color}` }}
                  />
                  {i < 4 && <div style={{ width: 1, flex: 1, background: "rgba(106,60,230,0.15)", marginTop: 4, marginBottom: -4 }} />}
                </div>
                <div className="pb-5 last:pb-0">
                  <span style={{ color: "#E8E9F0", fontSize: 13 }}>{ev.accion} </span>
                  <span style={{ color: ev.color, fontSize: 13, fontWeight: 500 }}>{ev.detalle}</span>
                  <div style={{ color: "#6B6E85", fontSize: 11, marginTop: 3 }}>{ev.tiempo}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pestaña: Amigos */}
        {pestanaActiva === "Amigos" && (
          <div className="flex flex-col gap-3">
            {[
              { nombre: "NightWolf_X", estado: "en línea", juego: "Void Protocol", avatar: "NW" },
              { nombre: "PixelQueen", estado: "en línea", juego: "Phantom Rush", avatar: "PQ" },
              { nombre: "GhostByte", estado: "ausente", juego: null, avatar: "GB" },
              { nombre: "IronClaw99", estado: "desconectado", juego: null, avatar: "IC" },
              { nombre: "StellarMind", estado: "en línea", juego: "Cyber Nexus", avatar: "SM" },
            ].map((amigo) => (
              <div
                key={amigo.nombre}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200"
                style={{ background: "#181A24", border: "1px solid rgba(106,60,230,0.15)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(106,60,230,0.35)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(106,60,230,0.15)"; }}
              >
                <div className="relative">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{ width: 44, height: 44, background: "linear-gradient(135deg, #6A3CE6, #3C6AE6)" }}
                  >
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{amigo.avatar}</span>
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 rounded-full"
                    style={{
                      width: 12,
                      height: 12,
                      background: amigo.estado === "en línea" ? "#22c55e" : amigo.estado === "ausente" ? "#e8a020" : "#6B6E85",
                      border: "2px solid #181A24",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div style={{ color: "#E8E9F0", fontSize: 14, fontWeight: 600 }}>{amigo.nombre}</div>
                  <div style={{ color: "#6B6E85", fontSize: 12 }}>
                    {amigo.juego ? (
                      <span>
                        Jugando <span style={{ color: "#6A3CE6" }}>{amigo.juego}</span>
                      </span>
                    ) : amigo.estado === "ausente" ? (
                      "Ausente"
                    ) : (
                      "Desconectado"
                    )}
                  </div>
                </div>
                <ChevronRight size={14} color="#6B6E85" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
