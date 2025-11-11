import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/authContext.jsx";

export default function AuthModal() {
  const { modalOpen, setModalOpen, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!modalOpen) {
      setErr("");
      setLoading(false);
      setUsername("");
      setEmail("");
      setPassword("");
      setMode("login");
    }
  }, [modalOpen]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      setModalOpen(false);
    } catch (e) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2B2A2B] rounded-2xl border border-white/10 shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-xl font-bold">
            {mode === "login" ? "Login" : "Create account"}
          </h3>
          <button className="p-2 rounded hover:bg-white/10" onClick={() => setModalOpen(false)}>
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-lg ${mode === "login" ? "bg-coquelicot text-white" : "bg-transparent border border-white/20 text-white"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-lg ${mode === "register" ? "bg-coquelicot text-white" : "bg-transparent border border-white/20 text-white"}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "register" && (
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="w-full h-11 px-4 rounded-lg bg-transparent border border-white/20 text-white placeholder:text-[#9B9B9B] focus:outline-none focus:border-coquelicot"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Email"
            className="w-full h-11 px-4 rounded-lg bg-transparent border border-white/20 text-white placeholder:text-[#9B9B9B] focus:outline-none focus:border-coquelicot"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
            className="w-full h-11 px-4 rounded-lg bg-transparent border border-white/20 text-white placeholder:text-[#9B9B9B] focus:outline-none focus:border-coquelicot"
          />

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-coquelicot text-white font-semibold hover:bg-coquelicot/90 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
