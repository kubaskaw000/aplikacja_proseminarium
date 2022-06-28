import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import LoginView from "../../views/LoginView/LoginView";
import AnalyserView from "../../views/AnalyserView";
import TreeView from "../../views/TreeView/TreeView";
import { Provider } from "react-redux";
import { store } from "../../store.js";
import RouteObserver from "../RouteObserver";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AnalyserView />}></Route>
          <Route path="/login" element={<LoginView />}></Route>
          <Route path="/tree" element={<TreeView />}></Route>
        </Routes>
        <RouteObserver />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
