import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <h2>Article System</h2>

            <div>
                <Link to="/">Home</Link>
                <Link to="/create">Create Article</Link>
            </div>
        </nav>
    );
}

export default Navbar;