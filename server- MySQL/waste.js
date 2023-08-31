const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Parse incoming request data
app.use(bodyParser.urlencoded({ extended: true }));

// Mock user data (replace with a database in real scenario)
const users = [
  { username: 'u', password: 'p' },
  { username: 'us', password: 'p' },
];

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Route to display the login form
app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <input type="text" name="username" placeholder="Username" /><br>
      <input type="password" name="password" placeholder="Password" /><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Route to process login data
app.post('/login', (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid username or password');
  }
});

// Protected route accessible only after login
app.get('/dashboard', isAuthenticated, (req, res) => {
  const user = req.session.user;
  res.send(`Welcome to your dashboard, ${user.username}!`);
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
