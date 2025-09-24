const axios = require('axios');

const API_URL = 'https://futbol.webmahsul.com.tr/api';

console.log('Testing API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test groups endpoint
api.get('/groups')
  .then(response => {
    console.log('✅ Groups API Success!');
    console.log('Status:', response.status);
    console.log('Data length:', response.data.length);
    console.log('First group:', response.data[0]?.name);
  })
  .catch(error => {
    console.log('❌ Groups API Error!');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  });

// Test club endpoint
api.get('/club')
  .then(response => {
    console.log('✅ Club API Success!');
    console.log('Status:', response.status);
    console.log('Club name:', response.data.name);
  })
  .catch(error => {
    console.log('❌ Club API Error!');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  });
