import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Disable logging to avoid Sequelize deprecation warnings
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected...');

    // Sync all models with database (create tables if they don't exist)
    await sequelize.sync();
    console.log('Database synchronized...');
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
};

export  { sequelize, connectDB };