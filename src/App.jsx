import { Route, Routes, Link } from "react-router-dom";
import "./App.css";
import StoryPage from "./components/StoryPage";
import CertificatePage from "./components/CertificatePage";
function App() {
  return (
    <>
      <nav>
        <Link to="/">Story</Link>
      </nav>
      <Routes>
        <Route path="/" element={<StoryPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
      </Routes>
    </>
  );
}

export default App;
