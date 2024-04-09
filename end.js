const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Twilio setup
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const twilioClient = twilio(accountSid, authToken);

app.use(bodyParser.json());

app.post('/notify-helpline', (req, res) => {
    const { locationUrl } = req.body;
    const helplineNumbers = ['+1234567890']; // Your helpline numbers

    Promise.all(helplineNumbers.map(number => {
        return twilioClient.messages.create({
            body: `Emergency! The user requires assistance. Their location is: ${locationUrl}`,
            from: 'YOUR_TWILIO_PHONE_NUMBER',
            to: number
        });
    }))
    .then(messages => {
        console.log('Messages sent:', messages);
        res.status(200).json({ message: 'Helpline notified' });
    })
    .catch(error => {
        console.error('Sending message failed:', error);
        res.status(500).json({ message: 'Failed to notify helpline' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
