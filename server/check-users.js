import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkUsersTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Check table structure
    console.log('📋 Users table structure:');
    const [columns] = await connection.execute('DESCRIBE Users');
    console.table(columns);

    // Check existing users
    console.log('\n👥 Existing users:');
    const [users] = await connection.execute('SELECT id, name, email, isAdmin, createdAt FROM Users');
    if (users.length === 0) {
      console.log('📭 No users found in database');
    } else {
      console.table(users);
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error checking table:', error.message);
  }
}

checkUsersTable();