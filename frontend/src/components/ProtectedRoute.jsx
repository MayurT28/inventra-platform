import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const token =
        localStorage.getItem("token");

    // No token
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Authorized
    return children;
}

export default ProtectedRoute;