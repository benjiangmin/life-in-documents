import Sidebar from "../../../../main/Sidebar"
import Title from "./Title"
import DisplayEntries from "./DisplayEntries"
import EnterEntry from "./EnterEntry"
import Datebox from "./DateBox"
import React from "react"

export default function DailyThanks() {
    const [entries, setEntries] = React.useState([])

    const addEntry = (newEntry) => {
        setEntries((prev) => [...prev, newEntry])
    }

    return (
        <section className="daily-thanks-main-display">
            <Sidebar />
            <section className="title-and-display-entries">
                <section className="title-display">
                    <Title />
                </section>
                 <section className="display-entries-display">
                    <DisplayEntries entries={entries}/>
                </section>
            </section>
            <section className="datebox-and-enter-entries">
                <section className="datebox-display">
                    <Datebox />
                </section>
                <section className="enter-entry-display"> 
                    <EnterEntry onSubmitEntry={addEntry}/>
                </section>
            </section>
        </section>
    )
}