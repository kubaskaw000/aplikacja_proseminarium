import LoginBox from "../components/LoginBox/LoginBox";
import { useState } from "react";
import RegisterBox from "../components/RegisterBox/RegisterBox";
import "./LoginView.css";
import classNames from "classnames";
import logo from "../public/img/chess_icon.png";

const tabs = {
  Logowanie: <LoginBox />,
  Rejestracja: <RegisterBox />,
};

function tabClass(tab, active) {
  return classNames({
    tab: tab,
    activeTab: active,
  });
}

function LoginView() {
  const [activeTab, setActiveTab] = useState("Logowanie");

  return (
    <div className="app">
      <div className="container">
        <div className="authBox">
          <img src={logo} className="logo" />
          <div className="loginNav">
            {Object.keys(tabs).map((key) => (
              <div
                onClick={() => setActiveTab(key)}
                className={tabClass("tab", activeTab === key)}
              >
                {key}
              </div>
            ))}

            {/* <div className="register">Rejestracja</div> */}
          </div>
          <div className="tabContent">{tabs[activeTab]}</div>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
