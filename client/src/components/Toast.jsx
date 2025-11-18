import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-6 right-6 z-[9999] ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in`}
    >
      <p className="font-semibold">{message}</p>
    </div>
  );
}
