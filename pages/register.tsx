import Head from "next/head";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Initialize Supabase client
let supabase: ReturnType<typeof createClient>;
try {
  // Client-side code can only access NEXT_PUBLIC_ prefixed env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  throw error;
}

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: ""
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
    
    // Basic validation
    if (form.password !== form.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }
    
    if (form.password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            phone: form.phone,
            user_type: "buyer" // Tag this user as a buyer
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      setMessage({ 
        text: "Registration successful! Please check your email to confirm your account.", 
        type: "success" 
      });
      
      // Clear form after successful registration
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: ""
      });
      
    } catch (error: any) {
      setMessage({ 
        text: error.message || "An error occurred during registration", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | leadnextjs</title>
        <meta name="description" content="Register for a buyer account" />
      </Head>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <main style={{ width: "100%", maxWidth: 500, backgroundColor: "var(--container-bg)", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "2.5rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>Create Buyer Account</h2>
          
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
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label htmlFor="firstName" style={{ display: "block", marginBottom: 6, color: "var(--text-primary)" }}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: "1rem", backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
                />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label htmlFor="lastName" style={{ display: "block", marginBottom: 6, color: "var(--text-primary)" }}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: "1rem", backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
                />
              </div>
            </div>
            
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
            
            <div style={{ marginBottom: "16px", textAlign: "left" }}>
              <label htmlFor="phone" style={{ display: "block", marginBottom: 6, color: "var(--text-primary)" }}>Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                maxLength={10}
                style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: "1rem", backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
              />
              <small style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>10-digit number without spaces or dashes</small>
            </div>
            
            <div style={{ marginBottom: "16px", textAlign: "left" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: 6, color: "var(--text-primary)" }}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: "1rem", backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
              />
            </div>
            
            <div style={{ marginBottom: "24px", textAlign: "left" }}>
              <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: 6, color: "var(--text-primary)" }}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: "1rem", backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                background: "var(--accent)", 
                color: "#fff", 
                padding: "0.75rem 2rem", 
                borderRadius: 8, 
                fontWeight: 600, 
                fontSize: "1.1rem", 
                border: "none", 
                cursor: loading ? "not-allowed" : "pointer", 
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s, background 0.2s",
                width: "100%"
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          <div style={{ marginTop: "24px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" legacyBehavior>
              <a style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                Log in
              </a>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
