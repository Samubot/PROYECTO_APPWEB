import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

export const Layout = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg bg-purple-600 text-white p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <h1 className="text-xl font-bold">Sistema de Gestion de Tareas</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm sm:text-base font-medium">
              {usuario?.nombre}
            </span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-300 text-lg"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};