const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'users.sqlite'
});

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

sequelize.sync().then(() => {
    console.log('Baza danych zsynchronizowana.');
}).catch(err => {
    console.error('Błąd synchronizacji bazy danych:', err);
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail i hasło są wymagane.' });
    }

    try {
        const newUser = await User.create({ email, password });
        res.status(201).json({ userId: newUser.id });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Użytkownik z tym e-mailem już istnieje.' });
        } else {
            res.status(500).json({ error: 'Nie udało się zarejestrować użytkownika.' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail i hasło są wymagane.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Nie znaleziono użytkownika.' });
        }

        if (password !== user.password) {
            return res.status(401).json({ error: 'Nieprawidłowe hasło.' });
        }

        res.status(200).json({ message: 'Zalogowano pomyślnie.', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się zalogować użytkownika.' });
    }
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}.`);
});
