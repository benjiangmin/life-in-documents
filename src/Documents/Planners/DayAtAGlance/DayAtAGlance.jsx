import Sidebar from "../../../../main/Sidebar"
import School from "../DayAtAGlance/School"
import Other from "../DayAtAGlance/Other"

export default function TheDailyStuffs() {
    return (
        <section className="the-daily-stuffs-main">
            <Sidebar />
            <section className="school-section">
                <School />
            </section>
            <section className="other-section">
                <Other />
            </section>
        </section>
    )
}