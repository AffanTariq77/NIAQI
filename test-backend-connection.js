// Backend Connection Test Script
// Run this to verify your app can hit the backend

const API_CONFIG = {
  BASE_URL: 'https://niaqi-backend.onrender.com/api'
};

async function testBackendConnection() {
  console.log('🔍 Testing Backend Connection...\n');
  console.log(`Backend URL: ${API_CONFIG.BASE_URL}\n`);

  // Test 1: Root endpoint
  console.log('Test 1: Root Endpoint');
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/`);
    const text = await response.text();
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Response: ${text}\n`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  // Test 2: Signup endpoint (with invalid data to test connection)
  console.log('Test 2: Auth Signup Endpoint');
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!',
      }),
    });
    const data = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Response:`, JSON.stringify(data, null, 2), '\n');
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  // Test 3: Login endpoint
  console.log('Test 3: Auth Login Endpoint');
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!',
      }),
    });
    const data = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Response:`, JSON.stringify(data, null, 2), '\n');
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  console.log('✨ Test Complete!\n');
  console.log('Summary:');
  console.log('- If you see status codes (200, 400, 401, etc.) = Backend is responding! ✅');
  console.log('- If you see "Error: fetch failed" = Connection problem ❌');
  console.log('\nYour frontend can communicate with backend if you see status codes above.');
}

// Run the test
testBackendConnection();
