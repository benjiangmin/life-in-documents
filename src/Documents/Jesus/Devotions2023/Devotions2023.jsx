import Sidebar from "../../../../main/Sidebar"
import ScrollableDates from "../Devotions2023/ScrollableDates"
import CurrentDevotion from "../Devotions2023/CurrentDevotion"
import Title from "../Devotions2023/Title"
import DevotionalLinks from "../Devotions2023/DevotionalLinks"
import VerseOfTheDay from "../Devotions2023/VerseOfTheDay"

export default function Devotions2023() {
    return (
        <section className="devotions-main-page">
            <Sidebar />
            
            <section className="devotions-display-left-side">
                <section className="scrollable-dates-display">
                    <ScrollableDates />
                </section>
                <section className="current-devotion-display">
                    <CurrentDevotion />
                </section>
            </section>

            <section className="devotions-display-right-side">
                <section className="title-for-devotions-display">
                    <Title />
                </section>
                <section className="devotional-links-display">
                    <DevotionalLinks />
                </section>
                <section className="verse-of-the-day-display">
                    <VerseOfTheDay />
                </section>
            </section>
        </section>
    )
}