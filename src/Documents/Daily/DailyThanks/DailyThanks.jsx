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

            {/* Edit Entry Modal */}
            {editingEntry && (
                <EditEntryModal
                    entry={editingEntry}
                    onClose={() => setEditingEntry(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </section>
    )
}

// Modal component
function EditEntryModal({ entry, onClose, onSave }) {
    const [input1, setInput1] = React.useState(entry.input1)
    const [input2, setInput2] = React.useState(entry.input2)
    const [input3, setInput3] = React.useState(entry.input3)
    const [date, setDate] = React.useState(entry.date)

    const handleSave = () => {
        onSave({ ...entry, input1, input2, input3, date })
    }

    return (
        <div className="modal-overlay" style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
            <div className="modal-content" style={{
                backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "300px"
            }}>
                <h2>Edit Entry</h2>
                <label>Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
                <br />
                <label>1: <input value={input1} onChange={e => setInput1(e.target.value)} /></label>
                <br />
                <label>2: <input value={input2} onChange={e => setInput2(e.target.value)} /></label>
                <br />
                <label>3: <input value={input3} onChange={e => setInput3(e.target.value)} /></label>
                <br /><br />
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose} style={{ marginLeft: "10px" }}>Cancel</button>
            </div>
        </div>
    )
}
