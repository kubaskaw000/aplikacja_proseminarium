import "./Navigation.css";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  return (
    <nav>
      <div onClick={() => navigate("/")}>Default</div>
      <div onClick={() => navigate("/tree")}>Tree</div>
      <div>Logout</div>
    </nav>
  );
};

export default Navigation;
