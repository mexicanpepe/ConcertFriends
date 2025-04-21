// backend/routes/festivals.js

import express from 'express';
import pool from '../DB/db.js';

const router = express.Router();

// ✅ Already existing - GET list of festivals
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT festivalid, festival_name, year, days
      FROM festivals
      ORDER BY festival_name ASC, year ASC
    `);

    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return res.status(500).json({ error: 'Failed to fetch festivals' });
  }
});

// ✅ NEW - GET artists for a specific festival
router.get('/festival-artists/:festivalId', async (req, res) => {
  const { festivalId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT a.artistid, a.artist_name
      FROM festivalartists fa
      INNER JOIN artists a ON a.artistid = fa.artistid
      WHERE fa.festivalid = $1
      ORDER BY fa.day ASC, a.artist_name ASC
      `,
      [festivalId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching festival artists:', error);
    return res.status(500).json({ error: 'Failed to fetch festival artists' });
  }
});

export default router;
