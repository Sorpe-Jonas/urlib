const express = require('express');
const { Pool } = require('pg');
const app = express();

// Conexão com o banco de dados PostgreSQL (aqui usamos a URL de conexão que você forneceu)
const pool = new Pool({
    connectionString: 'postgresql://url_shortener_7npw_user:zrAhsUvBCofJPVRboU7pwOXZpBlw1G4Z@dpg-ctk9ustsvqrc738d99g0-a.oregon-postgres.render.com/url_shortener_7npw',
});

// Configuração para aceitar JSON
app.use(express.json());

// Rota para encurtar URL
app.post('/encurtar', async (req, res) => {
    const { url } = req.body;

    try {
        // Gerar um código curto simples (usando o hash da URL, pode ser melhorado)
        const hash = Buffer.from(url).toString('base64').substring(0, 6); // Exemplo simples
        const shortenedUrl = `https://seu-dominio.com/${hash}`;

        // Salvar no banco de dados
        await pool.query('INSERT INTO urls (original_url, shortened_url) VALUES ($1, $2)', [url, shortenedUrl]);

        // Retornar a URL encurtada
        res.json({ shortenedUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao encurtar a URL' });
    }
});

// Servir o frontend
app.use(express.static('public'));

// Inicializar o servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
