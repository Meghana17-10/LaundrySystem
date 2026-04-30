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

// Estimated delivery: base 2 days + 1 extra day per 5 total garment pieces
function calcDeliveryDays(totalQty) {
  return 2 + Math.ceil(totalQty / 5);
}

module.exports = { GARMENT_PRICES, ORDER_STATUSES, JWT_SECRET, JWT_EXPIRY, calcDeliveryDays };
