import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const hasVerifiedRef = useRef(false); // 🔑 prevents double execution

  useEffect(() => {
    if (hasVerifiedRef.current) return;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("failed");
      return;
    }

    hasVerifiedRef.current = true;

    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/verify-email?token=${token}`
        );

        if (!res.ok) {
          setStatus("failed");
          return;
        }

        setStatus("success");
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#eee",
        textAlign: "center",
        padding: "20px"
      }}
    >
      {status === "verifying" && <p>Verifying your email…</p>}

      {status === "success" && (
        <div>
            <b>Verify Email Status - LGC Concept AI - Learn. Govern. Construct</b>
          <h3>Email verified successfully ✅</h3>
          <p>You can now return and log in to your account.</p>
        </div>
      )}

      {status === "failed" && (
        <div>
            <b>Verify Email Status - LGC Concept AI - Learn. Govern. Construct</b>
          <h3>Verification failed ❌</h3>
          <p>The verification link is invalid or expired.</p>
          <p>Please try registering again to receive a new verification email.</p>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
