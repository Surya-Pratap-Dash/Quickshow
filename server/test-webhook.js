import User from './models/User.js';

const testUserCreationDirectly = async () => {
  console.log('🧪 Testing User Creation Directly...\n');

  // Mock Clerk event data
  const mockEventData = {
    id: `test-user-${Date.now()}`,
    first_name: "Test",
    last_name: "User",
    email_addresses: [
      {
        email_address: `test-${Date.now()}@example.com`
      }
    ],
    image_url: "https://via.placeholder.com/150"
  };

  try {
    console.log('📤 Creating user directly with Clerk-like data...');
    console.log('Event data:', JSON.stringify(mockEventData, null, 2));

    // Simulate the Inngest function logic
    const { id, first_name, last_name, email_addresses, image_url } = mockEventData;

    if (!id || !email_addresses || email_addresses.length === 0) {
      throw new Error("Missing required user data");
    }

    const userData = {
      id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    console.log("💾 Creating user with data:", userData);
    const createdUser = await User.create(userData);
    console.log("✅ User created successfully:", createdUser.toJSON());

  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    console.error('Full error:', error);
  }

  // Check if user was created
  try {
    console.log('\n🔍 Checking all users in database...');
    const checkResponse = await fetch('http://localhost:3000/api/test/all-users');
    const users = await checkResponse.json();

    console.log(`📊 Found ${users.count} users in database:`);
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ID: ${user.id}`);
    });

    const testUser = users.users.find(u => u.email.includes('test-'));
    if (testUser) {
      console.log('\n✅ SUCCESS: User creation logic works!');
      console.log('🎉 The issue is NOT with the database or user creation code.');
      console.log('\n🔧 ROOT CAUSE: Clerk webhooks are not configured to trigger Inngest functions.');
      console.log('\n📋 SOLUTION: Configure Clerk webhooks');
      console.log('1. Go to https://dashboard.clerk.com');
      console.log('2. Select your app');
      console.log('3. Go to Webhooks → Add Endpoint');
      console.log('4. URL: http://localhost:3000/api/inngest (local) or your deployed URL');
      console.log('5. Enable events: user.created, user.updated, user.deleted');
      console.log('\n⚠️  For production, use your Render URL: https://your-app.onrender.com/api/inngest');
    } else {
      console.log('\n❌ FAILURE: User creation failed even with direct call.');
      console.log('🔧 Issue: Database or model problem.');
    }

  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  }
};

testUserCreationDirectly();