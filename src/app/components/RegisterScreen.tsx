import { useState } from "react";
import { Eye, EyeOff, Gamepad2, UserPlus, Check } from "lucide-react";
import { theme } from "../../config/theme";

interface Props {
  onGoLogin: () => void;
  onGoProfile: () => void;
}

export function RegisterScreen({ onGoLogin, onGoProfile }: Props) {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", dob: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const today = new Date();
  const maxBirthDate = today.toISOString().split("T")[0];

  const minBirthDate = "1900-01-01";

const handleRegister = () => {
  if (!form.username.trim() || !form.email.trim() || !form.password.trim() || !form.dob.trim()) {
    setError("Completá todos los campos para crear tu cuenta.");
    return;
  }

  if (form.password.length < 6) {
  setError("La contraseña debe tener al menos 6 caracteres.");
  return;
}

if (passwordStrength < 2) {
  setError("La contraseña debe ser al menos Regular.");
  return;
}

  setError("");
  onGoProfile();
};

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthColors = ["#6B6E85", "#e53e3e", "#e8a020", "#6A3CE6", "#22c55e"];
  const strengthLabels = ["", "Débil", "Regular", "Buena", "Fuerte"];

  return (
    <div className="min-h-screen flex" style={{ background: "#0D0E12" }}>
      {/* Panel izquierdo */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D0E12 0%, #181A24 40%, #1a1040 100%)" }}
      >
        <div
          className="absolute rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ width: 400, height: 400, background: "#6A3CE6", bottom: -80, right: -80 }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ width: 280, height: 280, background: "#6A3CE6", top: 60, left: -60 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(106,60,230,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(106,60,230,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="flex items-center gap-3 z-10">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 44, height: 44, background: "#6A3CE6" }}
          >
            <Gamepad2 size={24} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#E8E9F0",
            }}
          >
            NEXUSPLAY
          </span>
        </div>

        <div className="z-10">
          <h1
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#E8E9F0",
              marginBottom: 20,
            }}
          >
            CREA TU
            <br />
            <span style={{ color: "#6A3CE6" }}>CUENTA.</span>
          </h1>
          <p style={{ color: "#6B6E85", fontSize: 15, lineHeight: 1.7, maxWidth: 360 }}>
            Regístrate para comprar videojuegos físicos y recibir novedades u ofertas si activas la suscripción.
          </p>


        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-12">
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 40, height: 40, background: "#6A3CE6" }}
          >
            <Gamepad2 size={20} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#E8E9F0",
            }}
          >
            NEXUSPLAY
          </span>
        </div>

        <div className="w-full" style={{ maxWidth: 420 }}>
          <h2
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#E8E9F0",
              marginBottom: 6,
            }}
          >
            CREAR CUENTA
          </h2>
          <p style={{ color: "#6B6E85", fontSize: 14, marginBottom: 28 }}>
            ¿Ya tenés cuenta?{" "}
            <button
              onClick={onGoLogin}
              style={{ color: "#6A3CE6", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
            >
              Iniciá sesión
            </button>
          </p>

          <div className="flex flex-col gap-4">
            {/* Nombre de usuario */}
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#B0B3C6", marginBottom: 8, letterSpacing: "0.06em" }}>
                NOMBRE DE JUGADOR
              </label>
              <input
                type="text"
                placeholder="CyberSlayer9000"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-lg outline-none transition-all duration-200"
                style={{
                  background: "#181A24",
                  border: "1px solid rgba(106,60,230,0.25)",
                  color: "#E8E9F0",
                  padding: "12px 16px",
                  fontSize: 14,
                }}
                onFocus={(e) => { e.target.style.borderColor = "#6A3CE6"; e.target.style.boxShadow = "0 0 0 3px rgba(106,60,230,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(106,60,230,0.25)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#B0B3C6", marginBottom: 8, letterSpacing: "0.06em" }}>
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                placeholder="jugador@nexusplay.gg"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg outline-none transition-all duration-200"
                style={{
                  background: "#181A24",
                  border: "1px solid rgba(106,60,230,0.25)",
                  color: "#E8E9F0",
                  padding: "12px 16px",
                  fontSize: 14,
                }}
                onFocus={(e) => { e.target.style.borderColor = "#6A3CE6"; e.target.style.boxShadow = "0 0 0 3px rgba(106,60,230,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(106,60,230,0.25)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#B0B3C6", marginBottom: 8, letterSpacing: "0.06em" }}>
                CONTRASEÑA
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg outline-none transition-all duration-200"
                  style={{
                    background: "#181A24",
                    border: "1px solid rgba(106,60,230,0.25)",
                    color: "#E8E9F0",
                    padding: "12px 44px 12px 16px",
                    fontSize: 14,
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#6A3CE6"; e.target.style.boxShadow = "0 0 0 3px rgba(106,60,230,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(106,60,230,0.25)"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#6B6E85" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-300"
                        style={{
                          height: 3,
                          background: i <= passwordStrength ? strengthColors[passwordStrength] : "#1E2030",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColors[passwordStrength] }}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#B0B3C6", marginBottom: 8, letterSpacing: "0.06em" }}>
                FECHA DE NACIMIENTO
              </label>
              <input
                type="date"
                min={minBirthDate}
                max={maxBirthDate}
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full rounded-lg outline-none transition-all duration-200"
                style={{
                  background: "#181A24",
                  border: "1px solid rgba(106,60,230,0.25)",
                  color: form.dob ? "#E8E9F0" : "#6B6E85",
                  padding: "12px 16px",
                  fontSize: 14,
                  colorScheme: "dark",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#6A3CE6"; e.target.style.boxShadow = "0 0 0 3px rgba(106,60,230,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(106,60,230,0.25)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Términos */}
            <div className="flex items-start gap-3 mt-1">
              <button
                onClick={() => setAgreed(!agreed)}
                className="flex-shrink-0 flex items-center justify-center rounded transition-all duration-200"
                style={{
                  width: 18,
                  height: 18,
                  marginTop: 2,
                  background: agreed ? "#6A3CE6" : "transparent",
                  border: `1px solid ${agreed ? "#6A3CE6" : "rgba(106,60,230,0.4)"}`,
                  cursor: "pointer",
                }}
              >
                {agreed && <Check size={11} color="#fff" strokeWidth={3} />}
              </button>
              <div>
  <div
    style={{
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 4,
    }}
  >
    Suscribirme a novedades y ofertas
  </div>

  <div
    style={{
      color: "#6B6E85",
      fontSize: 13,
      lineHeight: 1.5,
      maxWidth: 320,
    }}
  >
    Recibirás lanzamientos exclusivos, descuentos y novedades del catálogo directo en tu email.
  </div>
</div>
            </div>
          </div>

          {error && (
  <p style={{ color: "#ff5c5c", fontSize: 13, marginTop: 16, marginBottom: 8 }}>
    {error}
  </p>
)}

          <button
            onClick={handleRegister}
            disabled={false}
            className="w-full flex items-center justify-center gap-2 rounded-lg mt-6 transition-all duration-200"
            style={{
              background: "#6A3CE6",
              color: "#fff",
              padding: "13px 0",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.06em",
              boxShadow: "0 4px 24px rgba(106,60,230,0.35)",
              transition: "all 0.2s ease",
            }}
          >
            <UserPlus size={16} />
            CREAR CUENTA
          </button>
        </div>
      </div>
    </div>
  );
}
