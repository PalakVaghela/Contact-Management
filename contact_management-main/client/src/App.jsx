import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Auth/Admin/AdminDashboard';
import UserDashboard from './pages/User/UserDashboard';
import { ProtectedRoute, ProtectedRouteNonAdmin } from './components/ProtectedRoute';
import Signup from './pages/Auth/Signup';
import PageNotFound from './pages/pageNotFound/PageNotFound';

function App() {
  return (
    
      <Router>
        <ToastContainer/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>}/>

          {/* Admin Dashboard*/}
          <Route
            path="/admin-dashboard/*"
            element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />}
          />

          {/* UserDashboard*/}
          <Route path="/dashboard" element={<ProtectedRouteNonAdmin element={<UserDashboard />} />} />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
      </Router>
  );
}

export default App;
