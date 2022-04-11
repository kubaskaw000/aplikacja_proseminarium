import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RouteObserver = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location);

    if (location.pathname == "/") {
      navigate("/login");
    }
  }, [location]);

  return null;
};

export default RouteObserver;
