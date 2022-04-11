import LoginBox from "../components/LoginBox/LoginBox";
import { useState } from "react";
import RegisterBox from "../components/RegisterBox/RegisterBox";
import "./LoginView.css";

const tabs = {
  login: <LoginBox />,
  register: <RegisterBox />,
};

function LoginView() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="app">
      <div className="container">
        <div className="logo">Logo</div>
        <div className="loginNav">
          {Object.keys(tabs).map((key) => (
            <div className="tab" onClick={() => setActiveTab(key)}>
              {key}
            </div>
          ))}

          {/* <div className="register">Rejestracja</div> */}
        </div>
        <div className="content">{tabs[activeTab]}</div>
      </div>
    </div>
  );
}

export default LoginView;
