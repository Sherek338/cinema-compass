import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User, Heart, ListVideo } from "lucide-react";
import { useAuth } from "@/context/authContext.jsx";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 border border-white/40 rounded-full px-3 py-1.5 hover:bg-white/10 transition"
        onClick={() => setOpen((s) => !s)}
      >
        <span className="text-white text-sm font-semibold">{user?.username || "Account"}</span>
        <ChevronDown className="w-4 h-4 text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-[#2B2A2B] rounded-xl shadow-lg border border-white/10 overflow-hidden z-50">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-white text-sm"
            onClick={() => setOpen(false)}
          >
            <User className="w-4 h-4" /> Profile
          </Link>
          <Link
            to="/watchlist"
            className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-white text-sm"
            onClick={() => setOpen(false)}
          >
            <ListVideo className="w-4 h-4" /> Watchlist
          </Link>
          <Link
            to="/favorites"
            className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-white text-sm"
            onClick={() => setOpen(false)}
          >
            <Heart className="w-4 h-4" /> Favorites
          </Link>
          <button
            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/10 text-white text-left text-sm"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
