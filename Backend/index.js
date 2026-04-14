const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// 1. Connect to MongoDB (Make sure MongoDB is running on your PC)
mongoose.connect('mongodb://127.0.0.1:27017/auth_db')
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Connection error:", err));

// 2. Define the User Schema (The blueprint)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// 3. Your Signup Route
app.post('/signup', async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    await newUser.save();
    res.status(201).send("User registered successfully!");
  } catch (error) {
    res.status(500).send("Error saving user: " + error.message);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));