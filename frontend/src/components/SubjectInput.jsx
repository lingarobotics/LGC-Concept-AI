import { useState } from "react";
import { useContextState } from "../context/ContextProvider";

function SubjectInput() {
  const { context, setContext } = useContextState();
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ marginBottom: "12px" }}>
      {/* COMPACT VIEW */}
      {!expanded ? (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              color: "#ccc",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            🎯 {context || "General"}
          </div>

          <button
            onClick={() => setExpanded(true)}
            style={{
              fontSize: "0.75rem",
              background: "none",
              border: "none",
              color: "#4f8cff",
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            Set
          </button>
        </div>
      ) : (
        /* EXPANDED VIEW */
        <div
          style={{
            border: "1px solid rgba(79,140,255,0.5)",
            background: "rgba(79,140,255,0.08)",
            padding: "12px",
            borderRadius: "8px"
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              color: "#aaa",
              marginBottom: "6px"
            }}
          >
            ✨ Focus your answer with a subject
          </div>

          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Control Systems, Robot Dynamics"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              fontSize: "0.9rem"
            }}
          />

          <div
            style={{
              marginTop: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <button
              onClick={() => setContext("")}
              style={{
                fontSize: "0.75rem",
                background: "none",
                border: "none",
                color: "#aaa",
                cursor: "pointer"
              }}
            >
              Clear
            </button>

            <button
              onClick={() => setExpanded(false)}
              style={{
                fontSize: "0.75rem",
                background: "none",
                border: "none",
                color: "#4f8cff",
                cursor: "pointer"
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectInput;