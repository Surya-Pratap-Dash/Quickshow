import fetch from 'node-fetch';

async function testUserSync() {
  try {
    const testUser = {
      id: 'test-user-123',
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg'
    };

    const response = await fetch('http://localhost:3000/api/user/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const result = await response.json();
    console.log('Sync Response:', result);

    if (response.ok) {
      console.log('✅ User sync successful');
    } else {
      console.log('❌ User sync failed');
    }
  } catch (error) {
    console.error('❌ Error testing sync:', error.message);
  }
}

testUserSync();