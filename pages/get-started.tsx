import Head from "next/head";
import { useState } from "react";

export default function GetStarted() {
  const [form, setForm] = useState({
    vin: "",
    make: "",
    model: "",
    zip: "",
    phone: "",
    titleInHand: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Get form data for Netlify
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    
    try {
      // Submit to Netlify forms
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString()
      });
      
      if (response.ok) {
        setSubmitted(true);
        
        // You can still send to your API if needed
        try {
          await fetch("/api/submit-lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
          });
        } catch (apiErr) {
          // Silent fail - the form was already submitted to Netlify
          console.error("API submission error:", apiErr);
        }
      } else {
        setError("Submission failed. Please try again.");
      }
    } catch (err) {
      setError("Submission failed. Please try again.");
      console.error("Form submission error:", err);
    }
  };


  return (
    <>
      <Head>
        <title>Get Started | leadnextjs</title>
        <meta name="description" content="Get started with leadnextjs" />
      </Head>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f8fafc" }}>
        <main style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "2.5rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>Get Started</h2>
          {error && (
            <div style={{ color: "#d90429", marginBottom: 16, fontWeight: 600 }}>{error}</div>
          )}
          {submitted ? (
            <div style={{ color: "#0070f3", fontWeight: 600, textAlign: "left" }}>
              <div>Thank you! Here is your submission:</div>
              <ul style={{ margin: '1rem 0 0 0', padding: 0, listStyle: 'none', color: '#222', fontWeight: 400 }}>
                <li><b>VIN:</b> {form.vin}</li>
                <li><b>Make:</b> {form.make}</li>
                <li><b>Model:</b> {form.model}</li>
                <li><b>Zip Code:</b> {form.zip}</li>
                <li><b>Phone Number:</b> {form.phone}</li>
                <li><b>Title in Hand?</b> {form.titleInHand ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          ) : (
            <form 
              name="vehicle-lead" 
              method="POST" 
              data-netlify="true" 
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              {/* Hidden fields needed for Netlify form detection */}
              <input type="hidden" name="form-name" value="vehicle-lead" />
              <p style={{ display: 'none' }}>
                <label>Don't fill this out if you're human: <input name="bot-field" /></label>
              </p>
              <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
                <label htmlFor="vin" style={{ display: "block", marginBottom: 6, color: "#333" }}>VIN</label>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  value={form.vin}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #ccc", fontSize: "1rem" }}
                />
              </div>
              <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
                <label htmlFor="make" style={{ display: "block", marginBottom: 6, color: "#333" }}>Make</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={form.make}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #ccc", fontSize: "1rem" }}
                />
              </div>
              <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
                <label htmlFor="model" style={{ display: "block", marginBottom: 6, color: "#333" }}>Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #ccc", fontSize: "1rem" }}
                />
              </div>
              <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
                <label htmlFor="zip" style={{ display: "block", marginBottom: 6, color: "#333" }}>Zip Code</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  required
                  pattern="\d{5}"
                  maxLength={5}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #ccc", fontSize: "1rem" }}
                />
              </div>
              <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
                <label htmlFor="phone" style={{ display: "block", marginBottom: 6, color: "#333" }}>Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #ccc", fontSize: "1rem" }}
                />
              </div>
              <div style={{ marginBottom: "1.5rem", textAlign: "left", display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="titleInHand"
                  name="titleInHand"
                  checked={form.titleInHand}
                  onChange={handleChange}
                  style={{ marginRight: 8 }}
                />
                <label htmlFor="titleInHand" style={{ color: "#333", margin: 0 }}>Title in Hand?</label>
              </div>
              <button type="submit" style={{ background: "#0070f3", color: "#fff", padding: "0.75rem 2rem", borderRadius: 8, fontWeight: 600, fontSize: "1.1rem", border: "none", cursor: "pointer", transition: "background 0.2s" }}>Submit</button>
            </form>
          )}
        </main>
      </div>
    </>
  );
}
