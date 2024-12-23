const { Client } = require('pg');

// String de Conexão PostgreSQL fornecida pelo Render
const connectionString = 'postgresql://url_shortener_7npw_user:zrAhsUvBCofJPVRboU7pwOXZpBlw1G4Z@dpg-ctk9ustsvqrc738d99g0-a.oregon-postgres.render.com/url_shortener_7npw';

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('Conectado ao banco de dados com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });
