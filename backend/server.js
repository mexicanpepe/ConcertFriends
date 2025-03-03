const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//mock data for now
const mockUser = {
  email: 'demo@concertfriends.com',
  password: '12345'
};

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === mockUser.email && password === mockUser.password) {
    return res.status(200).json({ status: 'success', token: 'fake-jwt-token' });
  } else {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }
});

// 2) Basic groups endpoint (mock data) as an array
app.get('/groups', (req, res) => {
  res.json([
    { groupId: 1, groupName: 'Weekend Warriors' },
    { groupId: 2, groupName: 'Coachella Crew' }
  ]);
});


//default to 8000 port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
