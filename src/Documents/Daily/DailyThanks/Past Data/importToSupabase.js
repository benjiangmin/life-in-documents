import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Replace with your actual Supabase URL and anon key
const supabaseUrl = "https://ezcjwmgjfkueqdpvpife.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Y2p3bWdqZmt1ZXFkcHZwaWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjY0NzksImV4cCI6MjA3NDY0MjQ3OX0.wzDECGCsLEmdAUgywMs_7zUIrJayVACMRHsmA6k65F0";
const supabase = createClient(supabaseUrl, supabaseKey);

// Load your JSON file
const pastData = JSON.parse(fs.readFileSync("pastData_2025.json", "utf-8"));

async function importData() {
  for (const entry of pastData) {
    const { data, error } = await supabase
      .from("gratitudes") // replace with your table name
      .insert([
        {
          date: entry.date,
          input1: entry.input1,
          input2: entry.input2,
          input3: entry.input3
        }
      ]);

    if (error) console.error("Error inserting", entry.date, error.message);
    else console.log("Inserted entry for", entry.date);
  }
  console.log("Import complete!");
}

importData();
