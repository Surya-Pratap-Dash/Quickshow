import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import User from './models/User.js';

dotenv.config();

const testUserCreation = async () => {
  try {
    console.log('🔬 Testing User Creation...\n');
    
    // Connect to database
    console.log('📡 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected\n');

    // Sync models
    console.log('🔄 Syncing models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced\n');

    // Create a test user
    console.log('👤 Creating test user...');
    const testUser = await User.create({
      id: `user-${Date.now()}`,
      email: `user-${Date.now()}@test.com`,
      name: 'Test User',
      image: 'https://via.placeholder.com/150'
    });
    console.log('✅ User created:', testUser.toJSON());
    console.log('\n');

    // List all users
    console.log('📋 Fetching all users...');
    const allUsers = await User.findAll();
    console.log(`✅ Found ${allUsers.length} user(s):\n`);
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ID: ${user.id}`);
    });

    console.log('\n✅ User creation is working correctly!');
    console.log('\n🔍 DIAGNOSIS:');
    console.log('If you see users listed above but they don\'t appear after Clerk login,');
    console.log('the issue is with Clerk webhooks NOT being sent to Inngest.');
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Go to https://dashboard.clerk.com/apps');
    console.log('2. Select your app');
    console.log('3. Go to Webhooks');
    console.log('4. Check if you have a webhook endpoint configured');
    console.log('5. The webhook URL should be: https://your-app-url/api/inngest');
    console.log('6. Make sure events: user.created, user.updated, user.deleted are enabled');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n📋 Details:', error);
    process.exit(1);
  }
};

testUserCreation();
