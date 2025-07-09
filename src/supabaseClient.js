import { createClient } from '@supabase/supabase-js';

// Read the keys securely from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create and export the Supabase client as a single instance
export const supabase = createClient(supabaseUrl, supabaseKey);