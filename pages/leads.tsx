import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Lead {
  id: number;
  make: string;
  model: string;
  zip: string;
  title_in_hand: boolean;
  submitted_at: string;
  phone: string;
  vin: string;
}

export default function LeadsCatalog() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem("session");
    if (!session) {
      console.log("No session found, redirecting to login");
      router.push("/login?redirect=leads");
      return;
    }

    console.log("Session found, fetching leads");
    
    // Create a test lead first to ensure we have data
    const createTestLead = async () => {
      try {
        const response = await fetch("/api/create-test-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        
        if (!response.ok) {
          console.warn("Could not create test lead, but continuing");
        } else {
          console.log("Test lead created successfully");
        }
      } catch (err) {
        console.warn("Error creating test lead:", err);
      }
    };

    // Fetch leads
    const fetchLeads = async () => {
      try {
        // First create a test lead
        await createTestLead();
        
        // Then fetch all leads
        const response = await fetch("/api/leads");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch leads");
        }
        
        const data = await response.json();
        console.log("Leads fetched successfully:", data);
        setLeads(data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching leads:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeads();
  }, [router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <>
      <Head>
        <title>Leads Catalog | leadnextjs</title>
        <meta name="description" content="Browse available leads" />
      </Head>
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>Leads Catalog</h1>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading leads...</p>
          </div>
        ) : error ? (
          <div style={{ 
            color: "#d90429", 
            padding: "1rem", 
            borderRadius: "6px",
            backgroundColor: "rgba(217, 4, 41, 0.1)",
            marginBottom: "1rem" 
          }}>
            {error}
          </div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
            <p>No leads found. Check back later for new listings.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {leads.map((lead) => (
              <div 
                key={lead.id} 
                style={{ 
                  backgroundColor: "var(--container-bg)", 
                  borderRadius: "8px", 
                  padding: "1.5rem", 
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  border: "1px solid var(--border-color)"
                }}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  {lead.make} {lead.model}
                </h2>
                
                <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Submitted {formatDate(lead.submitted_at)}
                </div>
                
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 500 }}>Location:</span> {lead.zip}
                </div>
                
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 500 }}>Title in Hand:</span> {lead.title_in_hand ? "Yes" : "No"}
                </div>
                
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 500 }}>VIN:</span> <span style={{ color: "var(--text-secondary)" }}>{lead.vin}</span>
                </div>
                
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 500 }}>Contact:</span> <span style={{ color: "var(--text-secondary)" }}>{lead.phone}</span>
                </div>
                
                <button 
                  style={{ 
                    marginTop: "1rem",
                    background: "#0070f3", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "6px", 
                    padding: "0.6rem 1rem", 
                    fontSize: "0.9rem", 
                    fontWeight: 500, 
                    cursor: "pointer",
                    width: "100%"
                  }}
                  onClick={() => alert("Contact the seller to get full details!")}
                >
                  Request Full Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
