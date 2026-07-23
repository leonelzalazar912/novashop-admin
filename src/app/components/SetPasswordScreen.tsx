import {
  useEffect,
  useState,
} from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Gamepad2,
  KeyRound,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type SetPasswordScreenProps = {
  onCompleted: () => void;
  onGoLogin: () => void;
};

export function SetPasswordScreen({
  onCompleted,
  onGoLogin,
}: SetPasswordScreenProps) {
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [hasSession, setHasSession] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (sessionError) {
        console.error(sessionError);

        setError(
          "No se pudo validar la invitación."
        );

        setCheckingSession(false);
        return;
      }

      setHasSession(Boolean(session));
      setCheckingSession(false);
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        setHasSession(Boolean(session));
        setCheckingSession(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const passwordIsLongEnough =
    password.length >= 8;

  const passwordsMatch =
    password === confirmPassword;

  const isFormValid =
    passwordIsLongEnough &&
    passwordsMatch &&
    !loading;

  async function handleSavePassword() {
    if (!passwordIsLongEnough) {
      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    if (!passwordsMatch) {
      setError(
        "Las contraseñas no coinciden."
      );
      return;
    }

    if (!hasSession) {
      setError(
        "La invitación no es válida o ya venció."
      );
      return;
    }

    setLoading(true);
    setError("");

    const {
      error: updateError,
    } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      console.error(updateError);

      setError(
        "No se pudo guardar la contraseña. La invitación puede haber vencido."
      );

      setLoading(false);
      return;
    }

    setLoading(false);
    setCompleted(true);
  }

  if (checkingSession) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "#0D0E12",
          color: "#E8E9F0",
        }}
      >
        <p>Validando invitación...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: "#0D0E12",
        }}
      >
        <div
          className="w-full text-center rounded-xl"
          style={{
            maxWidth: 440,
            padding: 32,
            background: "#181A24",
            border:
              "1px solid rgba(106,60,230,0.3)",
          }}
        >
          <CheckCircle2
            size={52}
            color="#35d07f"
            style={{
              margin: "0 auto 20px",
            }}
          />

          <h1
            style={{
              color: "#E8E9F0",
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Contraseña configurada
          </h1>

          <p
            style={{
              color: "#B0B3C6",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Tu cuenta ya está lista. Podés
            ingresar al panel administrativo.
          </p>

          <button
            type="button"
            onClick={onCompleted}
            style={{
              width: "100%",
              background: "#6A3CE6",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              padding: "13px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            INGRESAR A NOVASHOP
          </button>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: "#0D0E12",
        }}
      >
        <div
          className="w-full text-center rounded-xl"
          style={{
            maxWidth: 440,
            padding: 32,
            background: "#181A24",
            border:
              "1px solid rgba(255,92,92,0.3)",
          }}
        >
          <KeyRound
            size={48}
            color="#ff5c5c"
            style={{
              margin: "0 auto 20px",
            }}
          />

          <h1
            style={{
              color: "#E8E9F0",
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Invitación no válida
          </h1>

          <p
            style={{
              color: "#B0B3C6",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            El enlace pudo haber vencido, haber
            sido utilizado previamente o no
            corresponder a una invitación válida.
          </p>

          <button
            type="button"
            onClick={onGoLogin}
            style={{
              width: "100%",
              background: "#6A3CE6",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              padding: "13px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            VOLVER AL INICIO DE SESIÓN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#0D0E12",
      }}
    >
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0D0E12 0%, #181A24 40%, #1a1040 100%)",
        }}
      >
        <div
          className="absolute rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{
            width: 480,
            height: 480,
            background: "#6A3CE6",
            top: -120,
            left: -120,
          }}
        />

        <div className="flex items-center gap-3 z-10">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 44,
              height: 44,
              background: "#6A3CE6",
            }}
          >
            <Gamepad2
              size={24}
              color="#FFFFFF"
            />
          </div>

          <span
            style={{
              fontFamily:
                "'Rajdhani', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#E8E9F0",
            }}
          >
            NOVASHOP
          </span>
        </div>

        <div className="z-10">
          <h1
            style={{
              fontFamily:
                "'Rajdhani', sans-serif",
              fontSize: 50,
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#E8E9F0",
              marginBottom: 20,
            }}
          >
            CONFIGURÁ TU
            <br />
            <span
              style={{
                color: "#6A3CE6",
              }}
            >
              NUEVA CUENTA
            </span>
          </h1>

          <p
            style={{
              color: "#6B6E85",
              fontSize: 16,
              lineHeight: 1.7,
              maxWidth: 390,
            }}
          >
            Elegí una contraseña segura para
            comenzar a trabajar en el panel
            administrativo de NovaShop.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-12">
        <div
          className="w-full"
          style={{
            maxWidth: 420,
          }}
        >
          <h2
            style={{
              fontFamily:
                "'Rajdhani', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#E8E9F0",
              marginBottom: 8,
            }}
          >
            CREAR CONTRASEÑA
          </h2>

          <p
            style={{
              color: "#6B6E85",
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            La contraseña debe contener al menos
            8 caracteres.
          </p>

          <div className="flex flex-col gap-18">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#B0B3C6",
                  marginBottom: 8,
                  letterSpacing: "0.06em",
                }}
              >
                NUEVA CONTRASEÑA
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg outline-none"
                  style={{
                    background: "#181A24",
                    border:
                      "1px solid rgba(106,60,230,0.25)",
                    color: "#E8E9F0",
                    padding:
                      "12px 44px 12px 16px",
                    fontSize: 14,
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6B6E85",
                  }}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#B0B3C6",
                  marginBottom: 8,
                  letterSpacing: "0.06em",
                }}
              >
                REPETIR CONTRASEÑA
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg outline-none"
                  style={{
                    background: "#181A24",
                    border:
                      "1px solid rgba(106,60,230,0.25)",
                    color: "#E8E9F0",
                    padding:
                      "12px 44px 12px 16px",
                    fontSize: 14,
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6B6E85",
                  }}
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar confirmación"
                      : "Mostrar confirmación"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
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
            type="button"
            onClick={() =>
              void handleSavePassword()
            }
            disabled={!isFormValid}
            className="w-full flex items-center justify-center gap-2 rounded-lg mt-6"
            style={{
              background: isFormValid
                ? "#6A3CE6"
                : "#39334f",
              color: "#FFFFFF",
              padding: "13px 0",
              border: "none",
              cursor: isFormValid
                ? "pointer"
                : "not-allowed",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            <KeyRound size={16} />

            {loading
              ? "GUARDANDO..."
              : "GUARDAR CONTRASEÑA"}
          </button>
        </div>
      </div>
    </div>
  );
}