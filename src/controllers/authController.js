const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (default role = user)
    const user = new User({ email, passwordHash });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Compare password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
