const express = require('express');

const isAuthen = require('../middleware/is-authen');

const prodCtrl = require('../controllers/prodControl');

// express-router
const router = express.Router();

router.get('/products', isAuthen, prodCtrl.fetchProds);
router.get('/add-prod', isAuthen, prodCtrl.addProd);
router.get('/edit-prod/:id', isAuthen, prodCtrl.editProd);

router.post('/save-prod', isAuthen, prodCtrl.saveProd);
router.post('/updt-prod', isAuthen, prodCtrl.updtProd);
router.post('/delt-prod', isAuthen, prodCtrl.deltProd);

exports.routes = router;
// module.exports = router;


/* --- serve static ---
const path = require('path');
const appDir = require('../utils/abs-path');

res.sendFile(
  path.join(appDir, 'views', 'add-prod.html')
);
*/
