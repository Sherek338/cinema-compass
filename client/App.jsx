import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index.jsx";
import Profile from "./pages/profile.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
