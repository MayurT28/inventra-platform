import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SalesPage from "./pages/SalesPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="/sales" element={<SalesPage />} />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>

      <footer
        className="
          border-t
          border-gray-200
          py-4
          text-center
          text-sm
          text-gray-500
          bg-white
        "
      >
        Designed & Developed by{" "}
        <span className="font-semibold text-gray-700">Mayur Tonge</span>
      </footer>
    </div>
  );
}

export default App;
