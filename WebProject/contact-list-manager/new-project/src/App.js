import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [highlightedRows, setHighlightedRows] = useState([]); // For search highlighting
  const [isHome, setIsHome] = useState(true); // For navigating to home page

  // Fetch contacts from the server
  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/getContacts");
      setContacts(response.data);
      setHighlightedRows([]); // Clear highlights on fetch
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Validate email format
  const validateEmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  // Check for duplicate emails
  const isDuplicateEmail = (email) => {
    return contacts.some((contact) => contact.email === email);
  };

  // Add a new contact
  const addContact = async () => {
    if (!name || !email) {
      alert("Name and email are required.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email format. Please use an @gmail.com email address.");
      return;
    }

    if (isDuplicateEmail(email)) {
      alert("This email is already registered.");
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

      if (response.data.length > 0) {
        setHighlightedRows(response.data.map((contact) => contact.id));
        alert("Search Found");
      } else {
        setHighlightedRows([]);
        alert("Search Not Found");
      }

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

  // Navigate to Home Page
  const goToHome = () => {
    setIsHome(true);
  };

  // Navigate to Contact List
  const goToContacts = () => {
    setIsHome(false);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>{isHome ? "Welcome to the Home Page" : "Contact List Manager"}</h1>
        <button className="btn" onClick={goToHome}>
          Home Page
        </button>
        <button className="btn" onClick={goToContacts}>
          Contact List
        </button>
      </div>

      {isHome ? (
        <div className="home-content">
          <p>Welcome to the Contact Management Application!</p>
          <p>Click "Contact List" to manage your contacts.</p>
        </div>
      ) : (
        <>
          <div className="form-section">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn add-btn" onClick={addContact}>
              Add Contact
            </button>
          </div>

          <div className="search-section">
            <input
              type="text"
              placeholder="Search by Name or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn search-btn" onClick={searchContacts}>
              Search
            </button>
          </div>

          <div className="table-section">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={
                      highlightedRows.includes(contact.id) ? "highlight-blue" : ""
                    }
                  >
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>
                      <button
                        className="btn delete-btn"
                        onClick={() => deleteContact(contact.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
