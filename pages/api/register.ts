import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin, handleSupabaseError } from '@/utils/supabase-admin';

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get Supabase admin client
    const supabase = getSupabaseAdmin();
    
    // Extract registration data
    const { email, password, firstName, lastName, phone } = req.body as RegistrationData;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Register the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
          user_type: "buyer" // Tag this user as a buyer
        }
      }
    });
    
    if (error) {
      console.error("Supabase registration error:", error);
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Registration successful! Please check your email to confirm your account."
    });
    
  } catch (err: any) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: err.message || "An error occurred during registration" });
  }
}
