import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Set to true if you want to see SQL queries in the terminal
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connected Successfully (via Sequelize)');
        return true; // Return success indicator
    } catch (error) {
        console.error('❌ Unable to connect to the MySQL database:', error.message);
        throw error; // Throw error to be caught by caller
    }
};

export const checkDatabaseHealth = async () => {
    try {
        console.log('🔍 Checking database health...');

        // Test basic connection
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Test if we can execute a simple query
        await sequelize.query('SELECT 1 as test');
        console.log('✅ Database query execution successful');

        // Test if our database exists and is accessible
        const [results] = await sequelize.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
        if (results.length === 0) {
            throw new Error(`Database '${process.env.DB_NAME}' does not exist`);
        }
        console.log(`✅ Database '${process.env.DB_NAME}' is accessible`);

        return true;
    } catch (error) {
        console.error('❌ Database health check failed:', error.message);
        throw error;
    }
};