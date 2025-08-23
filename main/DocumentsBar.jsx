import { Link } from "react-router-dom"
import Documents from "../src/Documents/Documents"

export default function DocumentsBar({ category }) {
    const docs = Documents[category] || []

    return (
        <section className="document-buttons">
            {docs.map((doc, index) => (
                <Link key={index} to={doc.path}>
                    {doc.name}
                </Link>
            ))}
        </section>
    )
}