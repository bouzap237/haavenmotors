const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./')); 

// 1. Setup the Email Transporter (Only one needed)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bouzapsteve@gmail.com',      // Your Gmail address
        pass: 'azcg wfmn lull yjuh'         // Your 16-character App Password
    }
});

// 2. Contact Form Endpoint
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

// 3. Automated Chatbot Endpoint
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

app.listen(PORT, () => {
    console.log(`🚀 Heaven Motors Backend running at http://localhost:${PORT}`);
});