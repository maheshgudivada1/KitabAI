const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('./models/User') // User model
const cors = require('cors')

const app = express()
const port = 5000

// Middleware
app.use(express.json()) // Parse JSON request bodies
app.use(cors()) // Enable CORS for all routes

// Registration Route
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body
  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error_msg: 'Username already exists' })
    }

    const newUser = new User({
      username,
      email,
      password, // Storing plain text password (not secure, just for this example)
    })

    await newUser.save()

    const jwtToken = jwt.sign({ userId: newUser._id }, 'your_secret_key', { expiresIn: '30d' })

    res.json({ jwt_token: jwtToken })
  } catch (error) {
    res.status(500).json({ error_msg: 'Server error during registration' })
  }
})

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ error_msg: 'Invalid username or password' })
    }

    // Check if the plain text password matches
    if (password !== user.password) {
      return res.status(400).json({ error_msg: 'Invalid username or password' })
    }

    const jwtToken = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '30d' })

    res.json({ jwt_token: jwtToken })
  } catch (error) {
    res.status(500).json({ error_msg: 'Server error during login' })
  }
})

// Connect to MongoDB and start server
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/maheshdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })
