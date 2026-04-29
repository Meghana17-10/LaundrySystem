const express = require('express');
const db = require('../db');
const { ORDER_STATUSES } = require('../config');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// GET /api/dashboard
router.get('/', (req, res) => {
  const { total_orders, total_revenue } = db.prepare(
    'SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_revenue FROM orders'
  ).get();

  const statusRows = db.prepare(
    'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
  ).all();

  const orders_per_status = Object.fromEntries(ORDER_STATUSES.map(s => [s, 0]));
  statusRows.forEach(r => { orders_per_status[r.status] = r.count; });

  res.json({ total_orders, total_revenue, orders_per_status });
});

module.exports = router;
