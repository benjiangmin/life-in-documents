import { useEffect, useState } from "react";
import Sidebar from "../../../../main/Sidebar"
import School from "../DayAtAGlance/School"
import Other from "../DayAtAGlance/Other"

export default function TheDailyStuffs() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="the-daily-stuffs-main">
            <Sidebar />
            <section className={`school-section ${visible ? "visible" : ""}`}>
                <School />
            </section>
            <section className={`other-section ${visible ? "visible" : ""}`}>
                <Other />
            </section>
        </section>
    )
}
