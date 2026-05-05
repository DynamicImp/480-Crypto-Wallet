const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite' });

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }
});

sequelize.sync().then(async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  await User.findOrCreate({
    where: { username: 'admin' },
    defaults: { password: hashedPassword }
  });
  console.log("Database synced! Use admin / password123 to login.");
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));