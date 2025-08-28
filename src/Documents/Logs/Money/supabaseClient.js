import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://csvuktoudnuvctjskjre.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdnVrdG91ZG51dmN0anNranJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTAxNDAsImV4cCI6MjA3MTkyNjE0MH0.fdcxd2WfkLtuVuNsknT4csjFN-umCA5_Qp4a9JpfRI8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
