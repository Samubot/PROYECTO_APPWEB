import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./routes/PrivateRoutes";
import { Login } from "./pages/Login/Login";
import { Contacto } from "./pages/Contacto/Contacto";
import { Layout } from "./components/Layout";
import { Tareas } from "./pages/Tareas/Tareas.tsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/tareas" />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/tareas" element={<Tareas />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;