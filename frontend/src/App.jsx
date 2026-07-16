import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <div>
                <Navbar />

                <div className="container" style={{ padding: "0 24px" }}>
                    <Outlet />
                </div>

                <ToastContainer position="top-right" />
            </div>
        </AuthProvider>
    );
}

export default App;