import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import ResetPassword from './pages/reset-password'; // Import your reset password component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;