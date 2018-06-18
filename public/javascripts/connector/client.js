const axios = require('axios');

module.exports = axios.create({
    baseURL: 'https://api.nexmo.com/',
    timeout: 5000
});
