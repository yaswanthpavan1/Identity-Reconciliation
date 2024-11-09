const express = require('express');
const { Sequelize } = require('sequelize');
const router = express.Router();
const { Contact } = require('../models'); // Import the Contact model

router.post('/', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    // Input validation
    if (!email && !phoneNumber) {
      return res.status(400).json({ error: 'Email or PhoneNumber is required' });
    }

    // Search for existing contacts matching the email or phone number
    let contact = await Contact.findOne({
      where: {
        [Sequelize.Op.or]: [
          { email },
          { phoneNumber }
        ]
      }
    });

    if (!contact) {
      // No contact found, create a new one
      contact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: 'primary',
      });

      // Return the new contact details
      return res.status(201).json({
        primaryContactId: contact.id,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: [],
      });
    } else {
      // If contact exists, return primary contact information
      // Additionally, handle secondary contacts if there are any
      const secondaryContacts = await Contact.findAll({
        where: { linkedId: contact.id },
      });

      const secondaryContactIds = secondaryContacts.map(c => c.id);

      return res.status(200).json({
        primaryContactId: contact.id,
        emails: [contact.email].filter(Boolean), // Return email if exists
        phoneNumbers: [contact.phoneNumber].filter(Boolean), // Return phone number if exists
        secondaryContactIds,
      });
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
