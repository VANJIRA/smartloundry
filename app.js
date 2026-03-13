const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const app = express();

const clients = []; // In-memory store for clients
const orders = []; // In-memory store for orders
let orderCounter = 1; // To handle sequential order numbering

// Middleware
app.use(bodyParser.json());

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});

// Input validation middleware
const validateClient = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        logger.error('Client validation failed');
        return res.status(400).send({ error: 'Client name is required' });
    }
    next();
};

const validateOrder = (req, res, next) => {
    const { clientId, service } = req.body;
    if (!clientId || !service) {
        logger.error('Order validation failed');
        return res.status(400).send({ error: 'Client ID and service are required' });
    }
    next();
};

// Clients API endpoints
app.post('/clients', validateClient, (req, res) => {
    const newClient = { id: clients.length + 1, ...req.body };
    clients.push(newClient);
    logger.info('Client created', newClient);
    res.status(201).send(newClient);
});

app.get('/clients', (req, res) => {
    res.send(clients);
});

app.get('/clients/:id', (req, res) => {
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (!client) {
        logger.warn('Client not found');
        return res.status(404).send({ error: 'Client not found' });
    }
    res.send(client);
});

app.put('/clients/:id', validateClient, (req, res) => {
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (!client) {
        logger.warn('Client not found');
        return res.status(404).send({ error: 'Client not found' });
    }
    Object.assign(client, req.body);
    logger.info('Client updated', client);
    res.send(client);
});

app.delete('/clients/:id', (req, res) => {
    const index = clients.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) {
        logger.warn('Client not found');
        return res.status(404).send({ error: 'Client not found' });
    }
    clients.splice(index, 1);
    logger.info('Client deleted', req.params.id);
    res.status(204).send();
});

// Orders API endpoints
app.post('/orders', validateOrder, (req, res) => {
    const newOrder = { id: orderCounter++, ...req.body };
    orders.push(newOrder);
    logger.info('Order created', newOrder);
    res.status(201).send(newOrder);
});

app.get('/orders', (req, res) => {
    res.send(orders);
});

app.get('/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        logger.warn('Order not found');
        return res.status(404).send({ error: 'Order not found' });
    }
    res.send(order);
});

app.put('/orders/:id', validateOrder, (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        logger.warn('Order not found');
        return res.status(404).send({ error: 'Order not found' });
    }
    Object.assign(order, req.body);
    logger.info('Order updated', order);
    res.send(order);
});

app.delete('/orders/:id', (req, res) => {
    const index = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (index === -1) {
        logger.warn('Order not found');
        return res.status(404).send({ error: 'Order not found' });
    }
    orders.splice(index, 1);
    logger.info('Order deleted', req.params.id);
    res.status(204).send();
});

// Startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
