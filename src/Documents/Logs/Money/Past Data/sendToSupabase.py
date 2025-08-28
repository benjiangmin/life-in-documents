import json
from supabase import create_client
import os

url = "https://csvuktoudnuvctjskjre.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdnVrdG91ZG51dmN0anNranJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTAxNDAsImV4cCI6MjA3MTkyNjE0MH0.fdcxd2WfkLtuVuNsknT4csjFN-umCA5_Qp4a9JpfRI8"
supabase = create_client(url, key)

# Get the folder where this script lives
BASE_DIR = os.path.dirname(__file__)  
json_path = os.path.join(BASE_DIR, "2022_parsed.json")

# Open the JSON file using the full path
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Transform to match Supabase columns
formatted_data = []
for entry in data:
    # Convert month name to number
    month_number = entry["month"]

    date_str = f"{entry['year']}-{month_number:02d}-{entry['day']:02d}"  # e.g., "2022-09-23"
    formatted_data.append({
        "date": date_str,
        "price": entry["price"],
        "name": entry["item"],  # <-- renamed for Supabase
        "type": entry["type"]  # optional, can leave blank
    })

# Batch insert into Supabase
response = supabase.from_("items").insert(formatted_data).execute()

