// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import GroupDashboard from './components/GroupDashBoard';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Import a playful cursive-like Google Font */
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

  body {
    margin: 0;
    padding: 0;
    background: #FDE4CF; /* a soft pastel orange */
    font-family: 'Pacifico', cursive;
    color: #3E2723;  /* a deeper brown for text */
  }

  /* Reset some default margins for headings, etc. */
  h1, h2, h3, h4, h5, h6 {
    margin: 0.5em 0;
  }
`;

const NavBar = styled.nav`
  padding: 1rem;
  background: #FFE7CE;  /* slightly different pastel */
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  a {
    margin-right: 1rem;
    text-decoration: none;
    color: #6D3E5D;  /* a soft purple hue */
    font-weight: bold;
    &:hover {
      text-decoration: underline;
      color: #BF658F; /* a deeper tone on hover */
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
          <Link to="/dashboard">Group Dashboard</Link>
        </NavBar>
        <MainContainer>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<GroupDashboard />} />
            <Route
              path="/"
              element={<h2 style={{ margin: '2rem 0' }}>Welcome to Concert Friends (Home)</h2>}
            />
          </Routes>
        </MainContainer>
      </BrowserRouter>
    </>
  );
};

export default App;
