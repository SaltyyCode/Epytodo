const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const auth = require('../../middleware/auth');
const errorHandler = require('../../middleware/errorHandler');

router.get('/', auth, async (req, res, next) => {
    const email = req.user.email;
    try {
        const [results] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        if (results.length > 0) {
            const user = results[0];
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            next({ type: 'not-found' });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/todos', auth, async (req, res, next) => {
    const userId = req.user.id;
    try {
        const [todos] = await pool.query('SELECT * FROM todo WHERE user_id = ?', [userId]);
        if (todos.length === 0) {
            return res.status(404).json({ msg: "Not found" });
        }
        res.json(todos);
    } catch (error) {
        next(error);
    }
});

router.use(errorHandler);
module.exports = router;
