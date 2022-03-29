import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginView from "../../views/LoginView";
import AnalyserView from "../../views/AnalyserView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnalyserView />}></Route>
        <Route path="/login" element={<LoginView />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
