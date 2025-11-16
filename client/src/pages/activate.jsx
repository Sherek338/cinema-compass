import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header  from "@/components/Header.jsx";
import  Footer from "@/components/Footer.jsx";

export default function ActivateAccount() {
  const { link } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activate = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/activate/${link}`
        );
        if (!res.ok) throw new Error("Activation failed");
        const data = await res.json();
        setMessage(data.message || "Account activated successfully");
        setStatus("success");
        setTimeout(() => navigate("/"), 3000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Activation link is invalid or expired.");
      }
    };
    activate();
  }, [link, navigate]);

  return (
    <div className="min-h-screen bg-raisin-black flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-6 py-10">
          {status === "loading" && (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-coquelicot border-t-transparent rounded-full mx-auto mb-6" />
              <p className="text-white text-lg font-semibold">Activating your account...</p>
            </>
          )}

          {status === "success" && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14 text-green-500 mx-auto mb-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-white text-2xl font-bold mb-2">
                Account Activated!
              </h2>
              <p className="text-white/80">{message}</p>
              <p className="text-white/60 text-sm mt-2">
                Redirecting you to the homepage...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14 text-red-500 mx-auto mb-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h2 className="text-white text-2xl font-bold mb-2">
                Activation Failed
              </h2>
              <p className="text-white/80">{message}</p>
              <button
                onClick={() => navigate("/")}
                className="mt-5 bg-coquelicot text-white px-6 py-2 rounded hover:bg-coquelicot/90 transition-colors"
              >
                Go Back Home
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
