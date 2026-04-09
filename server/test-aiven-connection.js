import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const testAivenConnection = async () => {
  console.log('🔍 Testing Aiven MySQL Connection...\n');
  
  // Display configuration (without password)
  console.log('📋 Configuration Details:');
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Port: ${process.env.DB_PORT}`);
  console.log(`  User: ${process.env.DB_USER}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log(`  Password: ${process.env.DB_PASS ? '***' + process.env.DB_PASS.slice(-4) : 'NOT SET'}\n`);

  // Test 1: Connect with SSL (Aiven standard)
  console.log('🔄 Test 1: Connecting with SSL (Aiven standard)...');
  try {
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || 3306),
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
          ssl: 'Amazon RDS',
          supportBigNumbers: true,
          bigNumberStrings: true,
        },
      }
    );

    await sequelize.authenticate();
    console.log('✅ SSL Connection: SUCCESS\n');

    // Test 2: Run a simple query
    console.log('🔄 Test 2: Executing test query...');
    const result = await sequelize.query('SELECT 1 as test');
    console.log('✅ Query Execution: SUCCESS\n');

    // Test 3: Check if database exists
    console.log('🔄 Test 3: Checking if database exists...');
    const [databases] = await sequelize.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
    if (databases.length > 0) {
      console.log(`✅ Database '${process.env.DB_NAME}' exists\n`);
    } else {
      console.log(`⚠️  Database '${process.env.DB_NAME}' NOT FOUND\n`);
    }

    // Test 4: Check tables
    console.log('🔄 Test 4: Checking existing tables...');
    const [tables] = await sequelize.query('SHOW TABLES');
    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} table(s):`);
      tables.forEach((table) => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
      console.log();
    } else {
      console.log('ℹ️  No tables found. This is normal on first sync.\n');
    }

    // Test 5: Check MySQL version
    console.log('🔄 Test 5: Checking MySQL version...');
    const [version] = await sequelize.query('SELECT VERSION() as version');
    console.log(`✅ MySQL Version: ${version[0].version}\n`);

    console.log('✅ All tests passed! Your Aiven MySQL connection is working correctly.');
    console.log('📝 Your database is ready. Run: npm start');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ SSL Connection: FAILED');
    console.error(`   Error: ${error.message}\n`);

    // Try alternative: rejectUnauthorized: false
    console.log('🔄 Test 1b: Retrying with rejectUnauthorized: false...');
    try {
      const sequelize2 = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || 3306),
          dialect: 'mysql',
          logging: false,
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
            supportBigNumbers: true,
            bigNumberStrings: true,
          },
        }
      );

      await sequelize2.authenticate();
      console.log('✅ Connection with disabled certificate validation: SUCCESS\n');
      console.log('⚠️  Note: Certificate validation is disabled. This is not recommended for production.\n');

      // Still run tests
      const [tables] = await sequelize2.query('SHOW TABLES');
      console.log(`✅ Database connected. Found ${tables.length} table(s).`);
      
      await sequelize2.close();
      process.exit(0);

    } catch (error2) {
      console.error('❌ Alternative connection: FAILED');
      console.error(`   Error: ${error2.message}\n`);

      // Diagnostic tips
      console.log('🔧 Troubleshooting steps:\n');
      console.log('1️⃣  Verify Aiven credentials in .env file:');
      console.log(`   - DB_HOST should be: quickshowdb-767-suryadashpratap-07e5.i.aivencloud.com`);
      console.log(`   - DB_USER should be: avnadmin`);
      console.log(`   - DB_PORT should be: 23918`);
      console.log(`   - DB_NAME should be: quickshow_db\n`);

      console.log('2️⃣  Check Aiven firewall/network rules:');
      console.log('   - Log in to https://console.aiven.io');
      console.log('   - Go to your MySQL service');
      console.log('   - Check "Network" settings to ensure your IP is allowed\n');

      console.log('3️⃣  Test direct connection (if MySQL CLI is installed):');
      console.log(`   mysql -h ${process.env.DB_HOST} -P ${process.env.DB_PORT} -u ${process.env.DB_USER} -p\n`);

      console.log('4️⃣  Common error causes:');
      console.log('   - Wrong password or username');
      console.log('   - Firewall blocking the connection');
      console.log('   - SSL certificate issues');
      console.log('   - Database service is stopped\n');

      console.log('Error details:', error2.message);
      process.exit(1);
    }
  }
};

testAivenConnection();
