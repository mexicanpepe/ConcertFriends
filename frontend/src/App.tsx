import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import GroupDashboard from './components/GroupDashBoard';
import styled from 'styled-components';

const NavBar = styled.nav`
  padding: 1rem;
  background: #ddd;
  margin-bottom: 1rem;

  a {
    margin-right: 1rem;
    text-decoration: none;
    color: #333;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Group Dashboard</Link>
      </NavBar>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<GroupDashboard />} />
        <Route path="/" element={<h2 style={{ margin: '2rem' }}>Welcome to Concert Friends (Home)</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

