const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db'); // Import the database file

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files like CSS
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Use database to authenticate the user
    db.authenticateUser(username, password, (err, user) => {
        if (err) {
            res.send('Error occurred while logging in.');
        } else if (!user) {
            res.send('Invalid credentials. Please try again.');
        } else {
            if (user.type === 'admin') {
                res.redirect('/admin');
            } else {
                res.redirect('/book-issue');
            }
        }
    });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Register a new user
    db.registerUser(username, password, 'user', (err, userId) => {
        if (err) {
            res.send('Registration failed. Username might already be taken.');
        } else {
            res.send('New user registered successfully.');
        }
    });
});

app.get('/book-issue', (req, res) => {
    res.sendFile(__dirname + '/book_issue.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.get('/new-user', (req, res) => {
    res.sendFile(__dirname + '/new_user.html');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
