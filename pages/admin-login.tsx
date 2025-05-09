import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // For demo: password is ADMIN_SECRET from env
    fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Save a session token in localStorage
          localStorage.setItem("admin_session", data.token);
          router.push("/admin");
        } else {
          setError("Invalid password");
        }
      })
      .catch(() => setError("Login failed. Try again."));
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f8fafc" }}>
        <main style={{ width: 350, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "2.5rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "2rem" }}>Admin Login</h2>
          {error && <div style={{ color: "#d90429", marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #ccc", fontSize: "1rem", marginBottom: 16 }}
            />
            <button type="submit" style={{ background: "#0070f3", color: "#fff", padding: "0.75rem 2rem", borderRadius: 8, fontWeight: 600, fontSize: "1.1rem", border: "none", cursor: "pointer", transition: "background 0.2s" }}>
              Login
            </button>
          </form>
        </main>
      </div>
    </>
  );
}
