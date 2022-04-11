import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../LoginBox/LoginBox.css";

function LoginBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        if (data.status === "success") navigate("/", { replace: true });
      })
      .catch((err) => console.log(err));

    //zapisac token
  };
  return (
    <>
      <div id="app">
        <form>
          <section>
            <label for="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              autocomplete="email"
              required
              autofocus
            />
          </section>
          <section>
            <label for="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              autocomplete="password"
              required
            />
          </section>
          <button onClick={handleLogin} type="submit" value="submit">
            Sign in
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginBox;
