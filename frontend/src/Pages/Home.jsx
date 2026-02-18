import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main
      style={{
        maxWidth: "820px",
        margin: "0 auto",
        paddingTop: "2rem"
      }}
    >
      <section aria-labelledby="home-heading">
        <h1
          id="home-heading"
          style={{
            marginBottom: "1.2rem",
            fontSize: "2rem",
            lineHeight: "1.3"
          }}
        >
          Learning is not memorizing.
          <br />
          It is structured understanding.
        </h1>

        <p
          style={{
            marginBottom: "2rem",
            lineHeight: "1.7",
            color: "#cfcfcf",
            fontSize: "1rem"
          }}
        >
          LGC Concept AI focuses on concept clarity,
          exam relevance, precise doubt resolution,
          and verification through teach-back.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => navigate("/explore")}
          style={{
            padding: "0.9rem 1.6rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: "#4f8cff",
            border: "none",
            color: "white",
            borderRadius: "6px"
          }}
        >
          Explore How Learning Works
        </button>

        {/* Secondary Link */}
        <div style={{ marginTop: "1.2rem" }}>
          <button
            onClick={() => navigate("/why")}
            style={{
              background: "transparent",
              border: "none",
              color: "#4f8cff",
              cursor: "pointer",
              fontSize: "0.9rem",
              padding: 0
            }}
          >
            Why LGC Concept AI Exists →
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
