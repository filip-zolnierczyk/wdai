
const express = require('express');
const { Book } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

router.get('/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).send('Książka nie znaleziona');
  res.json(book);
});

router.post('/', async (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) return res.status(400).send('Wszystkie pola są wymagane');

  const newBook = await Book.create({ title, author, year });
  res.status(201).json({ id: newBook.id });
});

router.delete('/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).send('Książka nie znaleziona');

  await book.destroy();
  res.send('Książka usunięta');
});

module.exports = router;
