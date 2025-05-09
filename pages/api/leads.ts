import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from '@/utils/supabase-admin';

interface Lead {
  id: number;
  make: string;
  model: string;
  zip: string;
  title_in_hand: boolean;
  submitted_at: string;
  phone: string;
  vin: string;
  [key: string]: any; // For any additional fields
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get Supabase admin client
    const supabase = getSupabaseAdmin();
    
    console.log("Fetching leads from database...");
    
    // Fetch leads with all columns
    const { data, error } = await supabase
      .from('leads')
      .select('*');
      
    if (error) {
      console.error("Supabase query error:", error);
      return res.status(500).json({ error: error.message || "Failed to fetch leads" });
    }
    
    console.log(`Found ${data?.length || 0} leads in database`);
    
    if (!data || data.length === 0) {
      return res.status(200).json([]);
    }
    
    // Mask sensitive fields
    const maskedData = data.map((lead: Lead) => ({
      ...lead,
      // Mask phone number
      phone: '***-***-' + (lead.phone ? lead.phone.substring(Math.max(0, lead.phone.length - 4)) : '****'),
      
      // Mask VIN - show first 3 and last 3 characters
      vin: lead.vin 
        ? `${lead.vin.substring(0, 3)}******${lead.vin.substring(Math.max(0, lead.vin.length - 3))}`
        : '***********'
    }));
    
    return res.status(200).json(maskedData);
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({ 
      error: error.message || "An unexpected error occurred while fetching leads"
    });
  }
}
