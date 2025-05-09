import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Lead {
  id: number;
  vin: string;
  make: string;
  model: string;
  zip: string;
  phone: string;
  title_in_hand: boolean;
  submitted_at: string;
}

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Simple client-side auth check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_session");
      if (!token) {
        router.replace("/admin-login");
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_session") : null;
    fetch("/api/get-leads", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
      .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        setLeads(data.leads || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load leads.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Admin | View Leads</title>
        <meta name="description" content="View all submitted leads" />
      </Head>
      <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem 0" }}>
        <main style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "2.5rem 2rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "2rem", textAlign: "center" }}>Leads Admin Panel</h2>
          {loading && <div>Loading leads...</div>}
          {error && <div style={{ color: '#d90429', fontWeight: 600 }}>{error}</div>}
          {!loading && !error && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '10px', border: '1px solid #eee' }}>ID</th>
                    <th style={{ padding: '10px', border: '1px solid #eee' }}>VIN</th>
                    <th style={{ padding: '10px', border: '1px solid #eee' }}>Make</th>
                    <th style={{ padding: '10px', border: '1px solid #eee' }}>Model</th>
                    <th style={{ padding: '10px', border: '1px solid #eee' }}>Zip</th>
                    <th style={{ padding: '10px', border: '1px solid #eee' }}>Phone</th>
                    <th style={{ padding: '10px', border: '1px solid #eee' }}>Title in Hand?</th>
                    <th style={{ padding: '10px', border: '1px solid #eee' }}>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>No leads found.</td></tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id}>
                        <td style={{ padding: '8px', border: '1px solid #eee' }}>{lead.id}</td>
                        <td style={{ padding: '8px', border: '1px solid #eee' }}>{lead.vin}</td>
                        <td style={{ padding: '8px', border: '1px solid #eee' }}>{lead.make}</td>
                        <td style={{ padding: '8px', border: '1px solid #eee' }}>{lead.model}</td>
                        <td style={{ padding: '8px', border: '1px solid #eee' }}>{lead.zip}</td>
                        <td style={{ padding: '8px', border: '1px solid #eee' }}>{lead.phone}</td>
                        <td style={{ padding: '8px', border: '1px solid #eee' }}>{lead.title_in_hand ? 'Yes' : 'No'}</td>
                        <td style={{ padding: '8px', border: '1px solid #eee' }}>{new Date(lead.submitted_at).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
