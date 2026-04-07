import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use the full URL if available (Railway), otherwise fallback to separate pieces (Local)
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected to Railway via Sequelize...');

    // Sync models (creates tables in Railway automatically)
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database synchronized...');
  } catch (err) {
    console.error('❌ Sequelize Connection error:', err);
    process.exit(1);
  }
};

export { sequelize, connectDB };