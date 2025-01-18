import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");

  // Fetch contacts from the server
  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/getContacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add a new contact
  const addContact = async () => {
    if (!name || !email) {
      alert("Name and email are required.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5001/addContact", {
        name,
        email,
      });
      setContacts([...contacts, response.data]);
      setName("");
      setEmail("");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Search contacts
  const searchContacts = async () => {
    if (!search) {
      fetchContacts();
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5001/searchContacts?query=${search}`
      );
      setContacts(response.data);
    } catch (error) {
      console.error("Error searching contacts:", error);
    }
  };

  // Delete a contact
  const deleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/deleteContact/${id}`);
      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Contact List Manager</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={addContact}>Add Contact</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={searchContacts}>Search</button>
      </div>

      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>
                <button onClick={() => deleteContact(contact.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
