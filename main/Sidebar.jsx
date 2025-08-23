import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import homeImage from "../src/images/home.png"
import backImage from "../src/images/backButton.webp"

export default function Sidebar() {
    const navigate = useNavigate()

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1) // go back if possible
        } else {
            navigate("/") // fallback to home
        }
    }

    return (
        <section className="sidebar">
            <Link to="/">
                <img src={homeImage} alt="Home" className="home-icon"/>
            </Link>

            <button onClick={handleBack} className="back-button">
                <img src={backImage} alt="Back" className="home-icon"/>
            </button>
        </section>
    )
}