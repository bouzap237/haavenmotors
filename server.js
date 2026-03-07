require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// 1. Dynamic Port for Railway
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./')); 

// 2. Setup the Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS 
    }
});

// 3. Contact Form Endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
        from: 'Heaven Motors <bouzapsteve@gmail.com>', 
        to: 'bouzapsteve@gmail.com',                 
        subject: `✨ New Heaven Motors Lead: ${name}`,
        text: `You have a new inquiry:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ Email Error:", error);
            return res.status(500).json({ success: false, message: "Email failed to send." });
        }
        console.log('✅ Lead emailed successfully: ' + info.response);
        res.json({ success: true, message: "Inquiry sent! We will contact you soon." });
    });
});

// 4. Automated Chatbot Endpoint
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    let botReply = "I'm the Heaven Motors assistant. Ask me about our inventory or financing.";

    if (userMessage.includes('finance')) {
        botReply = "We offer 0% APR financing for the first 12 months on select models.";
    } else if (userMessage.includes('hello') || userMessage.includes('hi')) {
        botReply = "Hello! Welcome to Heaven Motors. Which car can I show you today?";
    }

    setTimeout(() => {
        res.json({ reply: botReply });
    }, 500);
});

// 5. Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Heaven Motors Backend live on port ${PORT}`);
});