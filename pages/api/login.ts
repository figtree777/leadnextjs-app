import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin, handleSupabaseError } from '@/utils/supabase-admin';

interface LoginData {
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get Supabase admin client
    const supabase = getSupabaseAdmin();
    
    // Extract login data
    const { email, password } = req.body as LoginData;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Authenticate the user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error:", error);
      return res.status(401).json({ 
        error: error.message || "Invalid login credentials" 
      });
    }
    
    // Return user data and session
    return res.status(200).json({ 
      success: true,
      user: data.user,
      session: data.session
    });
    
  } catch (err: any) {
    console.error("Authentication error:", err);
    return res.status(500).json({ 
      error: err.message || "An error occurred during login" 
    });
  }
}
