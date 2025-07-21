import { Link } from 'react-router';
import logo from "../assets/logo.webp";

export default function Footer() {
    return (
        <footer className="footer">
            {/* Reusing the header logo element and its styles */}
            <div className="header__logo liquid-glass">
                <img className="header__logo--image" src={logo} alt="Triginta Logo"/>
                <h1 className="header__logo--text">triginta</h1>
            </div>

            {/* Wrapper for copyright and navigation links */}
            <div className="text-center">
                <p className="text-sm text-neutral-400">
                    © 2025 Triginta
                </p>
                <div className="flex items-center justify-center gap-x-3 text-sm text-neutral-400 mt-2">
                    <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
                    <span>·</span>
                    <Link to="/games" className="hover:text-white transition-colors duration-200">Games</Link>
                    <span>·</span>
                    <Link to="/about" className="hover:text-white transition-colors duration-200">About</Link>
                </div>
            </div>
        </footer>
    )
}