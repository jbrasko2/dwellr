import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
