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
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
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

  // Delete a lead
  const deleteLead = async (id: number) => {
    try {
      setDeleting(id);
      const response = await fetch(`/api/delete-lead?id=${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete lead");
      }
      
      // Remove the lead from the state
      setLeads(leads.filter(lead => lead.id !== id));
      setDeleting(null);
    } catch (err: any) {
      console.error("Error deleting lead:", err);
      setError(err.message);
      setDeleting(null);
    }
  };

  // Create a test lead
  const createTestLead = async () => {
    try {
      setCreating(true);
      const response = await fetch("/api/create-test-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create test lead");
      }
      
      const data = await response.json();
      console.log("Test lead created:", data);
      
      // Refresh leads list
      const leadsResponse = await fetch("/api/leads");
      const leadsData = await leadsResponse.json();
      setLeads(leadsData);
      
      setCreating(false);
    } catch (err: any) {
      console.error("Error creating test lead:", err);
      setError(err.message);
      setCreating(false);
    }
  };
  
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>Leads Catalog</h1>
          
          <button 
            onClick={createTestLead}
            disabled={creating}
            style={{ 
              background: "var(--primary-color, #0070f3)", 
              color: "white", 
              border: "none", 
              borderRadius: "0.5rem", 
              padding: "0.5rem 1rem", 
              fontSize: "0.9rem", 
              fontWeight: 500, 
              cursor: creating ? "not-allowed" : "pointer",
              opacity: creating ? 0.7 : 1,
              transition: "all 0.2s ease"
            }}
          >
            {creating ? "Creating..." : "Create Test Lead"}
          </button>
        </div>
        
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
                
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <button 
                    style={{ 
                      flex: "1",
                      background: "#0070f3", 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: "6px", 
                      padding: "0.6rem 1rem", 
                      fontSize: "0.9rem", 
                      fontWeight: 500, 
                      cursor: "pointer"
                    }}
                    onClick={() => alert("Contact the seller to get full details!")}
                  >
                    Request Details
                  </button>
                  
                  <button 
                    style={{ 
                      background: "#d90429", 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: "6px", 
                      padding: "0.6rem 1rem", 
                      fontSize: "0.9rem", 
                      fontWeight: 500, 
                      cursor: deleting === lead.id ? "not-allowed" : "pointer",
                      opacity: deleting === lead.id ? 0.7 : 1
                    }}
                    onClick={() => deleteLead(lead.id)}
                    disabled={deleting === lead.id}
                  >
                    {deleting === lead.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
