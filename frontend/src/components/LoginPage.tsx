import React, { useState } from 'react';
import styled from 'styled-components';
import GoogleLogin from './GoogleLogin';

const LoginWrapper = styled.div`
  background: #FFF7F0;
  border: 1px solid #FFCBA4;
  border-radius: 8px;
  margin: 2rem auto;
  padding: 1.5rem;
  max-width: 400px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
  color: #6D3E5D;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  box-sizing: border-box;
  border: 1px solid #FFCBA4;
  border-radius: 4px;
  font-family: 'Pacifico', cursive;
`;

const SubmitButton = styled.button`
  background-color: #FFB09E;
  color: #3E2723;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-family: 'Pacifico', cursive;
  cursor: pointer;
  width: 100%;
  margin-bottom: 1rem;

  &:hover {
    background-color: #E79788;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
  margin: 1rem 0;
`;

const StatusMessage = styled.p`
  margin-top: 1rem;
  font-weight: bold;
  color: #008000;
  text-align: center;
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();

      if (resp.ok) {
        setStatusMsg(`Logged in successfully! Token: ${data.token}`);
      } else {
        setStatusMsg(`Login failed: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      setStatusMsg('Error connecting to server');
    }
  };

  return (
    <LoginWrapper>
      <Title>Concert Friends - Login</Title>

      <form onSubmit={handleLogin}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Login</SubmitButton>
      </form>

      <Divider />

      <GoogleLogin />

      {statusMsg && <StatusMessage>{statusMsg}</StatusMessage>}
    </LoginWrapper>
  );
};

export default LoginPage;
