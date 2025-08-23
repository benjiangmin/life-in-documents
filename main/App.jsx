import { HashRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Home"
import SecondaryPage from "./SecondaryPage"
import Pages from "./Pages"
import DocumentRoutes from "./Routes"

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />

                {Pages.map(page => (
                <Route
                    key={page.path}
                    path={page.path}
                    element={
                    <SecondaryPage 
                        title={page.title} 
                        description={page.description} 
                        example={page.example} 
                        category={page.category}
                    />
                    }
                />
                ))}

                {DocumentRoutes.map((r, index) => (
                    <Route key={index} path={r.path} element={<r.element />} />
                ))}
            </Routes>
        </Router>
    )
}