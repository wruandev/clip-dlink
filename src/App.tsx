import { Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AddLinkPage from './pages/links/AddLinkPage';
import EditLinkPage from './pages/links/EditLinkPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />

      <Route path="/links">
        <Route path="add" element={<AddLinkPage />} />
        <Route path=":id" element={<EditLinkPage />} />
      </Route>

      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
