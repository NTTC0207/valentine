import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import RedPacket from "./pages/RedPacket";
import FortuneWheel from "./pages/FortuneWheel";
import GiftSelection from "./pages/GiftSelection";
import FinalChapter from "./pages/FinalChapter";
import Preloader from "./components/Preloader";
import "./pages/RedPacket.css";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {/* <MobileBlocker /> */}
      <Routes>
        <Route path="/" element={<Gallery isReady={!loading} />} />
        <Route path="/red-packet" element={<RedPacket />} />
        <Route path="/fortune-wheel" element={<FortuneWheel />} />
        <Route path="/gift-selection" element={<GiftSelection />} />
        <Route path="/final-chapter" element={<FinalChapter />} />
      </Routes>
    </Router>
  );
}

export default App;
