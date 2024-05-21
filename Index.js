const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Twilio credentials
const accountSid = 'ACc98e0463e829e826001a6b71495b4b56';
const authToken = '02441729d915ed35668edb1164bc8a18';

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Dictionary object with sample word meanings
const dictionary = {
  "hello": "an expression of greeting",
  "world": "the earth, together with all of its countries and peoples",
  "apple": "a round fruit with red or green skin and a whitish inside",
  // Add more word meanings as needed
};

// Function to handle incoming messages and reply with the meaning if the word exists
function handleMessage(message) {
  const word = message.toLowerCase().trim(); // Convert the message to lowercase and remove whitespace

  if (dictionary[word]) {
    return dictionary[word];
  } else {
    return "Sorry, I don't know the meaning of that word.";
  }
}

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint to handle incoming WhatsApp messages
app.post('/webhook', (req, res) => {
  const messageBody = req.body.Body;
  const senderPhoneNumber = req.body.From;

  const reply = handleMessage(messageBody);

  // Send reply via Twilio
  client.messages.create({
    body: reply,
    from: 'whatsapp:+2347062030169', // Replace TWILIO_PHONE_NUMBER with your Twilio phone number
    to: senderPhoneNumber
  }).then(() => {
    res.status(200).end();
  }).catch((err) => {
    console.error("Error sending message:", err);
    res.status(500).end();
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
  
