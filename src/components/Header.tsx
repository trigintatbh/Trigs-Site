import logo from "../assets/logo.webp";
import { Link } from "react-router";

export default function Header() {
    return (
        <header className="header">
            <div className="header__logo">
                <img className="header__logo--image" src={logo} />
                <h1 className="header__logo--text">triginta</h1>
            </div>
            <nav className="header__nav">
                <Link className="header__nav--link" to="/">Home</Link>
                <Link className="header__nav--link" to="/games">Games</Link>
                <Link className="header__nav--link" to="/about">About</Link>
                <Link className="header__nav--link" to="/contact">Contact</Link>
            </nav>
        </header>
    )
}