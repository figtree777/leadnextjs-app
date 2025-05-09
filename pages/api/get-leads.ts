import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

function validateToken(token: string | undefined) {
  if (!token) return false;
  // For demo: token is a hash generated in admin-auth
  // In real use, you would store/verify sessions in a DB or use JWTs
  return typeof token === "string" && token.length === 64;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Server-side auth: check Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.replace("Bearer ", "");
  if (!validateToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return res.status(200).json({ leads: data });
  } catch (error: any) {
    console.error("Supabase Query Error:", error);
    return res.status(500).json({ error: "Database error" });
  }
}
