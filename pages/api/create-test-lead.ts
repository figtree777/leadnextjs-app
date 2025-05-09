import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get Supabase admin client
    const supabase = getSupabaseAdmin();
    
    // Create a test lead
    const testLead = {
      vin: "1HGCM82633A123456",
      make: "Honda",
      model: "Accord",
      zip: "90210",
      phone: "5551234567",
      title_in_hand: true,
      submitted_at: new Date().toISOString()
    };
    
    // Insert the test lead
    const { data, error } = await supabase
      .from('leads')
      .insert([testLead])
      .select();
      
    if (error) {
      console.error("Error creating test lead:", error);
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Test lead created successfully",
      lead: data[0]
    });
    
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message || "An error occurred" });
  }
}
