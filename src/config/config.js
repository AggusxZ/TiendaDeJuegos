require('dotenv').config();

const config = {
  mongoURI: process.env.MONGO_URI,
  sessionSecret: process.env.SESSION_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET
};

module.exports = config;