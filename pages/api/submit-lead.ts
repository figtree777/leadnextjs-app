import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { vin, make, model, zip, phone, titleInHand } = req.body;

  if (!vin || !make || !model || !zip || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { error } = await supabase
      .from('leads')
      .insert([{ vin, make, model, zip, phone, title_in_hand: titleInHand }]);
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Supabase Insert Error:", error);
    return res.status(500).json({ error: "Database error" });
  }
}
