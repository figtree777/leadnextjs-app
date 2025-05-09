import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage(null);
    
    try {
      // Call our API endpoint for login
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      // Store session in localStorage or use a state management library
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("session", JSON.stringify(data.session));
      
      setMessage({ 
        text: "Login successful! Redirecting...", 
        type: "success" 
      });
      
      // Redirect to home page after successful login
      setTimeout(() => {
        router.push("/");
      }, 1500);
      
    } catch (error: any) {
      setMessage({ 
        text: error.message || "An error occurred during login", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | leadnextjs</title>
        <meta name="description" content="Login to your account" />
      </Head>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <main style={{ width: "100%", maxWidth: 400, backgroundColor: "var(--container-bg)", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "2.5rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>Login</h2>
          
          {message && (
            <div 
              style={{ 
                color: message.type === "error" ? "#d90429" : "#10b981", 
                marginBottom: 16, 
                padding: "10px", 
                borderRadius: "6px",
                backgroundColor: message.type === "error" ? "rgba(217, 4, 41, 0.1)" : "rgba(16, 185, 129, 0.1)",
                fontWeight: 600 
              }}
            >
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px", textAlign: "left" }}>
              <label htmlFor="email" style={{ display: "block", marginBottom: 6, color: "var(--text-primary)" }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: "1rem", backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
              />
            </div>
            
            <div style={{ marginBottom: "24px", textAlign: "left" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: 6, color: "var(--text-primary)" }}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: "1rem", backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: "100%", 
                background: "#0070f3", 
                color: "#fff", 
                border: "none", 
                borderRadius: 6, 
                padding: "0.8rem", 
                fontSize: "1rem", 
                fontWeight: 600, 
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            
            <div style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Don't have an account? <Link href="/register" style={{ color: "#0070f3", textDecoration: "none" }}>Register</Link>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
