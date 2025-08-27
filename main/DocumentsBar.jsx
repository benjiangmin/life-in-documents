import { Link } from "react-router-dom"
import Documents from "../src/Documents/Documents"
import { useEffect, useState } from "react"

export default function DocumentsBar({ category }) {
    const docs = Documents[category] || []
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // trigger the slide-in after mount
        const timer = setTimeout(() => setVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="document-buttons">
            {docs.map((doc, index) => (
                <Link
                    key={index}
                    to={doc.path}
                    style={{
                        transform: visible ? "translateX(0)" : "translateX(50px)",
                        opacity: visible ? 1 : 0,
                        transition: `transform 0.5s ease ${index * 0.1}s, opacity 0.5s ease ${index * 0.1}s`
                    }}
                >
                    {doc.name}
                </Link>
            ))}
        </section>
    )
}
