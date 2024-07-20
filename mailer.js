const nodemailer = require('nodemailer');
require('dotenv').config();

// OAuth2 client setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'charlesrussellllovido.naag@bicol-u.edu.ph', // Replace with your Gmail address
        clientId:'608224176552-up9ch4g97e7354fj38v721jnngrida94.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04KfzFa5gEprNCgYIARAAGAQSNgF-L9Ir_bekE68Ow6e7L6WXBklkpeq9T41fpFH7EPXIyHlSl70zHLUNQRcL2QSfPeIr7m9eCQ'
    }
});

module.exports = transporter;
