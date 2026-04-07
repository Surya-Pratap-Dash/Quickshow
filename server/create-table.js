import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        image VARCHAR(500),
        isAdmin BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Users table created successfully');

    // Check if table exists
    const [rows] = await connection.execute('SHOW TABLES LIKE "Users"');
    if (rows.length > 0) {
      console.log('✅ Users table verified');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
  }
}

createTable();