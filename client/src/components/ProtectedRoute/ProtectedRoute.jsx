// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("adminToken");
    return token ? children : <Navigate to="/panel" replace />;
}
