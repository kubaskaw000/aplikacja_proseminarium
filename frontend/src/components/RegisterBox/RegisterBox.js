import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../RegisterBox/RegisterBox.css";

function RegisterBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/register", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, rePassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate("/login", { replace: true });
      })
      .catch((err) => console.log(err));

    //zapisac token
  };

  return (
    <>
      <form className="registerForm">
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

        <label for="re-password">Powtórz hasło</label>
        <input
          className="input"
          onChange={(e) => setRePassword(e.target.value)}
          name="re-password"
          autocomplete="re-password"
          required
        />
        <button className="submitBtn" onClick={handleRegister} type="submit">
          Zarejestruj
        </button>
      </form>
    </>
  );
}

export default RegisterBox;
