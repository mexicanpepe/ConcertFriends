// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'; // ✅ Added Navigate
import LoginPage from './components/LoginPage';
import GroupDashboard from './components/GroupDashBoard';
import CreateGroup from './components/CreateGroup';
import styled, { createGlobalStyle } from 'styled-components';
import GroupDetails from './components/GroupDetails';


const GlobalStyle = createGlobalStyle`

  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

  body {
    margin: 0;
    padding: 0;
    background: #FDE4CF;
    font-family: 'Pacifico', cursive;
    color: #3E2723;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0.5em 0;
  }
`;

const NavBar = styled.nav`
  padding: 1rem;
  background: #FFE7CE;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  a {
    margin-right: 1rem;
    text-decoration: none;
    color: #6D3E5D;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
      color: #BF658F;
    }
  }
`;

const MainContainer = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1rem;
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <NavBar>
          <Link to="/login">Login</Link>
          <Link to="/group">Group Dashboard</Link>
        </NavBar>
        <MainContainer>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<GroupDashboard />} />
            <Route path="/group" element={<GroupDashboard />} />
            <Route path="/group/create" element={<CreateGroup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/group/:groupId" element={<GroupDetails />} />
          </Routes>
        </MainContainer>
      </BrowserRouter>
    </>
  );
};

export default App;
