import { Link } from "react-router-dom"
import Pages from "./Pages"

export default function Home() {
    return (
        <>
            <section className="header-section">
            <section className="welcome-text">
                    <h1>welcome back, benjamin</h1>
            </section>

            <form className="searchbar">
                    <label>search for a document:</label>
                    <input type="text" placeholder="e.g unsuspicious document #8"/>
            </form>
            </section>

            <section className="main-display-section">
                <h3>browse through full list of documents below:</h3>
                <section className="button-containers">
                    {Pages.map(page => (
                        <Link key={page.path} to={page.path}>
                            {page.title}
                        </Link>
                    ))}
                </section>
            </section>

        </>
    )
}
