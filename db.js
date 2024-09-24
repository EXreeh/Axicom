const sqlite3 = require('sqlite3').verbose();

// Create a new database (or open if it exists)
const db = new sqlite3.Database('./library.db');

// Create tables if they don't exist
db.serialize(() => {
    // Users table to store user credentials
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        type TEXT
    )`);

    // Books table for book issue records (optional, for book-related operations)
    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_name TEXT,
        issue_date TEXT,
        return_date TEXT,
        issued_by INTEGER,
        FOREIGN KEY (issued_by) REFERENCES users(id)
    )`);
});

// Function to add a new user (used for registration)
function registerUser(username, password, type, callback) {
    db.run(`INSERT INTO users (username, password, type) VALUES (?, ?, ?)`,
        [username, password, type],
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, this.lastID); // Return user ID on success
            }
        });
}

// Function to verify login credentials
function authenticateUser(username, password, callback) {
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, password],
        (err, row) => {
            if (err) {
                callback(err);
            } else {
                callback(null, row); // Return user data if found
            }
        });
}

module.exports = {
    registerUser,
    authenticateUser
};
