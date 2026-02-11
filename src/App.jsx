import { Route, Routes, Link } from "react-router-dom";
import "./App.css";
import StoryPage from "./components/StoryPage";
import CertificatePage from "./components/CertificatePage";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<StoryPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
