import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from '@/utils/supabase-admin';

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
    
    // Delete the lead
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
      
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
