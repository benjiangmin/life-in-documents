import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AppRoutes from "./Routes"
import Pages from "./Pages"

export default function Home() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [visible, setVisible] = useState(false) // <-- for animation
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    const handleChange = (e) => {
        const value = e.target.value
        setQuery(value)

        if (value.trim() === "") {
            setResults([])  // clear results if nothing typed
        } else {
            const filtered = AppRoutes.filter(route =>
                (route.title || "").toLowerCase().includes(value.toLowerCase())
            )
            setResults(filtered)
        }
    }

    const handleClick = (path) => {
        navigate(path)
        setQuery("") 
        setResults([])
    }

    return (
        <section className="layout">
            <section
                className="header-section"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(500px)",
                    transition: "opacity 0.5s ease, transform 2.5s ease",
                }}
                >
                <section className="welcome-text">
                    <h1>welcome back, benjamin</h1>
                </section>

                <div className="searchbar">
                    <label>search for a document:</label>
                    <input
                    type="text"
                    placeholder="e.g unsuspicious document #8"
                    value={query}
                    onChange={handleChange}
                    />
                    {results.length > 0 && (
                    <div className="search-results">
                        {results.map((r) => (
                        <button
                            key={r.path}
                            onClick={() => handleClick(r.path)}
                        >
                            {r.path}
                        </button>
                        ))}
                    </div>
                    )}
                </div>
            </section>

            <section className="main-display-section">
                <section className="button-containers">
                    {Pages.map((page, index) => (
                        <Link
                            key={page.path}
                            to={page.path}
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateY(0)" : "translateY(200px)",
                                transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
                            }}
                        >
                            {page.title}
                        </Link>
                    ))}
                </section>
            </section>
        </section>
    )
}