import React, { useState, useEffect } from "react";
import Sidebar from "../../../../main/Sidebar";
import Title from "./Title";
import DisplayEntries from "./DisplayEntries";
import EnterEntry from "./EnterEntry";
import Datebox from "./DateBox";
import { supabase } from "./supabaseClient"; // adjust path if needed

export default function DailyThanks() {
  const [entries, setEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [visible, setVisible] = React.useState(false)

  useEffect(() => {
    loadEntries();
  }, []);

  // Animate visibility
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const loadEntries = async () => {
    const { data, error } = await supabase
      .from("gratitudes")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }); // ensure newest first within same date

    if (error) console.error("Error loading entries:", error.message);
    else setEntries(data);
  };

  // Add new entry (all 3 gratitudes in one row)
  const addEntry = async (newEntry) => {
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

    const { data, error } = await supabase.from("gratitudes").insert([
      {
        date: today,
        input1: newEntry.input1,
        input2: newEntry.input2,
        input3: newEntry.input3
      }
    ]);

    if (error) console.error("Error inserting entry:", error.message);
    else loadEntries(); // refresh state
  };

  // Save edited entry
  const handleSaveEntry = async (id, updatedValues) => {
    const { data, error } = await supabase
      .from("gratitudes")
      .update(updatedValues)
      .eq("id", id);

    if (error) console.error("Error updating:", error.message);
    else loadEntries();
  };

  // Helper to parse YYYY-MM-DD safely in local time
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Filter & sort entries by month/year
  const filteredEntries = entries
    .filter((entry) => {
      const d = parseDate(entry.date);
      return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
    })
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <section className="daily-thanks-main-display">
      <Sidebar />
      <section className="title-and-display-entries">
        <section className={`title-display ${visible ? "visible" : ""}`}>
          <Title />
        </section>

        <section className={`display-entries-display ${visible ? "visible" : ""}`}>
          <DisplayEntries
            entries={filteredEntries}
            onSaveEntry={handleSaveEntry}
          />
        </section>
      </section>

      <section className="datebox-and-enter-entries">
        <section className={`datebox-display ${visible ? "visible" : ""}`}>
          <Datebox
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onChangeMonth={setSelectedMonth}
            onChangeYear={setSelectedYear}
          />
        </section>

        <section className={`enter-entry-display ${visible ? "visible" : ""}`}>
          <EnterEntry onSubmitEntry={addEntry} />
        </section>
      </section>
    </section>
  );
}
