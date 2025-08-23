import { Link } from "react-router-dom"
import homeImage from "../src/images/home.png"
import DocumentsBar from "./DocumentsBar"

export default function SecondaryPage(props) {
    return (
        <section className="secondary-page">
            <Link to="/" className="sidebar">
                <img src={homeImage} alt="Home" className="home-icon"/>
            </Link>
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