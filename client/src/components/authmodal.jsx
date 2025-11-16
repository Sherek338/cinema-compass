import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext.jsx";

export default function AuthModal() {
  const { modalOpen, setModalOpen, login, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!modalOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [modalOpen, setModalOpen]);

  if (!modalOpen) return null;

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      setModalOpen(false);
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="bg-raisin-black rounded-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-white text-xl"
          onClick={() => setModalOpen(false)}
        >
          ×
        </button>

        <div className="flex mb-6 border-b border-white/10">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 pb-2 text-center text-sm font-semibold ${
              mode === "login" ? "text-white border-b-2 border-coquelicot" : "text-white/60"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 pb-2 text-center text-sm font-semibold ${
              mode === "register" ? "text-white border-b-2 border-coquelicot" : "text-white/60"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs text-white/70 mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={onChange}
                className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
                autoComplete="username"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-white/70 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm outline-none border border-white/10 focus:border-coquelicot"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-lg bg-coquelicot text-white text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
