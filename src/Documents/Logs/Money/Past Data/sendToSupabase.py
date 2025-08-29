import json
from supabase import create_client
import os

url = "https://csvuktoudnuvctjskjre.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdnVrdG91ZG51dmN0anNranJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTAxNDAsImV4cCI6MjA3MTkyNjE0MH0.fdcxd2WfkLtuVuNsknT4csjFN-umCA5_Qp4a9JpfRI8"
supabase = create_client(url, key)

# Get the folder where this script lives
BASE_DIR = os.path.dirname(__file__)  
json_path = os.path.join(BASE_DIR, "2025_august_parsed.json")

# Open the JSON file using the full path
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Format data for Supabase
formatted_data = []
for entry in data:
    formatted_data.append({
        "date": entry["date"],  # already in YYYY-MM-DD format
        "price": entry.get("price", 0),
        "name": entry.get("name") or entry.get("item", ""),
        "type": entry.get("type", "other")
    })

# Insert into Supabase
response = supabase.from_("items").insert(formatted_data).execute()

