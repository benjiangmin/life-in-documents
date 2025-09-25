import Sidebar from "../../../../main/Sidebar"
import Title from "./Title"
import DisplayEntries from "./DisplayEntries"
import EnterEntry from "./EnterEntry"
import Datebox from "./DateBox"
import React from "react"

export default function DailyThanks() {
    const [entries, setEntries] = React.useState(() => {
        // Load from localStorage if it exists
        const saved = localStorage.getItem("dailyThanksEntries")
        return saved ? JSON.parse(saved) : []
    })

    const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear())

    const addEntry = (newEntry) => {
        const today = new Date().toISOString().slice(0, 10)
        const updatedEntries = [...entries, { ...newEntry, date: today }]
        setEntries(updatedEntries)
        localStorage.setItem("dailyThanksEntries", JSON.stringify(updatedEntries))
    }

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
                    <DisplayEntries entries={filteredEntries}/>
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
