import { Link } from "react-router-dom"
import DocumentsBar from "./DocumentsBar"
import Sidebar from "./Sidebar"

export default function SecondaryPage(props) {
    return (
        <section className="secondary-page">
            <Sidebar />
            <section className="maintext-side">
                <h1>{props.title}</h1>
                <p>{props.description}</p>

                <form className="searchbar">
                    <label>search through {props.title}:</label>
                    <input type="text" placeholder={`e.g ${props.example}`}/>
                </form>
            </section>

            <section className="display-side">
                <section className="secondary-display">
                    <DocumentsBar 
                        category={props.category}
                    />
                </section>
            </section>
        </section>
    )
}