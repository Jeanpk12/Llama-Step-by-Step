import express from 'express';
import { generateResponse } from './g1.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Para arquivos estáticos, como HTML/CSS

app.post('/generate', async (req, res) => {
    const { query } = req.body;
    
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const response = await generateResponse(query);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(new URL('./public/index.html', import.meta.url)); // Envia o HTML para o cliente
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
