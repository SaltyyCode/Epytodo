const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const auth = require('../../middleware/auth');
const errorHandler = require('../../middleware/errorHandler');

router.get('/', auth, async (req, res, next) => {
    try {
        const [todos] = await pool.query('SELECT * FROM todo');
        if (todos.length === 0) {
            return res.status(404).json({ msg: "Not found" });
        }
        res.json(todos);
    } catch (error) {
        console.error('Error fetching all todos:', error);
        next({ type: 'internal-server-error', error: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await pool.query('SELECT * FROM todo WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ msg: "Not found" });
        }
        const todo = results[0];
        const formattedResponse = {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            created_at: todo.created_at.toISOString().replace('T', ' ').slice(0, 19),
            due_time: todo.due_time.toISOString().replace('T', ' ').slice(0, 19),
            user_id: todo.user_id,
            status: todo.status
        };
        res.json(formattedResponse);
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.post('/', auth, async (req, res) => {
    const { title, description, due_time, user_id, status } = req.body;

    if (!title || !description || !due_time || !user_id || !status) {
        return res.status(400).json({ msg: "Bad parameter" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)',
            [title, description, new Date(due_time), user_id, status]
        );
        const newTodo = {
            id: result[0].insertId,
            title,
            description,
            created_at: new Date(),
            due_time,
            user_id,
            status
        };
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM todo WHERE id = ?', [id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ msg: "Not found" });
        }

        res.status(200).json({ msg: `Successfully deleted record number: ${id}` });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { title, description, due_time, user_id, status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?',
            [title, description, new Date(due_time), user_id, status, id]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ msg: "Not found" });
        }

        const [updatedResults] = await pool.query('SELECT * FROM todo WHERE id = ?', [id]);
        if (updatedResults.length === 0) {
            return res.status(404).json({ msg: "Not found" });
        }
        const updatedTodo = updatedResults[0];
        const formattedResponse = {
            id: updatedTodo.id,
            title: updatedTodo.title,
            description: updatedTodo.description,
            created_at: updatedTodo.created_at.toISOString().replace('T', ' ').slice(0, 19),
            due_time: updatedTodo.due_time.toISOString().replace('T', ' ').slice(0, 19),
            user_id: updatedTodo.user_id,
            status: updatedTodo.status
        };

        res.json(formattedResponse);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.use(errorHandler);
module.exports = router;