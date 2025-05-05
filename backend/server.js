// backend/server.js

import app from './app.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🎵 Concert Friends Backend running on http://localhost:${PORT}`);
});
