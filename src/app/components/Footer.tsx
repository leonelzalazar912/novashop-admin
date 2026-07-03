import { useState } from "react";
import { Gamepad2, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { theme } from "../../config/theme";


export function Footer() {
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  return (
    <footer
      className="w-full mt-12"
      style={{
        backgroundColor: theme.colors.header,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Main footer content */}
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: "#6A3CE6" }}
              >
                <Gamepad2 size={18} color="#0d0e12" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  color: "#6A3CE6",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                NEXUS<span style={{ color: "#ffffff" }}>PLAY</span>
              </span>
            </div>
            <p
              style={{ color: theme.colors.textSoft, fontSize: "0.82rem", lineHeight: 1.7, maxWidth: "240px" }}
            >
              La tienda gamer de confianza. Juegos físicos para PlayStation, Xbox, Nintendo y Sega al mejor precio.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: <Instagram size={16} />, label: "Instagram" },
                { icon: <Twitter size={16} />, label: "Twitter" },
                { icon: <Facebook size={16} />, label: "Facebook" },
                { icon: <Youtube size={16} />, label: "Youtube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-cyan-500/20"
                  style={{
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.textSoft,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  aria-label={s.label}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#6A3CE6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7d99")}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: theme.colors.text,
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.08em",
                marginBottom: "16px",
              }}
            >
              TIENDA
            </h4>
            <ul className="flex flex-col gap-2">
              {["Todos los juegos", "Ofertas", "Novedades", "Más vendidos", "Próximamente"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{ color: theme.colors.textSoft, fontSize: "0.82rem" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#6A3CE6")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7d99")}
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h4
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: theme.colors.text,
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.08em",
                marginBottom: "16px",
              }}
            >
              PLATAFORMAS
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: "PlayStation 5", color: "#4a9eff" },
                { label: "PlayStation 4", color: "#4a9eff" },
                { label: "Xbox Series X", color: "#5cd65c" },
                { label: "Nintendo Switch", color: "#ff6b6b" },
                { label: "Sega", color: "#6699ff" },
              ].map((p) => (
                <li key={p.label}>
                  <a
                    href="#"
                    className="flex items-center gap-2"
                    style={{ color: theme.colors.textSoft, fontSize: "0.82rem" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = p.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7d99")}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: p.color, flexShrink: 0 }}
                    />
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: theme.colors.text,
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.08em",
                marginBottom: "16px",
              }}
            >
              CONTACTO
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { icon: <Mail size={14} />, text: "ventas@nexusplay.ar" },
                { icon: <Phone size={14} />, text: "+54 3817658424" },
                { icon: <MapPin size={14} />, text: "Tucuman, Argentina" },
              ].map((c) => (
                <li key={c.text} className="flex items-center gap-2">
                  <span style={{ color: "#6A3CE6" }}>{c.icon}</span>
                  <span style={{ color: theme.colors.textSoft, fontSize: "0.82rem" }}>{c.text}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-5">
              <p style={{ color: "#a0a3b8", fontSize: "0.78rem", marginBottom: "8px" }}>
                Suscribite y recibí las mejores ofertas:
              </p>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  style={{
                    backgroundColor: theme.colors.surfaceLight,
                    color: theme.colors.text,
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRight: "none",
                    borderRadius: "4px 0 0 4px",
                    fontSize: "0.78rem",
                  }}
                />
                <button
                onClick={() => {
  if (!email.trim()) return;

  setNewsletterMessage(
    "🎉 ¡Bienvenido a NexusPlay! Ya formás parte de nuestra comunidad gamer. A partir de ahora vas a recibir ofertas exclusivas, descuentos especiales, novedades y acceso anticipado a los mejores lanzamientos. ¡Nos vemos en la próxima aventura! 🎮"
  );

  setEmail("");

  setTimeout(() => {
    setNewsletterMessage("");
  }, 15000);
}}
                  className="px-3 py-2 text-sm transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#6A3CE6",
                    color: "#ffffff",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    letterSpacing: "0.05em",
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  OK
                </button>
              </div>
              {newsletterMessage && (
  <div
    style={{
      marginTop: "14px",
      padding: "14px",
      borderRadius: "10px",
      background: "linear-gradient(135deg, rgba(106,60,230,0.18), rgba(0,229,212,0.12))",
      border: "1px solid rgba(106,60,230,0.35)",
      color: theme.colors.text,
      fontSize: "0.82rem",
      lineHeight: 1.6,
      animation: "fadeIn 0.3s ease",
    }}
  >
    {newsletterMessage}
  </div>
)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="w-full py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="container mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-3">
          <p style={{ color: "#4a4d60", fontSize: "0.75rem" }}>
            © 2026 NexusPlay. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {["Términos y condiciones", "Privacidad", "Cookies"].map((l) => (
              <a
                key={l}
                href="#"
                style={{ color: "#4a4d60", fontSize: "0.75rem" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7a7d99")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4d60")}
              >
                {l}
              </a>
            ))}
          </div>
          {/* Payment methods */}
          <div className="flex items-center gap-2">
            {["VISA", "MASTERCARD", "MP"].map((m) => (
              <span
                key={m}
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: theme.colors.surfaceLight,
                  color: "#4a4d60",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.6rem",
                  letterSpacing: "0.05em",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
