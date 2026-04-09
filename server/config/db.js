import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || 3306),
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Needed for Aiven's self-signed certificates
            },
            supportBigNumbers: true,
            bigNumberStrings: true,
        },
    }
);

const connectDB = async () => {
  try {
    console.log('🔄 Attempting MySQL connection to:', process.env.DB_HOST);
    await sequelize.authenticate();
    console.log('✅ MySQL Connected via Sequelize to Aiven...');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized...');
  } catch (err) {
    console.error('❌ Sequelize Connection error:', err.message);
    process.exit(1);
  }
};

export { sequelize, connectDB };