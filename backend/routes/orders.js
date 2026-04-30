const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { GARMENT_PRICES, ORDER_STATUSES, DELIVERY_DAYS } = require('../config');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All order routes require auth
router.use(authenticateToken);

// GET /api/orders/prices  — expose price list to frontend
router.get('/prices', (req, res) => {
  res.json(GARMENT_PRICES);
});

// POST /api/orders  — create order
router.post('/', (req, res) => {
  const { customer_name, phone, garments } = req.body;

  if (!customer_name || !phone || !Array.isArray(garments) || garments.length === 0) {
    return res.status(400).json({ error: 'customer_name, phone, and garments[] are required.' });
  }
  if (!/^[a-zA-Z\s]+$/.test(customer_name)) {
    return res.status(400).json({ error: 'Name must contain letters only.' });
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone must be exactly 10 digits.' });
  }

  const enriched = [];
  for (const g of garments) {
    const price = GARMENT_PRICES[g.name];
    if (!price) return res.status(400).json({ error: `Unknown garment: ${g.name}` });
    if (!g.quantity || g.quantity < 1) return res.status(400).json({ error: `Invalid quantity for ${g.name}` });
    enriched.push({ name: g.name, quantity: g.quantity, price_per_unit: price, subtotal: price * g.quantity });
  }

  const total_amount = enriched.reduce((sum, g) => sum + g.subtotal, 0);
  const order_id = 'ORD-' + uuidv4().slice(0, 8).toUpperCase();

  const estimated_delivery = new Date();
  estimated_delivery.setDate(estimated_delivery.getDate() + DELIVERY_DAYS);

  db.prepare(`
    INSERT INTO orders (order_id, customer_name, phone, garments, total_amount, estimated_delivery)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(order_id, customer_name, phone, JSON.stringify(enriched), total_amount, estimated_delivery.toISOString().split('T')[0]);

  const order = db.prepare('SELECT * FROM orders WHERE order_id = ?').get(order_id);
  res.status(201).json({ ...order, garments: JSON.parse(order.garments) });
});

// GET /api/orders  — list with optional filters: status, name, phone, garment
router.get('/', (req, res) => {
  const { status, name, phone, garment } = req.query;

  let query = 'SELECT * FROM orders WHERE 1=1';
  const params = [];

  if (status) { query += ' AND status = ?'; params.push(status.toUpperCase()); }
  if (name)   { query += ' AND LOWER(customer_name) LIKE ?'; params.push(`%${name.toLowerCase()}%`); }
  if (phone)  { query += ' AND phone LIKE ?'; params.push(`%${phone}%`); }

  query += ' ORDER BY created_at DESC';

  let orders = db.prepare(query).all(...params);
  orders = orders.map(o => ({ ...o, garments: JSON.parse(o.garments) }));

  // Filter by garment type (post-query since garments is JSON)
  if (garment) {
    const g = garment.toLowerCase();
    orders = orders.filter(o => o.garments.some(item => item.name.toLowerCase().includes(g)));
  }

  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE order_id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json({ ...order, garments: JSON.parse(order.garments) });
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${ORDER_STATUSES.join(', ')}` });
  }

  const result = db.prepare(`
    UPDATE orders SET status = ?, updated_at = datetime('now') WHERE order_id = ?
  `).run(status, req.params.id);

  if (result.changes === 0) return res.status(404).json({ error: 'Order not found.' });

  const order = db.prepare('SELECT * FROM orders WHERE order_id = ?').get(req.params.id);
  res.json({ ...order, garments: JSON.parse(order.garments) });
});

module.exports = router;
