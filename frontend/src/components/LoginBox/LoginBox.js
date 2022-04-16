import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../LoginBox/LoginBox.css";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../authSlice.js";

function LoginBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogged = useSelector((state) => state.auth.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(login());
          navigate("/", { replace: true });
        }
      })
      .catch((err) => console.log(err));

    //zapisac token
  };
  return (
    <>
      <form class="loginForm">
        <label for="email">Email</label>
        <input
          className="input"
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          type="email"
          autocomplete="email"
          required
          autofocus
        />
        <label for="password">Hasło</label>
        <input
          className="input"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          autocomplete="password"
          required
        />
        <button
          className="submitBtn"
          onClick={handleLogin}
          type="submit"
          value="submit"
        >
          Zaloguj
        </button>
      </form>
    </>
  );
}

export default LoginBox;
