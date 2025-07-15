import logo from "../assets/logo.webp";
import { Link } from "react-router";

export default function Header() {
    return (
        <header className="header flex items-center">
            <div className="header__logo">
                <img className="header__logo--image" src={logo} />
                <h1 className="header__logo--text">triginta</h1>
            </div>

            <div className="hidden md:flex flex-1 h-[1px] border-t border-white/20 border-dashed mx-4 self-center" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}></div>

            <nav className="header__nav ">
                <Link className="header__nav--link" to="/">Home</Link>
                <Link className="header__nav--link" to="/games">Games</Link>
                <Link className="header__nav--link" to="/about">About</Link>
                {/* <Link className="header__nav--link" to="/contact">Contact</Link> */}
            </nav>
        </header>
    )
}
