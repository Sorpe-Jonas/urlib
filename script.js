const express = require('express');
const { Client } = require('pg');
const shortid = require('shortid');
const app = express();
const port = process.env.PORT || 3000;

// Conectar ao banco de dados PostgreSQL usando a URL fornecida
const client = new Client({
    connectionString: 'postgresql://url_shortener_7npw_user:zrAhsUvBCofJPVRboU7pwOXZpBlw1G4Z@dpg-ctk9ustsvqrc738d99g0-a.oregon-postgres.render.com/url_shortener_7npw',
    ssl: {
        rejectUnauthorized: false
    }
});
client.connect();

// Middleware para parsing de JSON
app.use(express.json());

// Endpoint para encurtar URL
app.post('/encurtar', async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: 'URL longa é obrigatória' });
    }

    // Gerar um código único para a URL
    const shortCode = shortid.generate();

    // Salvar no banco de dados
    try {
        const query = 'INSERT INTO urls (long_url, short_code) VALUES ($1, $2) RETURNING *';
        const values = [longUrl, shortCode];
        const result = await client.query(query, values);

        // Responder com a URL encurtada
        const shortUrl = `https://seu-dominio-render/${shortCode}`;
        res.json({ shortUrl });
    } catch (err) {
        console.error('Erro ao salvar a URL:', err);
        res.status(500).json({ error: 'Erro ao encurtar a URL' });
    }
});

// Endpoint para redirecionar URL encurtada
app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    // Buscar URL longa no banco de dados
    try {
        const query = 'SELECT long_url FROM urls WHERE short_code = $1';
        const result = await client.query(query, [shortCode]);

        if (result.rows.length > 0) {
            res.redirect(result.rows[0].long_url);
        } else {
            res.status(404).json({ error: 'URL não encontrada' });
        }
    } catch (err) {
        console.error('Erro ao buscar a URL:', err);
        res.status(500).json({ error: 'Erro ao acessar a URL' });
    }
});

// Endpoint para verificar se o banco de dados está conectado
app.get('/status', async (req, res) => {
    try {
        // Realizar uma consulta simples para verificar a conexão
        await client.query('SELECT NOW()');
        res.status(200).json({ status: 'Conectado ao banco de dados!' });
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        res.status(500).json({ status: 'Falha na conexão com o banco de dados.' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
