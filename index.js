require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
const HELPLINE_NUMBER = process.env.HELPLINE_NUMBER;

app.post('/send-sms', async (req, res) => {
    const { message } = req.body;

    try {
        const { default: fetch } = await import('node-fetch');
        
        const smsResponse = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                'Authorization': FAST2SMS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender_id: 'FSTSMS',
                message: message,
                language: 'english',
                route: 'p',
                numbers: [HELPLINE_NUMBER],
            })
        });

        const smsData = await smsResponse.json();
        console.log(smsData);
        res.json(smsData);
    } catch (error) {
        console.error('Failed to send SMS:', error);
        res.status(500).json({ error: 'Failed to send SMS', details: error.message });
    }
});
app.get('/', (req, res) => {
    res.send('Server is running. Ready to send notifications.');
});

const cors = require('cors');
app.use(cors());



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
