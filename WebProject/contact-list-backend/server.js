const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for simplicity
let contacts = [];

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Contact List Manager API!");
});

// Add a new contact
app.post("/addContact", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }
  // Check for duplicates
  const duplicate = contacts.find((contact) => contact.email === email);
  if (duplicate) {
    return res.status(400).json({ message: "Email already exists." });
  }
  const contact = { id: contacts.length + 1, name, email };
  contacts.push(contact);
  res.status(201).json(contact);
});

// Get all contacts
app.get("/getContacts", (req, res) => {
  res.status(200).json(contacts);
});

// Search contacts
app.get("/searchContacts", (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }
  const results = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase())
  );
  res.status(200).json(results);
});

// Delete a contact
app.delete("/deleteContact/:id", (req, res) => {
  const { id } = req.params;
  const index = contacts.findIndex((contact) => contact.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: "Contact not found." });
  }
  contacts.splice(index, 1);
  res.status(200).json({ message: "Contact deleted successfully." });
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
