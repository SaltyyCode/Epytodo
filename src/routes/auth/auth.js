const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const auth = require('../../middleware/auth');

const router = express.Router();
const is_validMail = email => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email.toLowerCase());

router.post('/register', async (req, res) => {
    const { email, password, name, firstname } = req.body;
    if (!email || !password || !name || !firstname || !is_validMail(email)) {
        return res.status(400).json({ msg: "Bad parameter" });
    }

    try {
        const [users] = await pool.query('SELECT id FROM user WHERE email = ?', [email.toLowerCase()]);
        if (users.length) {
            return res.status(409).json({ msg: 'Account already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)', [email.toLowerCase(), hashedPassword, name, firstname]);

        const newUser = { id: result.insertId, email: email.toLowerCase() };
        const token = jwt.sign(newUser, process.env.SECRET, { expiresIn: '1h' });
        res.status(201).json({ token: `${token}` });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || !is_validMail(email)) {
        return res.status(400).json({ msg: "Bad parameter" });
    }
    try {
        const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email.toLowerCase()]);
        if (!users.length) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: `${token}` });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
