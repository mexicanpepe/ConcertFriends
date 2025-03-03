import React, { useState } from 'react';
import styled from 'styled-components';

const LoginWrapper = styled.div`
  margin: 2rem;
  padding: 1rem;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
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
  margin-bottom: 0.5rem;
  box-sizing: border-box;
`;

const StatusMessage = styled.p`
  margin-top: 1rem;
  font-weight: bold;
  color: #008000;
`;

interface ILoginProps {}

const LoginPage: React.FC<ILoginProps> = () => {
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
        <button type="submit">Login</button>
      </form>
      {statusMsg && <StatusMessage>{statusMsg}</StatusMessage>}
    </LoginWrapper>
  );
};

export default LoginPage;
