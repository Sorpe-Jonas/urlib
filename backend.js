const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
    connectionString: 'postgresql://url_shortener_7npw_user:zrAhsUvBCofJPVRboU7pwOXZpBlw1G4Z@dpg-ctk9ustsvqrc738d99g0-a.oregon-postgres.render.com/url_shortener_7npw',
    ssl: {
        rejectUnauthorized: false,
    },
});

app.use(express.json());

// Rota para encurtar a URL
app.post('/encurtar', async (req, res) => {
    const { url } = req.body;
    const id = Math.random().toString(36).substring(2, 8); // Gerar ID único
    try {
        // Inserir no banco de dados
        const result = await pool.query('INSERT INTO urls (original_url, short_id) VALUES ($1, $2) RETURNING id', [url, id]);
        res.json({ short_url: `https://urlib.onrender.com/${id}` });
    } catch (error) {
        console.error('Erro ao salvar no banco de dados', error);
        res.status(500).send('Erro ao processar a URL');
    }
});

// Rota para redirecionar a URL encurtada
app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT original_url FROM urls WHERE short_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('URL não encontrada');
        }
        res.redirect(result.rows[0].original_url);
    } catch (error) {
        console.error('Erro ao acessar o banco de dados', error);
        res.status(500).send('Erro ao acessar a URL');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
