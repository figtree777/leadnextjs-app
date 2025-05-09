import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow DELETE
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get lead ID from request
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: "Lead ID is required" });
    }
    
    // Get Supabase admin client
    const supabase = getSupabaseAdmin();
    
    // Try to delete the lead
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    // If we get an RLS error, try with admin rights
    if (error && error.message.includes("row-level security")) {
      try {
        console.log("Attempting to delete with RLS bypass...");
        
        // Use the service role key if available (this bypasses RLS)
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (serviceRoleKey) {
          const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_DATABASE_URL || "",
            serviceRoleKey
          );
          
          const { error: adminError } = await supabaseAdmin
            .from('leads')
            .delete()
            .eq('id', id);
            
          if (adminError) {
            throw adminError;
          }
          
          return res.status(200).json({ 
            success: true, 
            message: "Lead deleted successfully with admin rights"
          });
        }
      } catch (adminErr: any) {
        console.error("Error with admin delete:", adminErr);
        return res.status(500).json({ error: adminErr.message || "Failed to delete lead with admin rights" });
      }
    }
    
    if (error) {
      console.error("Error deleting lead:", error);
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Lead deleted successfully"
    });
    
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message || "An error occurred" });
  }
}
