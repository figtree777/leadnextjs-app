import type { NextApiRequest, NextApiResponse } from "next";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

  // Validate env variables
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables:", {
      SUPABASE_DATABASE_URL: supabaseUrl,
      SUPABASE_ANON_KEY: supabaseKey,
    });
    return res.status(500).json({ error: "Supabase environment variables are not set. Check your .env.local and deployment settings." });
  }

  // Validate request body
  const { vin, make, model, zip, phone, titleInHand } = req.body;
  if (!vin || !make || !model || !zip || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create Supabase client
  let supabase: SupabaseClient;
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error("Failed to create Supabase client:", err);
    return res.status(500).json({ error: "Failed to initialize Supabase client." });
  }

  // Insert lead
  try {
    const { error } = await supabase
      .from('leads')
      .insert<Lead>([{ vin, make, model, zip, phone, title_in_hand: !!titleInHand }]);
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Supabase Insert Error:", error);
    return res.status(500).json({ error: "Database error: " + (error?.message || 'Unknown error') });
  }
}

