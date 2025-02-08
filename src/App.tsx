import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import PublicStatusPage from './pages/PublicStatusPage';
import { AuthProvider } from './context/AuthContext';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/status" element={<PublicStatusPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;