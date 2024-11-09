// index.js

const express = require('express');
const app = express();

// Middleware to parse JSON bodies (if needed for POST requests)
app.use(express.json());

// Sample route for testing
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Contact routes
app.get('/contacts', (req, res) => {
  res.send('Here is a list of contacts');
});

app.get('/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  res.send(`Details for contact with ID: ${contactId}`);
});

app.post('/contacts', (req, res) => {
  const newContact = req.body; // assuming JSON body contains contact data
  res.send(`New contact added: ${JSON.stringify(newContact)}`);
});

// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


