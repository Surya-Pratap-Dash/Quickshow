import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
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

export const connectDB = async () => {
    try {
        console.log('🔄 Attempting MySQL connection to:', process.env.DB_HOST);
        await sequelize.authenticate();
        console.log('✅ MySQL Connected Successfully (via Sequelize to Aiven)');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the MySQL database:', error.message);
        throw error;
    }
};

export const checkDatabaseHealth = async () => {
    try {
        console.log('🔍 Checking database health...');

        await sequelize.authenticate();
        console.log('✅ Database connection established');

        await sequelize.query('SELECT 1 as test');
        console.log('✅ Database query execution successful');

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