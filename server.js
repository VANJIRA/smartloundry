const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('combined'));

// In-memory database
let items = [];

// Create - Add an item
app.post('/items', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    const newItem = { id: items.length + 1, name };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Read - Get all items
app.get('/items', (req, res) => {
    res.json(items);
});

// Read - Get a single item
app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
});

// Update - Update an item
app.put('/items/:id', (req, res) => {
    const { name } = req.body;
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    item.name = name;
    res.json(item);
});

// Delete - Delete an item
app.delete('/items/:id', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    items.splice(itemIndex, 1);
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
