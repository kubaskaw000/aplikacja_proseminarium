import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../authSlice.js";

const protectedRoutes = ["", "tree"];

const RouteObserver = () => {
  const isLogged = useSelector((state) => state.auth.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(isLogged);

  useEffect(() => {
    fetch("http://localhost:5000/api/user", { credentials: "include" })
      .then((res) => res.json())
      .then(() => dispatch(login()))
      .catch(() => dispatch(logout()));
  }, []);

  useEffect(() => {
    console.log(location.pathname);

    console.log(isLogged);

    if (protectedRoutes.includes(location.pathname) && isLogged === 0) {
      navigate("/login");
    }

    if (location.pathname == "/login" && isLogged === 1) {
      navigate("/");
    }
  }, [location.pathname, isLogged]);

  return null;
};

export default RouteObserver;
