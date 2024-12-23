const express = require('express');
const { Pool } = require('pg');
const crypto = require('crypto'); // Para gerar o ID único
const app = express();

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
    connectionString: 'postgresql://url_shortener_7npw_user:zrAhsUvBCofJPVRboU7pwOXZpBlw1G4Z@dpg-ctk9ustsvqrc738d99g0-a.oregon-postgres.render.com/url_shortener_7npw',
});

// Configuração para aceitar JSON
app.use(express.json());

// Rota para encurtar URL
app.post('/encurtar', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL não fornecida.' });
    }

    try {
        // Gerar um ID único para a URL
        const uniqueId = crypto.randomBytes(3).toString('hex'); // Gera um ID único de 6 caracteres (3 bytes)
        const shortenedUrl = `https://urlib.onrender.com/${uniqueId}`;

        // Salvar a URL no banco de dados
        await pool.query('INSERT INTO urls (original_url, unique_id) VALUES ($1, $2)', [url, uniqueId]);

        // Retornar a URL encurtada
        res.json({ shortenedUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao encurtar a URL.' });
    }
});

// Rota para redirecionamento da URL encurtada
app.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Procurar a URL original usando o ID
        const result = await pool.query('SELECT original_url FROM urls WHERE unique_id = $1', [id]);

        if (result.rows.length > 0) {
            // Redirecionar para a URL original
            res.redirect(result.rows[0].original_url);
        } else {
            res.status(404).json({ error: 'URL encurtada não encontrada.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao redirecionar.' });
    }
});

// Servir o frontend
app.use(express.static('public'));

// Inicializar o servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
