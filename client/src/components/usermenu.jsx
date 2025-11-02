import { useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

export default function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    setShowAuth(true);
    setIsRegister(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? "http://localhost:5000/api/auth/register" : "http://localhost:5000/api/auth/login";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(isRegister ? "Registration successful!" : "Login Successful!");
        setShowAuth(false);
        setIsLoggedIn(true);
        setFormData({ username: "", email: "", password: "" });
      } else {
        alert(`${isRegister ? "Registration" : "Login"} failed.`);
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <g clipPath="url(#clip0_55_1708)">
                <path
                  d="M9.80897 15.0659C4.61671 17.1354 0.933839 22.2027 0.933845 28.125C0.933373 28.2487 0.957395 28.3713 1.00453 28.4857C1.05166 28.6001 1.12096 28.7041 1.20845 28.7916C1.29594 28.879 1.39988 28.9483 1.51428 28.9955C1.62868 29.0426 1.75128 29.0666 1.87501 29.0662H28.125C28.3736 29.0652 28.6117 28.9655 28.7868 28.789C28.9619 28.6125 29.0598 28.3736 29.0588 28.125C29.0588 22.2033 25.377 17.1358 20.1856 15.0659C18.75 16.1917 16.9489 16.8713 14.9963 16.8713C13.0434 16.8713 11.2433 16.1921 9.80897 15.0659Z"
                  fill="white"
                />
                <path
                  d="M14.9965 0.941162C10.8654 0.941162 7.50196 4.30467 7.50195 8.43567C7.50196 12.5667 10.8654 15.9375 14.9965 15.9375C19.1275 15.9375 22.4983 12.5667 22.4983 8.43567C22.4983 4.30467 19.1275 0.941162 14.9965 0.941162Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_55_1708">
                  <rect width="30" height="30" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="hidden sm:inline text-white text-base font-normal">
              James
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-raisin-black text-white rounded-lg shadow-lg border border-white/10 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-coquelicot/80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-coquelicot/80 transition-colors"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => {setShowAuth(true); setIsRegister(false);}}
          className="bg-coquelicot text-white px-4 py-2 rounded-full hover:bg-coquelicot/90 transition-colors"
        >
          Login
        </button>
      )}

      {showAuth &&
        createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-lg">
            <div className="relative bg-raisin-black p-8 rounded-2xl shadow-lg w-[90%] max-w-md border border-white/10">
              <h2 className="text-2xl text-white font-semibold mb-4 text-center">
                {isRegister ? "Register" : "Login"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {isRegister && (
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-coquelicot"
                />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-coquelicot"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-coquelicot"
                />

                <button
                  type="submit"
                  className="bg-coquelicot text-white py-2 rounded-full hover:bg-coquelicot/90 transition-colors"
                >
                  {isRegister ? "Register" : "Login"}
                </button>
              </form>

              <p className="text-center text-gray-400 mt-4 text-sm">
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-coquelicot underline hover:text-coquelicot/80"
                >
                  {isRegister ? "Login" : "Register"}
                </button>
              </p>

              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
