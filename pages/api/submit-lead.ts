import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin, handleSupabaseError } from '@/utils/supabase-admin';

interface Lead {
  vin: string;
  make: string;
  model: string;
  zip: string;
  phone: string;
  title_in_hand: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Initialize Supabase client
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (error: any) {
    console.error("Error initializing Supabase client:", error);
    return res.status(500).json({ error: error.message || "Failed to initialize database connection" });
  }

  // Validate request body
  const { vin, make, model, zip, phone, titleInHand } = req.body;
  if (!vin || !make || !model || !zip || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert lead
  try {
    const { error } = await supabase
      .from('leads')
      .insert([{ vin, make, model, zip, phone, title_in_hand: !!titleInHand }]);
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Supabase Insert Error:", error);
    return res.status(500).json({ error: "Database error: " + (error?.message || 'Unknown error') });
  }
}

