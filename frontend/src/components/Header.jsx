import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.png"; // 👈 important

const Header = () => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      {/* Brand */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          cursor: "pointer"
        }}
      >
        <img
          src={logo}                 // ✅ imported asset
          alt="LGC Concept AI logo"   // ✅ SEO + accessibility
          width="28"
          height="28"
          style={{ borderRadius: "6px" }}
        />

        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            letterSpacing: "0.2px"
          }}
        >
          LGC Concept AI
        </span>
      </div>

      {/* Right side */}
      <button
        style={{
          background: "transparent",
          border: "1px solid #4f8cff",
          color: "#4f8cff",
          padding: "0.45rem 0.9rem",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Login / Register
      </button>
    </header>
  );
};

export default Header;