import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://twxgarxyrbcwpzdndjgy.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eGdhcnh5cmJjd3B6ZG5kamd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NDcyMjksImV4cCI6MjA3MjUyMzIyOX0.SAAh0gLczHkAdslNnAqI0RM4Nzdw73CD2NJ36PUiAgM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
