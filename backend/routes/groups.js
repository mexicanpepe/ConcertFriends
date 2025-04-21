// backend/routes/groups.js

import express from 'express';
import admin from '../firebase-admin.js';
import pool from '../DB/db.js';

const router = express.Router();

// ✅ First: /groups/user-groups
router.get('/user-groups', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Missing Firebase ID token' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    const userResult = await pool.query('SELECT userid FROM users WHERE email = $1', [userEmail]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const userId = userResult.rows[0].userid;

    const groupResult = await pool.query(`
      SELECT g.groupid, g.group_name AS groupname
      FROM groups g
      INNER JOIN groupmembers gm ON gm.groupid = g.groupid
      WHERE gm.userid = $1
    `, [userId]);

    return res.json(groupResult.rows);

  } catch (error) {
    console.error('Error in /groups/user-groups:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// ✅ Then: /groups/create
router.post('/create', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  const { festivalId, groupName } = req.body;

  if (!idToken) {
    return res.status(401).json({ error: 'Missing Firebase ID token' });
  }

  if (!festivalId || !groupName) {
    return res.status(400).json({ error: 'Missing festivalId or groupName' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    const userResult = await pool.query('SELECT userid FROM users WHERE email = $1', [userEmail]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const userId = userResult.rows[0].userid;

    const insertGroupResult = await pool.query(
      `
      INSERT INTO groups (group_name, creator_id, festival_id)
      VALUES ($1, $2, $3)
      RETURNING groupid
      `,
      [groupName, userId, festivalId]
    );

    const newGroupId = insertGroupResult.rows[0].groupid;

    await pool.query(
      `
      INSERT INTO groupmembers (groupid, userid)
      VALUES ($1, $2)
      `,
      [newGroupId, userId]
    );

    console.log('✅ New group created and user added as member');

    return res.status(201).json({ message: 'Group created successfully', groupId: newGroupId });

  } catch (error) {
    console.error('Error in /groups/create:', error);
    return res.status(500).json({ error: 'Failed to create group' });
  }
});

// ✅ Then: /groups/user-priority-list/save
router.post('/user-priority-list/save', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Missing Firebase ID token' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    const userResult = await pool.query('SELECT userid FROM users WHERE email = $1', [userEmail]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const userId = userResult.rows[0].userid;
    const { groupId, festivalId, artistIds } = req.body;

    if (!groupId || !festivalId || !artistIds || artistIds.length === 0) {
      return res.status(400).json({ error: 'Missing group, festival, or artistIds' });
    }

    // ✅ Delete previous list if exists
    await pool.query(
      `
      DELETE FROM userprioritylist
      WHERE groupid = $1 AND userid = $2
      `,
      [groupId, userId]
    );

    await pool.query(
      `
      INSERT INTO userprioritylist (groupid, userid, festivalid, day, artist_list, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      `,
      [groupId, userId, festivalId, 1, JSON.stringify(artistIds)]
    );

    console.log('✅ Saved user priority list for user:', userId);

    return res.status(201).json({ message: 'Priority list saved successfully' });

  } catch (error) {
    console.error('Error saving user priority list:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Finally: /groups/:groupId/group-priority-list
router.get('/:groupId/group-priority-list', async (req, res) => {
  const { groupId } = req.params;

  try {
    const userListsResult = await pool.query(
      `
      SELECT artist_list
      FROM userprioritylist
      WHERE groupid = $1
      `,
      [groupId]
    );

    const allArtistLists = userListsResult.rows.map(row => row.artist_list);

    if (allArtistLists.length === 0) {
      return res.status(404).json({ error: 'No priority lists found for this group yet' });
    }

    const pointsMap = new Map();

    for (const artistList of allArtistLists) {
      artistList.forEach((artistId, index) => {
        const points = 10 - index;
        if (pointsMap.has(artistId)) {
          pointsMap.set(artistId, pointsMap.get(artistId) + points);
        } else {
          pointsMap.set(artistId, points);
        }
      });
    }

    const sortedArtists = Array.from(pointsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topArtistIds = sortedArtists.map(entry => entry[0]);

    const artistDataResult = await pool.query(
      `
      SELECT artistid, artist_name
      FROM artists
      WHERE artistid = ANY($1)
      `,
      [topArtistIds]
    );

    const artistIdToName = new Map(
      artistDataResult.rows.map(row => [row.artistid, row.artist_name])
    );

    const finalList = topArtistIds.map(artistId => ({
      artistId,
      artistName: artistIdToName.get(artistId),
      points: pointsMap.get(artistId),
    }));

    return res.json(finalList);

  } catch (error) {
    console.error('Error in /groups/:groupId/group-priority-list:', error);
    return res.status(500).json({ error: 'Failed to compute group priority list' });
  }
});

export default router;
