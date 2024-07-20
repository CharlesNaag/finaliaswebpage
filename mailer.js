const nodemailer = require('nodemailer');
require('dotenv').config();

// OAuth2 client setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'charlesrussellllovido.naag@bicol-u.edu.ph', // Replace with your Gmail address
        clientId:608224176552-up9ch4g97e7354fj38v721jnngrida94.apps.googleusercontent.com,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
    }
});

module.exports = transporter;
