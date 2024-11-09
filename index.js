// index.js

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = 3000;

// Database connection setup (adjust settings as necessary)
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite', // Change to 'mysql' if using MySQL
  storage: './database.sqlite', // Path to SQLite database file
});

// Define the 'Contact' model
const Contact = sequelize.define('Contact', {
  // Define the columns for the 'contacts' table
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  // Optional settings for the model (e.g., table name)
  tableName: 'contacts',
  timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
});

// Sync the database and create the 'contacts' table if it doesn't exist
sequelize.sync()
  .then(() => {
    console.log('Database synced...');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Sample route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to display all contacts from the database
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll(); // Fetch all contacts from the database
    res.json(contacts); // Send the contacts as a JSON response
  } catch (error) {
    res.status(500).send('Error fetching contacts: ' + error.message);
  }
});

// Route to add a new contact (POST request)
app.post('/contacts', express.json(), async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  try {
    const newContact = await Contact.create({ name, email }); // Create a new contact
    res.status(201).json(newContact); // Respond with the newly created contact
  } catch (error) {
    res.status(500).send('Error adding contact: ' + error.message);
  }
});

// Connect to the database and start the server
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

