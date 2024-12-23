const express = require('express');
const { Client } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// URL de conexão com o banco de dados
const connectionString = 'postgresql://url_shortener_7npw_user:zrAhsUvBCofJPVRboU7pwOXZpBlw1G4Z@dpg-ctk9ustsvqrc738d99g0-a.oregon-postgres.render.com/url_shortener_7npw';

// Criando cliente PostgreSQL
const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false  // Necessário para conexões seguras
  }
});

// Verificando a conexão com o banco de dados
client.connect()
  .then(() => {
    console.log('Conexão com o banco de dados bem-sucedida');
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
  });

// Endpoint para verificar o status da conexão
app.get('/status', async (req, res) => {
  try {
    // Realizando uma consulta simples para testar a conexão
    await client.query('SELECT NOW()');
    console.log('Banco de dados está acessível');
    res.status(200).json({ status: 'Conexão com o banco de dados bem-sucedida!' });
  } catch (err) {
    console.error('Erro ao consultar o banco de dados:', err.stack);
    res.status(500).json({ status: 'Erro ao conectar ao banco de dados.' });
  }
});

// Configuração do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
