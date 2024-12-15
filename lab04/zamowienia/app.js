const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const axios = require('axios');

const app = express();
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'orders.sqlite'
});

const Order = sequelize.define('Order', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const BOOKS_SERVICE_URL = 'http://localhost:3000/api/books/';

sequelize.sync().then(() => {
  console.log('Database synced.');
}).catch(err => {
  console.error('Error syncing database:', err);
});


app.get('/api/orders', async (req, res) => {
    try {
      const orders = await Order.findAll();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve orders.' });
    }
});


app.get('/api/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.findAll({ where: { userId } });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  if (!userId || !bookId || !quantity) {
    return res.status(400).json({ error: 'Invalid request data.' });
  }

  try {
    const bookResponse = await axios.get(`${BOOKS_SERVICE_URL}${bookId}`);
    if (bookResponse.status !== 200) {
      return res.status(404).json({ error: `Book with ID ${bookId} not found.` });
    }

    const order = await Order.create({ userId, bookId, quantity });
    res.status(201).json({ orderId: order.id });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: `Book with ID ${bookId} not found.` });
    } else {
      res.status(500).json({ error: 'Failed to create order.' });
    }
  }
});

app.delete('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: `Order with ID ${orderId} not found.` });
    }

    await order.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order.' });
  }
});

app.patch('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { bookId, quantity } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: `Order with ID ${orderId} not found.` });
    }

    if (bookId) {
      const bookResponse = await axios.get(`${BOOKS_SERVICE_URL}${bookId}`);
      if (bookResponse.status !== 200) {
        return res.status(404).json({ error: `Book with ID ${bookId} not found.` });
      }
      order.bookId = bookId;
    }

    if (quantity) {
      order.quantity = quantity;
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: `Book with ID ${bookId} not found.` });
    } else {
      res.status(500).json({ error: 'Failed to update order.' });
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
