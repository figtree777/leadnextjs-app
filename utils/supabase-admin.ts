import { createClient } from '@supabase/supabase-js';

/**
 * Creates and returns a Supabase client with admin privileges for server-side operations.
 * This should only be used in API routes or server-side code, never in client-side code.
 */
export const getSupabaseAdmin = () => {
  // Try NEXT_PUBLIC_ prefixed variables first, then fall back to non-prefixed ones
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL || process.env.SUPABASE_DATABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL environment variable. Please set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_DATABASE_URL, or SUPABASE_DATABASE_URL');
  }
  
  if (!supabaseKey) {
    throw new Error('Missing Supabase key environment variable. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY');
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

/**
 * Error handler for Supabase operations
 * @param error The error object from Supabase
 * @returns An object with status code and error message
 */
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  // Common error codes and their appropriate status codes
  const errorMap: Record<string, number> = {
    'auth/invalid-email': 400,
    'auth/email-already-in-use': 409,
    'auth/weak-password': 400,
    'auth/user-not-found': 404,
    'auth/wrong-password': 401,
    // Add more error codes as needed
  };
  
  const statusCode = errorMap[error.code] || 500;
  
  return {
    statusCode,
    message: error.message || 'An unexpected error occurred'
  };
};
