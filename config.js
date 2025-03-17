const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "KAVI-EXE=jkBCWSpQ#7GVhY4I5ixyPUeQHcBFeWr-VQLNtKCWAbDvVUr6sNc4",
API: process.env.API || 'https://vajira-movie-api.vercel.app',
APIKEY: process.env.APIKEY || 'vajiraofficial',
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
};
