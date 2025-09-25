import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DocumentsBar from "./DocumentsBar";
import Sidebar from "./Sidebar";


export default function SecondaryPage(props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 50); // slight delay before animation
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="secondary-page">
            <section className="raise-z-index">
                <Sidebar />
            </section>
            <section 
                className="maintext-side"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-900px)",
                    transition: "opacity 0s ease, transform 1s ease",
                    zIndex:"1"
                }}
            >
                <h1>{props.title}</h1>
                <p>{props.description}</p>

                <form className="searchbar second-searchbar">
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