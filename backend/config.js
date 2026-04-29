// Configurable price list (₹ per piece)
const GARMENT_PRICES = {
  Shirt: 50,
  Pants: 70,
  Saree: 150,
  Suit: 200,
  Jacket: 180,
  Kurta: 80,
  Lehenga: 300,
  Blanket: 250,
  Bedsheet: 120,
  Towel: 40,
  'Salwar Kameez': 100,
  'Coat': 220,
};

const ORDER_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

const JWT_SECRET = process.env.JWT_SECRET || 'laundry_super_secret_key_2024';
const JWT_EXPIRY = '24h';

// Estimated delivery offset in days
const DELIVERY_DAYS = 3;

module.exports = { GARMENT_PRICES, ORDER_STATUSES, JWT_SECRET, JWT_EXPIRY, DELIVERY_DAYS };
