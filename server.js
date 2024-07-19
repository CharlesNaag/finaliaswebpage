const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'css')));

// Session configuration
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Note: For production, use 'secure: true' with HTTPS
}));

//Database connection
const pool = new Pool({
    host: process.env.PG_HOST || 'dpg-cq7k6i5ds78s73d8fccg-a',
    user: process.env.PG_USER || 'iaswebpage_user',
    password: process.env.PG_PASSWORD || 'JqaiElt5jmcURnjyNYxm5K6gUUdfj3dA',
    database: process.env.PG_DATABASE || 'iaswebpage',
    port: parseInt(process.env.PG_PORT, 10) || 5432
});

//const pool = new Pool({
    //host: 'localhost', // Use 'localhost' for a local database
    //user: 'postgres',  // Your PostgreSQL username
   // password: 'erick', // Your PostgreSQL password
    //database: 'iaswebpagefinal', // The name of the database you created
   // port: 5432 // Default PostgreSQL port
  //});

pool.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to database');
    }
});

// Route for serving home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for about.html
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Route for contact.html
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Route for landing.html
app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Route for login_signup.html
app.get('/login_signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login_signup.html'));
});

// Route for verify.html
app.get('/verify', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'verify.html'));
});

app.get('/reset_password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/reset_password'));
});


const loginRoute = require('./backend/login');
const registerRoute = require('./backend/register');
const forgotPasswordRoute = require('./backend/forgot_password');
const verifyRoute = require('./backend/verify');

app.use('/api', loginRoute);
app.use('/api', registerRoute);
app.use('/api', forgotPasswordRoute);
app.use('/api', verifyRoute);

// Retrieve all bulletins
app.get('/api/bulletins', (req, res) => {
    const selectQuery = 'SELECT * FROM bulletins ORDER BY id DESC';
    pool.query(selectQuery, (err, result) => {
        if (err) {
            console.error('Error retrieving bulletins', err);
            res.status(500).json({ error: 'Error retrieving bulletins' });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

// Create a new bulletin
app.post('/api/bulletins', (req, res) => {
    const { title, author, content } = req.body;
    const insertQuery = 'INSERT INTO bulletins (title, author, content) VALUES ($1, $2, $3) RETURNING *';
    pool.query(insertQuery, [title, author, content], (err, result) => {
        if (err) {
            console.error('Error inserting bulletin', err);
            res.status(500).json({ error: 'Error inserting bulletin' });
        } else {
            res.status(201).json(result.rows[0]);
        }
    });
});

// Update a bulletin
app.put('/api/bulletins/:id', (req, res) => {
    const bulletinId = req.params.id;
    const { title, author, content } = req.body;
    const updateQuery = 'UPDATE bulletins SET title = $1, author = $2, content = $3 WHERE id = $4 RETURNING *';
    pool.query(updateQuery, [title, author, content, bulletinId], (err, result) => {
        if (err) {
            console.error('Error updating bulletin', err);
            res.status(500).json({ error: 'Error updating bulletin' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    });
});

// Delete a bulletin
app.delete('/api/bulletins/:id', (req, res) => {
    const bulletinId = req.params.id;
    const deleteQuery = 'DELETE FROM bulletins WHERE id = $1';
    pool.query(deleteQuery, [bulletinId], (err, result) => {
        if (err) {
            console.error('Error deleting bulletin', err);
            res.status(500).json({ error: 'Error deleting bulletin' });
        } else {
            res.status(200).json({ message: 'Bulletin deleted successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = pool; // Export pool after it has been initialized
