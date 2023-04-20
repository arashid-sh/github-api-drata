const express = require('express');
const app = express();

app.use(express.json());

const users = [
  {
    login: 'github_user1',
    id: 1,
    plan: { name: 'free' },
  },
  {
    login: 'github_user2',
    id: 2,
    plan: { name: 'pro' },
  },
];

const authenticatedUser = {
  login: 'authenticated_user',
  id: 100,
  plan: { name: 'premium' },
};

// Get list of users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get authenticated User
app.get('/user', (req, res) => {
  res.json(authenticatedUser);
});

// Patch user
app.patch('/user', (req, res) => {
  const { plan } = req.body;

  if (plan && typeof plan.name === 'string') {
    authenticatedUser.plan.name = plan.name;
    res.json(authenticatedUser);
  } else {
    res.status(400).json({ message: 'Invalid request body' });
  }
});

// Get A user
app.get('/users/:username', (req, res) => {
  const users = {
    user1: {
      login: 'user1',
      id: 1,
      plan: { name: 'free' },
    },
    user2: {
      login: 'user2',
      id: 2,
      plan: { name: 'pro' },
    },
  };

  const user = users[req.params.username];
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// To handle unspported HTTP methods.
app.use((req, res, next) => {
  res.status(405).json({ message: 'Method not allowed' });
});

module.exports = app;
