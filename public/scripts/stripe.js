/* --- Stripe : Client (legacy) --- */
const api_k = document.getElementById('api-k').textContent;
const stripe = Stripe(api_k); // TEST_API_KEY

const button = document.getElementById('btn-order');
const sessId = document.getElementById('sessionId');

button.addEventListener('click', () => {
  stripe.redirectToCheckout({
    sessionId: sessId.textContent
  });
});
