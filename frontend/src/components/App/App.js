import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import LoginView from "../../views/LoginView";
import AnalyserView from "../../views/AnalyserView";
import RouteObserver from "../RouteObserver";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnalyserView />}></Route>
        <Route path="/login" element={<LoginView />}></Route>
      </Routes>
      <Link to="/">Login</Link>
      <RouteObserver />
    </BrowserRouter>
  );
}

export default App;
