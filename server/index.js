const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Раздаём твой существующий сайт из корня проекта
app.use(express.static(path.join(__dirname, '..')));

// ---------- ТОВАРЫ ----------
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, size, maxPrice, sale, sort } = req.query;

    let query = `
      SELECT p.*, c.name AS category
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `;
    const values = [];

    if (category && category !== 'all') {
      values.push(category);
      query += ` AND c.name = $${values.length}`;
    }
    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      query += ` AND LOWER(p.name) LIKE $${values.length}`;
    }
    if (maxPrice) {
      values.push(Number(maxPrice));
      query += ` AND p.price <= $${values.length}`;
    }
    if (sale === 'true') {
      query += ` AND p.old_price IS NOT NULL`;
    }
    if (size && size !== 'all') {
      values.push(size);
      query += ` AND EXISTS (SELECT 1 FROM product_sizes ps
                            WHERE ps.product_id = p.id AND ps.size = $${values.length})`;
    }

    if (sort === 'price-asc') query += ` ORDER BY p.price ASC`;
    else if (sort === 'price-desc') query += ` ORDER BY p.price DESC`;
    else if (sort === 'name') query += ` ORDER BY p.name ASC`;
    else query += ` ORDER BY p.id ASC`;

    const result = await pool.query(query, values);

    const ids = result.rows.map(r => r.id);
    const sizesMap = {};
    if (ids.length) {
      const sz = await pool.query(
        `SELECT product_id, size, stock FROM product_sizes WHERE product_id = ANY($1)`,
        [ids]
      );
      sz.rows.forEach(r => {
        (sizesMap[r.product_id] ||= []).push({ size: r.size, stock: r.stock });
      });
    }

    res.json(result.rows.map(p => ({
      ...p,
      oldPrice: p.old_price,
      sizes: (sizesMap[p.id] || []).filter(s => s.stock > 0).map(s => s.size)
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await pool.query(
      `SELECT p.*, c.name AS category FROM products p
       LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = $1`,
      [req.params.id]
    );
    if (!p.rows.length) return res.status(404).json({ error: 'Not found' });

    const sz = await pool.query(
      `SELECT size, stock FROM product_sizes WHERE product_id = $1`,
      [req.params.id]
    );

    const product = p.rows[0];
    product.oldPrice = product.old_price;
    product.sizes = sz.rows.filter(s => s.stock > 0).map(s => s.size);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// ---------- КАТЕГОРИИ ----------
app.get('/api/categories', async (req, res) => {
  const r = await pool.query('SELECT * FROM categories ORDER BY id');
  res.json(r.rows);
});

// ---------- ЗАКАЗЫ ----------
app.post('/api/orders', async (req, res) => {
  const { customer_name, customer_email, items } = req.body;
  if (!customer_name || !customer_email || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'Неверные данные' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let total = 0;
    const detailed = [];
    for (const it of items) {
      const r = await client.query('SELECT price FROM products WHERE id=$1', [it.product_id]);
      if (!r.rows.length) throw new Error('Товар не найден');
      const price = Number(r.rows[0].price);
      total += price * it.quantity;
      detailed.push({ ...it, price });
    }

    const order = await client.query(
      `INSERT INTO orders (customer_name, customer_email, total)
       VALUES ($1, $2, $3) RETURNING id`,
      [customer_name, customer_email, total]
    );
    const orderId = order.rows[0].id;

    for (const it of detailed) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, size, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, it.product_id, it.size, it.quantity, it.price]
      );
      await client.query(
        `UPDATE product_sizes SET stock = stock - $1
         WHERE product_id = $2 AND size = $3 AND stock >= $1`,
        [it.quantity, it.product_id, it.size]
      );
    }

    await client.query('COMMIT');
    res.json({ orderId, total });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});
// ---------- СООБЩЕНИЯ (КОНТАКТЫ) ----------
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Заполните обязательные поля' });
    }

    await pool.query(
      `INSERT INTO messages (name, email, topic, message)
       VALUES ($1, $2, $3, $4)`,
      [name, email, topic, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка базы данных' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));