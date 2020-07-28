/* --- Stripe : Test --- */

const auth = {
  api_k: process.env.STRIPE_API_K,
  token: process.env.STRIPE_TOKEN,
};

module.exports = auth;
