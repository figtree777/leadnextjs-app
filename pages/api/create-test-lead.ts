import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get Supabase admin client
    const supabase = getSupabaseAdmin();
    
    // Create a test lead with a random VIN and model to make it unique
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const testLead = {
      vin: `1HGCM82633A${randomSuffix}`,
      make: "Honda",
      model: `Accord ${randomSuffix}`,
      zip: "90210",
      phone: "5551234567",
      title_in_hand: true,
      submitted_at: new Date().toISOString(),
      is_test: true // Mark as a test lead
    };
    
    // Insert the test lead using RLS bypass
    const { data, error } = await supabase
      .from('leads')
      .insert([testLead])
      .select();
      
    // If we get an RLS error, try with admin rights
    if (error && error.message.includes("row-level security")) {
      try {
        console.log("Attempting to insert with RLS bypass...");
        
        // Use the service role key if available (this bypasses RLS)
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (serviceRoleKey) {
          const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_DATABASE_URL || "",
            serviceRoleKey
          );
          
          const { data: adminData, error: adminError } = await supabaseAdmin
            .from('leads')
            .insert([testLead])
            .select();
            
          if (adminError) {
            throw adminError;
          }
          
          return res.status(200).json({ 
            success: true, 
            message: "Test lead created successfully with admin rights",
            lead: adminData[0]
          });
        }
      } catch (adminErr: any) {
        console.error("Error with admin insert:", adminErr);
        return res.status(500).json({ error: adminErr.message || "Failed to create test lead with admin rights" });
      }
    }
    
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
