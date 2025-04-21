import pool from './db.js';


//test data base based on .env values
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Postgres database successfully!');
    client.release();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  }
}

testConnection();
