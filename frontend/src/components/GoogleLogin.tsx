import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase-config';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();

const GoogleLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      cookies.set('auth-token', idToken, { path: '/' });


      const response = await fetch('http://localhost:8000/auth/firebase-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        }
      });

      const user = await response.json();
      console.log('User data from backend:', user);

      navigate('/group');

    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  return (
    <button onClick={handleLogin} style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
      Sign in with Google
    </button>
  );
};

export default GoogleLogin;
