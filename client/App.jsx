import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/index.jsx';
import Profile from '@/pages/profile.jsx';
// import MovieDetail from "@/pages/MovieDetail"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/movie/:id" element={<MovieDetail />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
