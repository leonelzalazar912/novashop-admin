import { useState } from "react";
import { Eye, EyeOff, Gamepad2, LogIn, Chrome } from "lucide-react";

interface Props {
  onGoRegister: () => void;
  onGoProfile: () => void;
}

export function LoginScreen({ onGoRegister, onGoProfile }: Props) {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleLogin = () => {
  if (!email.trim() || !password.trim()) {
    setError("Completá correo electrónico y contraseña para continuar.");
    return;
  }

  setError("");
  onGoProfile();
};

  return (
    <div className="min-h-screen flex" style={{ background: "#0D0E12" }}>
      {/* Panel izquierdo — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0D0E12 0%, #181A24 40%, #1a1040 100%)",
        }}
      >
        <div
          className="absolute rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ width: 480, height: 480, background: "#6A3CE6", top: -120, left: -120 }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ width: 320, height: 320, background: "#6A3CE6", bottom: 80, right: -60 }}
        />

        {/* Logo */}
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

        {/* Hero */}
        <div className="z-10">
          <h1
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#E8E9F0",
              marginBottom: 20,
            }}
          >
            TU UNIVERSO
            <br />
            <span style={{ color: "#6A3CE6" }}>TE ESPERA.</span>
          </h1>
          <p style={{ color: "#6B6E85", fontSize: 16, lineHeight: 1.7, maxWidth: 380 }}>
            Descubrí miles de juegos, unite a comunidades épicas y construí tu legado en el ecosistema gamer más inmersivo del mundo.
          </p>
          
        </div>

        {/* Grid decorativo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(106,60,230,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(106,60,230,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-12">
        {/* Logo mobile */}
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
            INICIAR SESIÓN
          </h2>
          <p style={{ color: "#6B6E85", fontSize: 14, marginBottom: 32 }}>
            ¿No tenés cuenta?{" "}
            <button
              onClick={onGoRegister}
              style={{ color: "#6A3CE6", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
            >
              Creá una
            </button>
          </p>

          {/* Botones sociales */}
          <div className="flex gap-3 mb-6">
            {[
  { icon: <Chrome size={18} />, label: "Google" },
].map(({ icon, label }) => (
              <button
                key={label}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg transition-all duration-200"
                style={{
                  background: "#181A24",
                  border: "1px solid rgba(106,60,230,0.25)",
                  color: "#B0B3C6",
                  padding: "11px 0",
                  cursor: "pointer",
                  fontSize: 14,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#6A3CE6";
                  (e.currentTarget as HTMLButtonElement).style.color = "#E8E9F0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(106,60,230,0.25)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#B0B3C6";
                }}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div style={{ flex: 1, height: 1, background: "rgba(106,60,230,0.2)" }} />
            <span style={{ color: "#6B6E85", fontSize: 12, letterSpacing: "0.05em" }}>O CONTINUAR CON EMAIL</span>
            <div style={{ flex: 1, height: 1, background: "rgba(106,60,230,0.2)" }} />
          </div>

          {/* Campos */}
          <div className="flex flex-col gap-4">
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#B0B3C6", marginBottom: 8, letterSpacing: "0.06em" }}>
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                placeholder="jugador@nexusplay.gg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 12, color: "#B0B3C6", letterSpacing: "0.06em" }}>CONTRASEÑA</label>
                <button style={{ fontSize: 12, color: "#6A3CE6", background: "none", border: "none", cursor: "pointer" }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
          </div>

          {error && (
  <p
    style={{
      color: "#ff5c5c",
      fontSize: 13,
      marginTop: 16,
      marginBottom: 8,
    }}
  >
    {error}
  </p>
)}

          <button
            onClick={handleLogin}
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
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#7c4ef0"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#6A3CE6"; }}
          >
            <LogIn size={16} />
            INICIAR SESIÓN
          </button>
        </div>
      </div>
    </div>
  );
}
