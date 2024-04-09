const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'women_security'
});

connection.connect();

app.post('/submit-contacts', (req, res) => {
  const { contacts } = req.body;
  contacts.forEach(contact => {
    const { name, phone, email } = contact;
    connection.query('INSERT INTO emergency_contacts (name, phone, email) VALUES (?, ?, ?)', [name, phone, email], (error, results) => {
      if (error) throw error;
      // Handle successful insertion
    });
  });
  res.send('Contacts saved successfully');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
