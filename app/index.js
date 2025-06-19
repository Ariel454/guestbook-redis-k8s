const express = require('express');
const Redis = require('ioredis');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Asumimos que el Service de Kubernetes se llama "redis-service"
// y que Redis está corriendo en el puerto 6379.
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis-service',
  port: 6379,
});

// Endpoint para agregar un mensaje al Guestbook
app.post('/api/messages', async (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ error: 'Se requiere { user, text }' });
  }

  const timestamp = new Date().toISOString();
  const message = `${timestamp} - ${user}: ${text}`;

  try {
    // LPUSH añade el mensaje al inicio de la lista "guestbook:messages"
    await redis.lpush('guestbook:messages', message);
    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error guardando en Redis:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

// Endpoint para leer todos los mensajes (orden: más reciente primero)
app.get('/api/messages', async (req, res) => {
  try {
    // LRANGE 0 -1 devuelve todos los elementos de la lista
    const messages = await redis.lrange('guestbook:messages', 0, -1);
    return res.json({ messages });
  } catch (err) {
    console.error('Error leyendo desde Redis:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

// Health check básico
app.get('/healthz', (req, res) => res.send('ok'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📗 Guestbook app corriendo en puerto ${PORT}`);
});
