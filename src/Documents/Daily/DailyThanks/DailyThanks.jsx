import Sidebar from "../../../../main/Sidebar"
import Title from "./Title"
import DisplayEntries from "./displayEntries"
import EnterEntry from "./EnterEntry"
import Datebox from "./DateBox"

export default function DailyThanks() {
    return (
        <section className="daily-thanks-main-display">
            <Sidebar />
            <section className="title-and-display-entries">
                <section className="title-display">
                    <Title />
                </section>
                 <section className="display-entries-display">
                    <DisplayEntries />
                </section>
            </section>
            <section className="datebox-and-enter-entries">
                <section className="datebox-display">
                    <Datebox />
                </section>
                <section className="enter-entry-display"> 
                    <EnterEntry />
                </section>
            </section>
        </section>
    )
}