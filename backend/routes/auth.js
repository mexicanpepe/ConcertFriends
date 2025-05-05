// backend/routes/auth.js

import express from 'express';
import admin from '../firebase-admin.js';
import pool from '../DB/db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Firebase Google Auth POST endpoint
router.post('/firebase-login', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Missing Firebase ID token' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (Username, Email) VALUES ($1, $2)',
        [name, email]
      );
      console.log('✅ New user inserted into Users table.');
    } else {
      console.log('🔁 User already exists.');
    }

    return res.status(200).json({ email, name, picture });
  } catch (error) {
    console.error('❌ Firebase token verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
