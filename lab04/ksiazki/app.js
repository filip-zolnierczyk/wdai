
const express = require('express');
const { Book } = require('./models'); 

const app = express();
const port = 3000;


app.use(express.json());


app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Coś poszło nie tak!' });
    }
});

app.get('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findByPk(id);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ error: 'Książka nie została znaleziona' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Coś poszło nie tak!' });
    }
});

app.post('/api/books', async (req, res) => {
    const { title, author, year } = req.body; 
    try {
        const newBook = await Book.create({ title, author, year }); 
        res.status(201).json({ id: newBook.id });
    } catch (error) {
        console.error('Błąd przy dodawaniu książki:', error);
        res.status(500).json({ error: 'Nie udało się dodać książki' });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Book.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: 'Książka została usunięta' });
        } else {
            res.status(404).json({ error: 'Książka nie została znaleziona' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Nie udało się usunąć książki' });
    }
});

app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
