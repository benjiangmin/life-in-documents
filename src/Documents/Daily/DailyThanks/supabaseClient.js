import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ezcjwmgjfkueqdpvpife.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Y2p3bWdqZmt1ZXFkcHZwaWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjY0NzksImV4cCI6MjA3NDY0MjQ3OX0.wzDECGCsLEmdAUgywMs_7zUIrJayVACMRHsmA6k65F0"
export const supabase = createClient(supabaseUrl, supabaseKey)
