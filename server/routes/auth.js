const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User') // User model
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = 5000

app.use(express.json()) // Middleware to parse JSON request bodies
app.use(cors()) // Enable CORS for all routes

// Registration Route
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error_msg: 'Username already exists' })
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    // Generate JWT token
    const jwtToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

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

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ error_msg: 'Invalid username or password' })
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.json({ jwt_token: jwtToken })
  } catch (error) {
    res.status(500).json({ error_msg: 'Server error during login' })
  }
})

// Connect to the database and start the server
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://maheshgudivada55:Mahesh%4055@admin.n2ajs.mongodb.net/?retryWrites=true&w=majority&appName=admin', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })
