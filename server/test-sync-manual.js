// Test script to manually trigger user sync
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

async function testUserSync() {
  try {
    console.log('🧪 Testing user sync endpoint...');

    // Mock user data (similar to what Clerk would provide)
    const mockUser = {
      userId: 'test-user-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      imageUrl: 'https://example.com/avatar.jpg'
    };

    console.log('Sending payload:', mockUser);

    const response = await axios.post('/user/sync', mockUser);
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testUserSync();