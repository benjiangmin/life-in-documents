import { Link, useNavigate, useLocation } from "react-router-dom"
import homeImage from "../src/images/home.png"
import backImage from "../src/images/backButton.webp"

export default function Sidebar({ onOpenBacklog }) {
    const navigate = useNavigate();
    const handleBack = () => {
        if (window.history.length > 1) navigate(-1);
        else navigate("/");
    };

    return (
        <section className="sidebar">
            <Link to="/">
                <img src={homeImage} alt="Home" className="home-icon"/>
            </Link>

            <button onClick={handleBack} className="back-button">
                <img src={backImage} alt="Back" className="home-icon"/>
            </button>

            {onOpenBacklog && (
                <button className="backlog-button" onClick={onOpenBacklog}>
                    Backlog
                </button>
            )}
        </section>
    );
}
