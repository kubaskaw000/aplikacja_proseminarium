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
          <section>
            <label for="re-password">Re-Password</label>
            <input
              onChange={(e) => setRePassword(e.target.value)}
              name="re-password"
              autocomplete="re-password"
              required
            />
          </section>
          <button onClick={handleRegister} type="submit">
            Sign up
          </button>
        </form>
      </div>
    </>
  );
}

export default RegisterBox;
