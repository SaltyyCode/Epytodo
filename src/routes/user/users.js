const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const errorHandler = require('../../middleware/errorHandler');

router.get('/:identifier', auth, async (req, res) => {
    try {
        const { identifier } = req.params;
        let user;

        if (isNaN(parseInt(identifier))) {
            [user] = await pool.query('SELECT * FROM user WHERE email = ?', [identifier]);
        } else {
            [user] = await pool.query('SELECT * FROM user WHERE id = ?', [identifier]);
        }

        if (user.length === 0) {
            return res.status(404).json({ msg: "Not found" });
        }

        const { password, ...rest } = user[0];

        const response = {
            id: rest.id,
            email: rest.email,
            password: password,
            created_at: rest.created_at.toISOString().replace('T', ' ').slice(0, 19),
            firstname: rest.firstname,
            name: rest.name
        };

        res.json(response);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
});

router.put('/:id', auth, async (req, res, next) => {
    const { email, password, firstname, name } = req.body;
    const { id } = req.params;

    if (req.user.id !== parseInt(id)) {
        return next({ type: 'invalid-token' });
    }

    if (!email || !password || !firstname || !name) {
        return next({ type: 'bad-request' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?',
            [email, hashedPassword, firstname, name, id]
        );

        if (result.affectedRows === 0) {
            return next({ type: 'not-found' });
        }

        res.json({ id, email, password: hashedPassword, firstname, name });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM user WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return next({ type: 'not-found' });
        }
        res.status(200).json({ msg: `Successfully deleted record number: ${id}` });
    } catch (error) {
        console.error('Error deleting user:', error);
        next({ type: 'internal-server-error', error: error.message });
    }
});

router.use(errorHandler);
module.exports = router;
