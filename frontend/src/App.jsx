import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <div>
            <Navbar />

            <div className="container">
                <Outlet />
            </div>

            <ToastContainer position="top-right" />
        </div>
    );
}

export default App;