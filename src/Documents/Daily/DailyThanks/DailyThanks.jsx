import Sidebar from "../../../../main/Sidebar"
import Title from "./Title"
import DisplayEntries from "./DisplayEntries"
import EnterEntry from "./EnterEntry"
import Datebox from "./DateBox"
import React from "react"

export default function DailyThanks() {
    // Load entries from localStorage if available
    const [entries, setEntries] = React.useState(() => {
        const saved = localStorage.getItem("dailyThanksEntries")
        return saved ? JSON.parse(saved) : []
    })

    const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear())
    const [editingEntry, setEditingEntry] = React.useState(null)

    // Add new entry
    const addEntry = (newEntry) => {
        const today = new Date().toISOString().slice(0, 10)
        const updatedEntries = [...entries, { ...newEntry, date: today }]
        setEntries(updatedEntries)
        localStorage.setItem("dailyThanksEntries", JSON.stringify(updatedEntries))
    }

    // Save edited entry
    const handleSaveEdit = (updatedEntry) => {
        const updatedEntries = entries.map(e => e === editingEntry ? updatedEntry : e)
        setEntries(updatedEntries)
        localStorage.setItem("dailyThanksEntries", JSON.stringify(updatedEntries))
        setEditingEntry(null)
    }

    // Filter entries by selected month/year
    const filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate.getFullYear() === selectedYear && (entryDate.getMonth() + 1) === selectedMonth
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
                        onSaveEntry={(updatedEntry) => {
                            const updatedEntries = entries.map(e => e === updatedEntry ? updatedEntry : e);
                            setEntries(updatedEntries);
                            localStorage.setItem("dailyThanksEntries", JSON.stringify(updatedEntries));
                        }}
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
                    <EnterEntry onSubmitEntry={addEntry}/>
                </section>
            </section>
        </section>
    )
}
