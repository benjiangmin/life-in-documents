import React, { useState, useEffect } from "react"
import Sidebar from "../../../../main/Sidebar"
import Title from "./Title"
import DisplayEntries from "./DisplayEntries"
import EnterEntry from "./EnterEntry"
import Datebox from "./DateBox"
import { supabase } from "./supabaseClient" // make sure path matches

export default function DailyThanks() {
  const [entries, setEntries] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Load entries from Supabase on mount
  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    const { data, error } = await supabase
      .from("gratitudes")
      .select("*")
      .order("date", { ascending: false });

    if (error) console.error("Error loading entries:", error.message);
    else setEntries(data);
  };


  // Add new entry (3 separate rows)
  const addEntry = async (newEntry) => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Insert one row with all 3 gratitudes
    const { data, error } = await supabase.from("gratitudes").insert([
      {
        date: today,
        input1: newEntry.input1,
        input2: newEntry.input2,
        input3: newEntry.input3
      }
    ]);

    if (error) {
      console.error("Error inserting entry:", error.message);
    } else {
      console.log("Entry added:", data);
      loadEntries(); // refresh your state to show the new entry
    }
  };


  // Save edited entry from DisplayEntries modal
  const handleSaveEntry = async (id, updatedValues) => {
    const { data, error } = await supabase
      .from("gratitudes")
      .update({ text: updatedValues.text })
      .eq("id", id)

    if (error) {
      console.error("Error updating:", error.message)
    } else {
      console.log("Updated:", data)
      loadEntries()
    }
  }

  // Filter entries by selected month/year
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date || entry.created_at)
    return (
      entryDate.getFullYear() === selectedYear &&
      entryDate.getMonth() + 1 === selectedMonth
    )
  })

  return (
    <section className="daily-thanks-main-display">
      <Sidebar />
      <section className="title-and-display-entries">
        <section className="title-display">
          <Title />
        </section>

        <section className="display-entries-display">
          <DisplayEntries
            entries={filteredEntries}
            onSaveEntry={handleSaveEntry}
          />
        </section>
      </section>

      <section className="datebox-and-enter-entries">
        <section className="datebox-display">
          <Datebox
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onChangeMonth={setSelectedMonth}
            onChangeYear={setSelectedYear}
          />
        </section>

        <section className="enter-entry-display">
          <EnterEntry onSubmitEntry={addEntry} />
        </section>
      </section>
    </section>
  )
}
