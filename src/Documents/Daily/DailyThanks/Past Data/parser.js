import fs from "fs";

// Mapping of month names (full and 3-letter abbreviations) to numbers
const months = {
  January: "01", Jan: "01",
  February: "02", Feb: "02",
  March: "03", Mar: "03",
  April: "04", Apr: "04",
  May: "05",
  June: "06", Jun: "06",
  July: "07", Jul: "07",
  August: "08", Aug: "08",
  September: "09", Sep: "09",
  October: "10", Oct: "10",
  November: "11", Nov: "11",
  December: "12", Dec: "12",
};

// Read raw file
const raw = fs.readFileSync("raw_data_2025.txt", "utf-8");
const lines = raw
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l !== "");

let currentMonth = "";
let currentYear = "2025";
let currentDay = "";
const entries = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Month header (with optional colon)
  const monthName = line.replace(":", "");
  if (months[monthName]) {
    currentMonth = months[monthName];
    continue;
  }

  // Day line (allow plain numbers or numbers with suffix)
  const dayMatch = line.match(/^(\d+)(st|nd|rd|th)?:?$/);
  if (dayMatch) {
    currentDay = dayMatch[1].padStart(2, "0");
    continue;
  }

  // Skip lines if month or day not yet set
  if (!currentMonth || !currentDay) continue;

  // Collect gratitudes until next day/month header
  const gratitudes = [];
  let j = i;
  while (
    j < lines.length &&
    !/^(\d+)(st|nd|rd|th)?:?$/.test(lines[j]) &&
    !months[lines[j].replace(":", "")]
  ) {
    gratitudes.push(lines[j]);
    j++;
  }

  // Ensure all 3 inputs are filled, fill missing with "nothing else ig"
  const input1 = gratitudes[0] || "nothing else ig";
  const input2 = gratitudes[1] || "nothing else ig";
  const input3 = gratitudes.slice(2).join(" | ") || "nothing else ig"; // merge extra lines

  const date = `${currentYear}-${currentMonth}-${currentDay}`;
  entries.push({ date, input1, input2, input3 });

  i = j - 1; // Move index past the processed gratitudes
}

// Write JSON file
fs.writeFileSync("pastData_2025.json", JSON.stringify(entries, null, 2));
console.log("Created pastData_2025.json with", entries.length, "entries.");
